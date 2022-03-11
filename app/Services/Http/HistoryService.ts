import History from 'App/Models/History'
import HistoryTypes from 'App/Enums/HistoryTypes'
import HistoryValidator from 'App/Validators/HistoryValidator'
import BaseHttpService from 'App/Services/Http/BaseHttpService'
import Post from 'App/Models/Post'

export default class HistoryService extends BaseHttpService {
  public async createView(data: Partial<History>) {
    if (!this.user) return
    return History.create({
      userId: this.user!.id,
      route: this.ctx.route?.name,
      historyTypeId: HistoryTypes.VIEW,
      ...data
    })
  }

  public async recordView() {
    if (!this.user) return
    const data = await this.ctx.request.validate(HistoryValidator)
    return this.createView(data)
  }

  public async recordPostView(postId: number) {
    return this.createView({ postId })
  }

  public async recordCollectionView(collectionId: number) {
    return this.createView({ collectionId })
  }

  public async recordTaxonomyView(taxonomyId: number) {
    return this.createView({ taxonomyId })
  }

  public async getProgressionOrNew(data: Partial<History>) {
    const query: Partial<History> = {
      userId: this.user!.id,
      historyTypeId: HistoryTypes.PROGRESSION
    }

    if (data.postId)        query.postId = data.postId
    if (data.collectionId)  query.collectionId = data.collectionId
    if (data.taxonomyId)    query.taxonomyId = data.taxonomyId

    return History.firstOrNew(query, {
      userId: this.user!.id,
      route: this.ctx.route?.name,
      historyTypeId: HistoryTypes.PROGRESSION,
    })
  }

  public async createProgression(data: Partial<History>) {
    if (!this.user) return

    const progression = await this.getProgressionOrNew(data)

    if (typeof data.watchPercent === 'number' && progression.watchPercent && data.watchPercent < progression.watchPercent) {
      delete data.watchPercent
    }

    if (typeof data.readPercent === 'number' && progression.readPercent && data.readPercent < progression.readPercent) {
      delete data.readPercent
    }

    data.isCompleted = this.isPercentCompleted(data)

    await progression.merge(data).save()

    return progression
  }

  public isPercentCompleted(data: Partial<History>) {
    const threshold = 93

    if (data.isCompleted) return true

    if (typeof data.watchPercent === 'number' && data.watchPercent >= threshold) {
      return true
    }

    return typeof data.readPercent === 'number' && data.readPercent >= threshold
  }

  public async recordProgression() {
    if (!this.user) return
    const data = await this.ctx.request.validate(HistoryValidator)
    return this.createProgression(data)
  }

  public async getPostProgression(post: Post) {
    if (!this.user) return
    return post.related('progressionHistory').query().where('userId', this.user!.id).orderBy('updatedAt', 'desc').first()
  }

  public async recordPostProgression(postId: number) {
    return this.createProgression({ postId })
  }

  public async toggleCompleted() {
    if (!this.user) return

    const data = await this.ctx.request.validate(HistoryValidator)

    const progression = await this.getProgressionOrNew(data)

    await progression.merge({ isCompleted: !progression.isCompleted }).save()

    return progression
  }
}
