import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import Route from '@ioc:Adonis/Core/Route'
import CommentService from 'App/Services/CommentService'

export default class PostsController {
  public async index ({ view, request }: HttpContextContract) {
    const { page = 1, sortBy = 'publishAt', sort = 'desc' } = request.qs()
    const items = await Post.blogs().orderBy(sortBy, sort).paginate(page, 12)

    items.baseUrl(Route.makeUrl('lessons.index'))

    return view.render('blogs/index', { items })
  }

  public async show({ view, params }: HttpContextContract) {
    const post = await Post.blogs().where({ slug: params.slug }).firstOrFail()
    const comments = await CommentService.getForPost(post)

    return view.render('lessons/show', { post, comments })
  }
}
