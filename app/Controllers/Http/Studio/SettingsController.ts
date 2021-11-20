import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SettingsController {
  public async index({ view }: HttpContextContract) {
    return view.render('studio/settings/index')
  }
}
