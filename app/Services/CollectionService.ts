import Collection from 'App/Models/Collection'

export default class CollectionService {
  public static async getPostCounts(collections: Collection[]) {
    const ids = collections.map(c => c.id)
    const subCollections = await Collection.query()
      .whereIn('parentId', ids)
      .orWhereIn('id', ids)
      .withCount('posts')
      .select('id')


  }

  public static async getPostCount(collection: Collection) {
    const subCollections = await Collection.query()
      .where('parentId', collectionId)
      .withCount('posts')
      .select('id')

    const
  }
}
