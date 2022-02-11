import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CommentService from 'App/Services/CommentService'
import Collection from 'App/Models/Collection'

export default class SeriesController {
  public async index({ view }: HttpContextContract) {
    const series = await Collection.series()
      .wherePublic()
      .whereNull('parentId')
      .preload('asset')
      .preload('postsFlattened', query => query
        .apply(scope => scope.forCollectionDisplay({ orderBy: 'pivot_root_sort_order', direction: 'desc' }))
        .groupLimit(3)
      )

    return view.render('series/index', { series })
  }

  public async show({ view, params, auth }: HttpContextContract) {
    const series = await Collection.series()
      .apply(scope => scope.withPublishedPostCount())
      .wherePublic()
      .where({ slug: params.slug })
      .withWatchlist(auth.user?.id)
      .preload('asset')
      .preload('postsFlattened', query => query.apply(scope => scope.forCollectionDisplay({ orderBy: 'pivot_root_sort_order' })))
      .firstOrFail()

    return view.render('series/show', { series })
  }

  public async lesson({ view, params, auth }: HttpContextContract) {
    const series = await Collection.series()
      .where({ slug: params.slug })
      .wherePublic()
      .preload('posts', query => query.apply(scope => scope.forCollectionDisplay()))
      .preload('children', query => query
        .wherePublic()
        .preload('posts', query => query.apply(scope => scope.forCollectionDisplay()))
      )
      .firstOrFail()

    const post = await series.related('postsFlattened').query()
      .where("root_sort_order", params.index - 1)
      .withWatchlist(auth.user!.id)
      .apply(scope => scope.forDisplay())
      .firstOrFail()

    const comments = await CommentService.getForPost(post)

    return view.render('series/lesson', { post, series, comments })
  }
}
