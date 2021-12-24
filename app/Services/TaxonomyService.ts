import Taxonomy from "App/Models/Taxonomy";

export default class TaxonomyService {
    public static async getAllForTree() {
      return Taxonomy.query().select(['id', 'name', 'parentId'])
    }
  }
