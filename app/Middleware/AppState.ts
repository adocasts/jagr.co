import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SettingsService from 'App/Services/Http/SettingsService'
import View from '@ioc:Adonis/Core/View'
import HttpIdentityService from 'App/Services/Http/HttpIdentityService'

export default class AppState {
  public async handle (ctx: HttpContextContract, next: () => Promise<void>) {
    const settings = (new SettingsService()).build()
    const httpIdentityService = new HttpIdentityService()
    
    ctx.settings = settings

    View.global('settings', settings)
    View.global('identity', await httpIdentityService.getRequestIdentity())

    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
