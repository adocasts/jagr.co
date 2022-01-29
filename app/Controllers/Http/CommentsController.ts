import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import States from 'App/Enums/States'
import IdentityService from 'App/Services/IdentityService'

// TODO: Authorization
export default class CommentsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const data = request.only(['postId', 'body', 'rootParentId', 'replyTo', 'levelIndex'])
    const userId = auth.user?.id
    const ip = request.ip()
    const agent = request.headers()['user-agent']
    const identity = await IdentityService.create(ip, agent)

    // TODO: validate

    await Comment.create({ 
      ...data, 
      identity,
      name: userId ? undefined : await IdentityService.getByIdentity(Comment.table, identity),
      userId: auth.user?.id,
      stateId: auth.user?.id ? States.PUBLIC : States.IN_REVIEW,
    })

    return response.redirect().back()
  }

  public async update({ request, response, auth, params }: HttpContextContract) {
    const data = request.only(['body'])
    const comment = await auth.user!.related('comments').query().where('id', params.id).firstOrFail()

    await comment.merge(data).save()

    return response.redirect().back()
  }

  public async destroy({ response, params }: HttpContextContract) {
    const id = params.id
    const comment = await Comment.findOrFail(id)
    const parent = await comment.related('parent').query().first()
    const [children] = await comment.related('responses').query().whereNot('stateId', States.ARCHIVED).count('id')

    if (Number(children.$extras.count)) {
      comment.merge({ 
        body: '[deleted]',
        stateId: States.ARCHIVED
      })

      await comment.save()
    } else {
      await comment.delete()
    }

    if (parent?.stateId === States.ARCHIVED) {
      const [siblings] = await parent.related('responses').query().count('id')

      if (!Number(siblings.$extras.count)) {
        await parent.delete()
      }
    }

    return response.redirect().back()
  }
}
