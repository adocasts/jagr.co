import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SeriesController {
  public async index({ view }: HttpContextContract) {
    return view.render('series/index')
  }

  public async show({ view }: HttpContextContract) {
    return view.render('series/show')
  }

  public async lesson({ view }: HttpContextContract) {
    return view.render('series/lesson')
  }
}
