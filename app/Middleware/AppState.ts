import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SettingsService from 'App/Services/Http/SettingsService'
import View from '@ioc:Adonis/Core/View'

export default class AppState {
  public async handle (ctx: HttpContextContract, next: () => Promise<void>) {
    const settings = (new SettingsService()).build()
    
    ctx.settings = settings

    View.global('settings', settings)

    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
