import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import State from 'App/Enums/States'
import Post from 'App/Models/Post'
import PostStoreValidator from 'App/Validators/PostStoreValidator'
import Route from '@ioc:Adonis/Core/Route'
import DateService from 'App/Services/DateService'
import PostService from 'App/Services/PostService'
import TaxonomyService from 'App/Services/TaxonomyService'

export default class PostsController {

  public async index({ request, view, auth, bouncer }: HttpContextContract) {
    await bouncer.with('StudioPolicy').authorize('viewPosts')

    const page = request.input('page', 1)
    const posts = await auth.user!.related('posts').query()
      .preload('authors')
      .orderBy('publishAt', 'desc')
      .paginate(page, 20)

    posts.baseUrl(Route.makeUrl('studio.posts.index'))

    return view.render('studio/posts/index', { posts })
  }

  public async create({ view, bouncer }: HttpContextContract) {
    await bouncer.with('PostPolicy').authorize('store')

    const taxonomies = await TaxonomyService.getAllForTree()

    return view.render('studio/posts/createOrEdit', { taxonomies })
  }

  public async store ({ request, response, auth, bouncer }: HttpContextContract) {
    await bouncer.with('PostPolicy').authorize('store')

    const { publishAtDate, publishAtTime, assetIds, taxonomyIds, ...data } = await request.validate(PostStoreValidator)

    if (!data.stateId) data.stateId = State.PUBLIC

    const publishAt = DateService.getPublishAtDateTime(publishAtDate, publishAtTime)
    const post = await Post.create({ ...data, publishAt })

    await auth.user!.related('posts').attach([post.id])
    await PostService.syncAssets(post, assetIds)
    await PostService.syncTaxonomies(post, taxonomyIds)

    return response.redirect().toRoute('studio.posts.index')
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({ view, params, bouncer }: HttpContextContract) {
    const post = await Post.query()
      .where('id', params.id)
      .preload('assets', query => query.orderBy('sort_order'))
      .preload('taxonomies', q => q.select(['id']))
      .firstOrFail()

    await bouncer.with('PostPolicy').authorize('update', post)

    const taxonomies = await TaxonomyService.getAllForTree()

    return view.render('studio/posts/createOrEdit', { post, taxonomies })
  }

  public async update ({ request, response, params, bouncer }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    await bouncer.with('PostPolicy').authorize('update', post)

    let { publishAtDate, publishAtTime, assetIds, taxonomyIds, ...data } = await request.validate(PostStoreValidator)
    const publishAt = DateService.getPublishAtDateTime(publishAtDate, publishAtTime)

    post.merge({ ...data, publishAt })

    await post.save()
    await PostService.syncAssets(post, assetIds)
    await PostService.syncTaxonomies(post, taxonomyIds)

    return response.redirect().toRoute('studio.posts.index')
  }

  public async destroy ({ response, params, bouncer }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    await bouncer.with('PostPolicy').authorize('destroy', post)

    await post.related('authors').detach()

    await PostService.destroyAssets(post)

    await post.delete()

    return response.redirect().toRoute('studio.posts.index')
  }

  public async search ({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('PostPolicy').authorize('store')

    const term = request.input('term', '')
    const limit = request.input('limit', 15)
    const ignoreIds = request.input('ignore', '').split(',').filter(Boolean)

    const posts = await Post.query()
      .if(Array.isArray(ignoreIds), query => query.whereNotIn('id', ignoreIds))
      .where('title', 'ILIKE', `%${term}%`)
      .orderBy('publishAt', 'desc')
      .limit(limit)

    return response.json({ posts })
  }
}
