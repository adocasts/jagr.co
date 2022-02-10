import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Taxonomy from 'App/Models/Taxonomy'
import Collection from 'App/Models/Collection'
import Post from 'App/Models/Post'
import States from 'App/Enums/States'

export default class HomeController {
  public async index({ view }: HttpContextContract) {
    const excludeIds: number[] = []

    const featuredLesson = await Post.lessons()
      .apply(scope => scope.forDisplay())
      .apply(scope => scope.published())
      .whereHas('assets', query => query)
      .orderBy('publishAt', 'desc')
      .first()

    featuredLesson && excludeIds.push(featuredLesson.id)

    const series = await Collection.series()
      .apply(scope => scope.withPostLatestPublished())
      .preload('asset')
      .wherePublic()
      .whereNull('parentId')
      .orderBy('latest_publish_at', 'desc')
      .select(['collections.*', Collection.postCountSubQuery])

    const topics = await Taxonomy.query()
      .apply(scope => scope.withPostLatestPublished())
      .withCount('posts', query => query.apply(scope => scope.published()))
      .withCount('collections', query => query.where('stateId', States.PUBLIC))
      .orderBy('latest_publish_at', 'desc')
      .select('taxonomies.*')

    const latestLessons = await Post.lessons()
      .apply(scope => scope.forDisplay())
      .apply(scope => scope.published())
      .orderBy('publishAt', 'desc')
      .whereNotIn('id', excludeIds)
      .limit(10)

    return view.render('index', {
      featuredLesson,
      latestLessons,
      series,
      topics
    })
  }
}
