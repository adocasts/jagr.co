import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import Route from '@ioc:Adonis/Core/Route'

export default class LessonsController {
  public async index({ view, request }: HttpContextContract) {
    const { page = 1, sortBy = 'publishAt', sort = 'desc' } = request.qs()
    const items = await Post.lessons().orderBy(sortBy, sort).paginate(page, 12)

    items.baseUrl(Route.makeUrl('lessons.index'))

    return view.render('lessons/index', { items })
  }
}
