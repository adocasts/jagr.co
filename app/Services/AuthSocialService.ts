import { GoogleDriverContract, GithubDriverContract, SocialProviders } from "@ioc:Adonis/Addons/Ally";
import HttpContextService from "./HttpContextService";
// import slugify from '@sindresorhus/slugify'
import User from "App/Models/User";
import RoleEnum from 'App/Enums/Roles'

export default class AuthSocialService extends HttpContextService {
  public async getUser(socialProvider: keyof SocialProviders) {
    const social = this.ctx.ally.use(socialProvider)
    
    if (!this.checkForErrors(social)) {
      return { isSuccess: false, user: null }
    }

    const user = await this.findOrCreateUser(social, socialProvider)    

    return { isSuccess: true, user }
  }

  private checkForErrors(social: GoogleDriverContract|GithubDriverContract) {
    if (social.accessDenied()) {
      this.ctx.session.flash('error', 'Access was denied')
      return false
    }

    if (social.stateMisMatch()) {
      this.ctx.session.flash('error', 'Request expired, please try again')
      return false
    }

    if (social.hasError()) {
      this.ctx.session.flash('error', social.getError() ?? "An unexpected error ocurred")
      return false
    }

    return true
  }

  private async findOrCreateUser(social: GoogleDriverContract|GithubDriverContract, socialProvider: keyof SocialProviders) {
    const user = await social.user()
    // const username = user.name //await this.getUniqueUsername(user.name)
    const tokenKey = `${socialProvider}AccessToken`

    return User.firstOrCreate({
      email: user.email!,
    }, {
      username: user.name,
      avatarUrl: user.avatarUrl ?? undefined,
      roleId: RoleEnum.USER,
      [tokenKey]: user.token.token
    })
  }

  // private async getUniqueUsername(username: string) {
  //   username = slugify(username)
  //   const occurances = await Database.from('users').whereRaw("username RLIKE '^?(-[0-9]+)?$'", [username])
  //   username = occurances.length ? `${username}-${occurances.length}` : username
  // }
}