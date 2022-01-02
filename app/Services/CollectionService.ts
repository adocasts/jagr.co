import Collection from 'App/Models/Collection'

export default class CollectionService {
  // TODO: finish
  public static async getPostCounts(collections: Collection[]) {
    const ids = collections.map(c => c.id)
    const subCollections = await Collection.query()
      .whereIn('parentId', ids)
      .orWhereIn('id', ids)
      .withCount('posts')
      .select('id')

    return subCollections
  }

  // TODO: finish
  public static async getPostCount(collection: Collection) {
    const subCollections = await Collection.query()
      .where('parentId', collection.id)
      .withCount('posts')
      .select('id')

    return subCollections
  }
}
