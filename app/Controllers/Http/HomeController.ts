import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostService from 'App/Services/PostService'
import CollectionService from 'App/Services/CollectionService'
import TaxonomyService from 'App/Services/TaxonomyService'
import WatchlistService from 'App/Services/WatchlistService'

export default class HomeController {
  public async index({ view, auth }: HttpContextContract) {
    const excludeIds: number[] = []
    const featuredLesson = await PostService.getFeatureSingle()

    featuredLesson && excludeIds.push(featuredLesson.id)

    const series = await CollectionService.getLastUpdated()
    const topics = await TaxonomyService.getLastUpdated()
    const latestLessons = await PostService.getLatest(10, excludeIds)
    const collectionWatchlist = await WatchlistService.getLatestCollections(auth.user)
    const postWatchlist = await WatchlistService.getLatestPosts(auth.user)

    return view.render('index', {
      featuredLesson,
      latestLessons,
      series,
      topics,
      collectionWatchlist,
      postWatchlist
    })
  }
}
