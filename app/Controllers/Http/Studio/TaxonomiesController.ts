import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Taxonomy from "App/Models/Taxonomy";
import TaxonomyValidator from "App/Validators/TaxonomyValidator";

export default class TaxonomiesController {
  public async index({ view }: HttpContextContract) {
    const taxonomies = await Taxonomy.all()

    return view.render('studio/taxonomies/index', { taxonomies })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('studio/taxonomies/createOrEdit')
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(TaxonomyValidator)

    await Taxonomy.create(data)

    return response.redirect().toRoute('studio.taxonomies.index')
  }

  public async show({}: HttpContextContract) {}

  public async edit({ view, params }: HttpContextContract) {
    const taxonomy = await Taxonomy.findOrFail(params.id)

    return view.render('studio/taxonomies/createOrEdit', { taxonomy })
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
