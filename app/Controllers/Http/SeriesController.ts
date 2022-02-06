import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import CommentService from 'App/Services/CommentService'
import Collection from 'App/Models/Collection'

export default class SeriesController {
  public async index({ view }: HttpContextContract) {
    const postsToTake = 3
    const series = await Collection.series()
      .wherePublic()
      .whereNull('parentId')
      .preload('posts', query => query.apply(scope => scope.forCollectionDisplay({ orderBy: 'pivot_root_sort_order', direction: 'desc' })).limit(postsToTake))
      .preload('children', query => query
        .orderBy('sortOrder')
        .preload('posts', query => query.apply(scope => scope.forCollectionDisplay({ orderBy: 'pivot_root_sort_order', direction: 'desc' })).limit(postsToTake))
      )

    series.map(collection => {
      const childPosts = collection.children.map(c => c.posts).flat()
      const parentPosts = collection.posts

      collection.$extras.displayPosts = [...parentPosts, ...childPosts].slice(0, postsToTake)
    })

    return view.render('series/index', { series })
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
