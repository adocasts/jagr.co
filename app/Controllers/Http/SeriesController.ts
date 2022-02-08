import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import CommentService from 'App/Services/CommentService'
import Collection from 'App/Models/Collection'

export default class SeriesController {
  public async index({ view }: HttpContextContract) {
    const series = await Collection.series()
      .wherePublic()
      .whereNull('parentId')
      .preload('postsFlattened', query => query
        .apply(scope => scope.forCollectionDisplay({ orderBy: 'pivot_root_sort_order', direction: 'desc' }))
        .groupLimit(3)
      )

    return view.render('series/index', { series })
  }

  public async show({ view, params }: HttpContextContract) {
    const series = await Collection.series()
      .apply(scope => scope.withPublishedPostCount())
      .wherePublic()
      .where({ slug: params.slug })
      .preload('postsFlattened', query => query.apply(scope => scope.forCollectionDisplay({ orderBy: 'pivot_root_sort_order' })))
      .firstOrFail()

    return view.render('series/show', { series })
  }

  public async lesson({ view }: HttpContextContract) {
    const post = await Post.query().orderBy('id', 'desc').firstOrFail()
    const author = await post.related('authors').query().preload('profile').firstOrFail()
    const comments = await CommentService.getForPost(post)

    return view.render('series/lesson', { post, author, comments })
  }
}
