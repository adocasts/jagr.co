import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CollectionType from 'App/Enums/CollectionType'
import State from 'App/Enums/States'
import Status from 'App/Enums/Status'
import Collection from 'App/Models/Collection'
import CollectionValidator from 'App/Validators/CollectionValidator'
import Route from '@ioc:Adonis/Core/Route'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CollectionsController {
  public async index ({ view, request, auth }: HttpContextContract) {
    const page = request.input('page', 1)
    const collections = await auth.user!.related('collections').query()
      .preload('children', query => query.withCount('posts').select('id'))
      .withCount('posts')
      .whereNull('parentId')
      .orderBy('createdAt', 'desc')
      .paginate(page, 20)

    const collectionCounts = {}
    collections.map(collection => {
      const subPosts = collection.children.reduce((count, child) => count + Number(child.$extras.posts_count), 0)
      collectionCounts[collection.id] = Number(collection.$extras.posts_count) + subPosts
    })

    collections.baseUrl(Route.makeUrl('studio.collections.index'))

    return view.render('studio/collections/index', { collections, collectionCounts })
  }

  public async create ({ view }: HttpContextContract) {
    const states = State
    const statuses = Status
    const collectionTypes = CollectionType
    return view.render('studio/collections/createOrEdit', { states, statuses, collectionTypes })
  }

  public async store ({ request, response, session, auth }: HttpContextContract) {
    const data = await request.validate(CollectionValidator)

    await Collection.create({
      ...data,
      ownerId: auth.user!.id,
    })

    session.flash('success', "Your collection has been created")

    return response.redirect().toRoute('studio.collections.index')
  }

  public async stub ({ request, response, auth }: HttpContextContract) {
    const data = await request.validate({
      schema: schema.create({
        parentId: schema.number([rules.exists({ table: 'collections', column: 'id' })])
      })
    })

    const collection = await Collection.create({
      ...data,
      name: 'Your new collection',
      ownerId: auth.user!.id
    })

    return response.json({ collection })
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({ view, params }: HttpContextContract) {
    const collection = await Collection.findOrFail(params.id)
    const states = State
    const statuses = Status
    const collectionTypes = CollectionType

    await collection.load('posts', query => query.orderBy('pivot_sort_order'))

    const children = await Collection.query()
      .where('parentId', collection.id)
      .preload('posts', query => query.orderBy('pivot_sort_order'))

    return view.render('studio/collections/createOrEdit', { collection, children, states, statuses, collectionTypes })
  }

  public async update ({ request, response, params }: HttpContextContract) {
    const {
      postIds,
      subcollectionCollectionIds = [],
      subcollectionCollectionNames = [],
      subcollectionPostIds,
      ...data
    } = await request.validate(CollectionValidator)

    const collection = await Collection.findOrFail(params.id)

    await collection.merge(data).save()

    await collection.related('posts').sync(postIds ?? [])

    if (subcollectionPostIds) {
      const promises = subcollectionCollectionIds.map((collectionId, i) => {
        return new Promise(async (resolve) => {
          const postIds = subcollectionPostIds[i] ?? []
          const collectionName = subcollectionCollectionNames[i]
          const postSyncData = postIds.reduce((prev, curr, i) => ({
            ...prev,
            [curr]: {
              sort_order: i
            }
          }), {})

          const collection = await Collection.findOrFail(collectionId)

          if (collection.name !== collectionName) {
            await collection.merge({ name: collectionName }).save()
          }

          await collection.related('posts').sync(postSyncData)

          resolve(true)
        })
      })

      await Promise.all(promises)
    }

    return response.redirect().toRoute('studio.collections.index')
  }

  public async destroy ({ response, params }: HttpContextContract) {
    const collection = await Collection.findOrFail(params.id)

    await collection.delete()

    return response.redirect().toRoute('studio.collections.index')
  }
}
