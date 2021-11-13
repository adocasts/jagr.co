import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import State, { StateDesc } from 'App/Enums/States'
import Post from 'App/Models/Post'
import PostStoreValidator from 'App/Validators/PostStoreValidator'
import Route from '@ioc:Adonis/Core/Route'
import { DateTime } from 'luxon'
import PostType, { PostTypeDesc } from 'App/Enums/PostType'

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
    const { publishAtDate, publishAtTime, ...data } = await request.validate(PostStoreValidator)

    if (!data.stateId) data.stateId = State.PUBLIC

    let publishAt = DateTime.now()

    if (publishAtDate) {
      publishAt = publishAt.set({ year: publishAtDate.year, month: publishAtDate.month, day: publishAtDate.day })
    }

    if (publishAtTime) {
      publishAt = publishAt.set({ hour: publishAtTime.hour, minute: publishAtTime.minute })
    }

    const post = await Post.create({ ...data, publishAt })

    await auth.user!.related('posts').attach([post.id])

    return response.redirect().toRoute('studio.posts.index')
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({ view, params }: HttpContextContract) {
    const states = State
    const post = await Post.findOrFail(params.id)

    return view.render('studio/posts/createOrEdit', { states, post })
  }

  public async update ({ request, response, params }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    const { publishAtDate, publishAtTime, ...data } = await request.validate(PostStoreValidator)

    let publishAt = DateTime.now()

    if (publishAtDate) {
      publishAt = publishAt.set({ year: publishAtDate.year, month: publishAtDate.month, day: publishAtDate.day })
    }

    if (publishAtTime) {
      publishAt = publishAt.set({ hour: publishAtTime.hour, minute: publishAtTime.minute })
    }

    post.merge({ ...data, publishAt })

    await post.save()

    return response.redirect().toRoute('studio.posts.index')
  }

  public async destroy ({ response, params }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    await post.related('authors').detach()

    await post.delete()

    return response.redirect().toRoute('studio.posts.index')
  }
}
