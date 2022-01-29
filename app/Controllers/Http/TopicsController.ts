import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TopicsController {
  public async index({ view }: HttpContextContract) {
    return view.render('topics/index')
  }
}
