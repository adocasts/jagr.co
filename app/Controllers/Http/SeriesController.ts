import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import CommentService from 'App/Services/CommentService'
import Collection from 'App/Models/Collection'

export default class SeriesController {
  public async index({ view }: HttpContextContract) {
    const series = await Collection.series().wherePublic().whereNull('parentId')
    let neededPosts = 3

    for (let i = 0; i < series.length; i++) {

    }


    const series = await Collection.series()
      .wherePublic()
      .whereNull('parentId')
      .preload('posts', query => query.apply(scope => scope.forCollectionDisplay()))
      .preload('children', query => query
        .orderBy('sortOrder')
        .preload('posts', query => query.apply(scope => scope.forCollectionDisplay()))
      )

    series.map(collection => {
      const childPosts = collection.children.map(c => c.posts).flat()
      const parentPosts = collection.posts

      collection.$extras.displayPosts = [...parentPosts, ...childPosts]
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
