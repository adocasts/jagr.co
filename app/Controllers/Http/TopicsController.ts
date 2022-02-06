import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Taxonomy from 'App/Models/Taxonomy'

export default class TopicsController {
  public async index({ view }: HttpContextContract) {
    const topics = await Taxonomy.query()
      .withCount('posts')
      .withCount('posts')
      .orderBy('name')
    return view.render('topics/index', { topics })
  }
}
