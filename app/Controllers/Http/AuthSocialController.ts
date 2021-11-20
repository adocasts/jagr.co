import { inject } from '@adonisjs/fold';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import AuthSocialService from 'App/Services/Http/AuthSocialService';

@inject()
export default class AuthSocialController {
  constructor(public authSocialService: AuthSocialService) {}

  public async redirect ({ ally, params }: HttpContextContract) {
    await ally.use(params.provider).redirect()
  }

  public async callback ({ response, auth, params }: HttpContextContract) {
    const { isSuccess, user } = await this.authSocialService.getUser(params.provider);

    if (!isSuccess) {
      return response.redirect('/login');
    }

    await auth.use('web').login(<User>user)

    // const hasProfile = await Profile.findBy('user_id', u.id);
    // if (!hasProfile) {
    //   await Profile.create({ user_id: u.id })
    // }

    return response.redirect('/');
  }
}
