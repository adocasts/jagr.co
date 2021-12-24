import Asset from "App/Models/Asset";
import Post from "App/Models/Post";
import StorageService from "./StorageService";

export default class PostService {
  public static async syncAssets(post: Post, assetIds: number[] = []) {
    const assetData = assetIds.reduce((prev, currentId, i) => ({
      ...prev,
      [currentId]: {
        sort_order: i
      }
    }), {})

    await post.related('assets').sync(assetData)
  }

  public static async destroyAssets(post: Post) {
    const assets = await post.related('assets').query().select(['id', 'filename'])
    const assetIds = assets.map(a => a.id)
    const assetFilenames = assets.map(a => a.filename)

    await post.related('assets').detach()
    await Asset.query().whereIn('id', assetIds).delete()

    StorageService.destroyAll(assetFilenames)
  }

  public static async syncTaxonomies(post: Post, taxonomyIds: number[] = []) {
    const taxonomyData = taxonomyIds.reduce((prev, currentId, i) => ({
      ...prev,
      [currentId]: {
        sort_order: i
      }
    }), {})

    await post.related('taxonomies').sync(taxonomyData)
  }
}
