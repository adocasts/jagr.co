import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import State from 'App/Enums/States'
import Post from 'App/Models/Post'
import PostStoreValidator from 'App/Validators/PostStoreValidator'
import { DateTime } from 'luxon'

export default class PostsController {
  public async index({ view, auth, params }: HttpContextContract) {
    const page = params.page ?? 1
    const posts = await auth.user!.related('posts').query().paginate(page, 20)

    return view.render('studio/posts/index', { posts })
  }

  public async create({ view }: HttpContextContract) {
    const states = State
    return view.render('studio/posts/createOrEdit', { states })
  }

  public async store ({ request, response, auth }: HttpContextContract) {
    const data = await request.validate(PostStoreValidator)

    if (!data.stateId) data.stateId = State.PUBLIC

    const post = await Post.create(data)

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
