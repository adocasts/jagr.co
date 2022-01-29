import Post from "App/Models/Post";
import IdentityService from "../IdentityService";
import BaseHttpService from "./BaseHttpService";
import States from 'App/Enums/States'

export default class CommentService extends BaseHttpService {
  public async getForPost(post: Post) {
    const agent = this.ctx.request.headers()['user-agent'];
    const identity = await IdentityService.create(this.ctx.request.ip(), agent);
    
    return post.related('comments')
      .query()
      .preload('user')
      .where(query => query
          .where('stateId', States.PUBLIC)
          .orWhere({ identity })
      )
      .orderBy('createdAt', 'desc')
  }
}