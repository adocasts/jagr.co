import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import CommentService from 'App/Services/CommentService'

export default class SeriesController {
  public async index({ view }: HttpContextContract) {
    return view.render('series/index')
  }

  public async show({ view }: HttpContextContract) {
    return view.render('series/show')
  }

  public async lesson({ view }: HttpContextContract) {
    const post = await Post.query().orderBy('id', 'desc').firstOrFail()
    const author = await post.related('authors').query().preload('profile').firstOrFail()
    const comments = await CommentService.getForPost(post)

    return view.render('series/lesson', { post, author, comments })
  }
}
