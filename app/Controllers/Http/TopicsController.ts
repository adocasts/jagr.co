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

  public async show({ view, params }: HttpContextContract) {
    const topic = await Taxonomy.firstOrFail(params.slug)

    await topic.load('children', query => query.apply(scope => scope.hasContent()).orderBy('name'))
    await topic.load('posts', query => query.apply(scope => scope.forDisplay()))
    await topic.load('collections', query => query.wherePublic().orderBy('name'))

    return view.render('topics/show', { topic })
  }
}
