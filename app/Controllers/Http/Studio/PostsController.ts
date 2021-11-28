import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import State, { StateDesc } from 'App/Enums/States'
import Post from 'App/Models/Post'
import PostStoreValidator from 'App/Validators/PostStoreValidator'
import Route from '@ioc:Adonis/Core/Route'
import PostType, { PostTypeDesc } from 'App/Enums/PostType'
import DateService from 'App/Services/DateService'
import PostService from 'App/Services/PostService'

export default class PostsController {

  public async index({ request, view, auth }: HttpContextContract) {
    const page = request.input('page', 1)
    const posts = await auth.user!.related('posts').query()
      .preload('authors')
      .paginate(page, 20)

    posts.baseUrl(Route.makeUrl('studio.posts.index'))

    const states = State;
    const stateDescriptions = StateDesc;

    const postTypes = PostType;
    const postTypeDescriptions = PostTypeDesc;

    return view.render('studio/posts/index', { posts, states, stateDescriptions, postTypes, postTypeDescriptions })
  }

  public async create({ view }: HttpContextContract) {
    const states = State
    return view.render('studio/posts/createOrEdit', { states })
  }

  public async store ({ request, response, auth }: HttpContextContract) {
    const { publishAtDate, publishAtTime, assetIds, ...data } = await request.validate(PostStoreValidator)

    if (!data.stateId) data.stateId = State.PUBLIC

    const publishAt = DateService.getPublishAtDateTime(publishAtDate, publishAtTime)

    const post = await Post.create({ ...data, publishAt })

    await auth.user!.related('posts').attach([post.id])
    
    await PostService.syncAssets(post, assetIds)

    return response.redirect().toRoute('studio.posts.index')
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({ view, params }: HttpContextContract) {
    const states = State
    const post = await Post.query()
      .where('id', params.id)
      .preload('assets', query => query.orderBy('sort_order'))
      .firstOrFail()

    return view.render('studio/posts/createOrEdit', { states, post })
  }

  public async update ({ request, response, params }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    const { publishAtDate, publishAtTime, assetIds, ...data } = await request.validate(PostStoreValidator)

    const publishAt = DateService.getPublishAtDateTime(publishAtDate, publishAtTime)

    post.merge({ ...data, publishAt })

    await post.save()

    await PostService.syncAssets(post, assetIds)

    return response.redirect().toRoute('studio.posts.index')
  }

  public async destroy ({ response, params }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    await post.related('authors').detach()

    await PostService.destroyAssets(post)

    await post.delete()

    return response.redirect().toRoute('studio.posts.index')
  }

  public async search ({ request, response }: HttpContextContract) {
    const term = request.input('term', '')
    const ignoreIds = request.input('ignore', '').split(',').filter(Boolean)

    const posts = await Post.query()
      .if(Array.isArray(ignoreIds), query => query.whereNotIn('id', ignoreIds))
      .where('title', 'LIKE', `%${term}%`)
      .orderBy('publishAt', 'desc')

    return response.json({ posts })
  } 
}
