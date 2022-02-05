import Taxonomy from "App/Models/Taxonomy";

export default class TaxonomyService {
    public static async getAllForTree() {
      return Taxonomy.query().select(['id', 'name', 'parentId'])
    }

    public static async getFlatChildren(parentId: number, children: Taxonomy[] = []) {
      const levelChildren = await Taxonomy.query().where({ parentId })

      if (!levelChildren.length) {
        return children
      }

      children = [...children, ...levelChildren]

      levelChildren.map(async (c) => {
        children = await this.getFlatChildren(c.id, children)
      })

      return children
    }

    public static async syncPosts(taxonomy: Taxonomy, postIds: number[] = []) {
      const syncData = this.getPostSyncData(postIds)

      return taxonomy.related('posts').sync(syncData)
    }

    public static getPostSyncData(postIds: number[] = []) {
      return postIds.reduce((prev, curr, i) => ({
        ...prev,
        [curr]: {
          sort_order: i
        }
      }), {})
    }
  }
