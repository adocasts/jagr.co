import HttpContext, { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HttpContextService {
  protected ctx: HttpContextContract

  constructor () {
    this.ctx = HttpContext.getOrFail()
  }

  get user() {
    return this.ctx.auth.user
  }
}