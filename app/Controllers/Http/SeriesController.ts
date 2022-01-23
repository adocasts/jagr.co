import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'

export default class SeriesController {
  public async index({ view }: HttpContextContract) {
    return view.render('series/index')
  }

  public async show({ view }: HttpContextContract) {
    return view.render('series/show')
  }

  public async lesson({ view }: HttpContextContract) {
    const lesson = await Post.query().orderBy('id', 'desc').firstOrFail()
    const author = await lesson.related('authors').query().preload('profile').firstOrFail()

    return view.render('series/lesson', { lesson, author })
  }
}
