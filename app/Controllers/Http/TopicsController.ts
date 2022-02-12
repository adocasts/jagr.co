import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Taxonomy from 'App/Models/Taxonomy'
import CollectionTypes from 'App/Enums/CollectionTypes'

export default class TopicsController {
  public async index({ view }: HttpContextContract) {
    const topics = await Taxonomy.query()
      .apply(scope => scope.hasContent())
      .preload('parent')
      .withCount('posts')
      .withCount('collections')
      .orderBy('name')
    return view.render('topics/index', { topics })
  }

  public async show({ view, params }: HttpContextContract) {
    const topic = await Taxonomy.firstOrFail(params.slug)
    const children = await topic.related('children').query()
      .apply(scope => scope.hasContent())
      .withCount('posts')
      .withCount('collections')
      .orderBy('name')

    const posts = await topic.related('posts').query().apply(scope => scope.forDisplay())

    const series = await topic.related('collections').query()
      .wherePublic()
      .where('collectionTypeId', CollectionTypes.SERIES)
      .orderBy('name')

    return view.render('topics/show', { topic, children, posts, series })
  }
}
