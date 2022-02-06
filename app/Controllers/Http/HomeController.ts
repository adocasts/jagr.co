import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {
  public async index({ view }: HttpContextContract) {
    const topics = []
    return view.render('index', { topics })
  }
}
