import Post from "App/Models/Post";
import States from 'App/Enums/States'
import HttpIdentityService from "./Http/HttpIdentityService";

export default class CommentService {
  public static async getForPost(post: Post) {
    const httpIdentityService = new HttpIdentityService()
    const identity = await httpIdentityService.getRequestIdentity()

    return post.related('comments')
      .query()
      .preload('user')
      .where(query => query
          .where('stateId', States.PUBLIC)
          .orWhere({ identity })
      )
      .orderBy('createdAt', 'desc')
      .highlightAll()
  }
}
