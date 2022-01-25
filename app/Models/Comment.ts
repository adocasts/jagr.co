import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Post from './Post'
import State from 'App/Enums/States'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId?: number

  @column()
  public postId: number

  @column()
  public replyTo?: number

  @column()
  public stateId: number

  @column()
  public name: string

  @column()
  public body: string

  @column({ serializeAs: null })
  public identity: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get isPublic() {
    return this.stateId === State.PUBLIC
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Post)
  public post: BelongsTo<typeof Post>

  @hasMany(() => Comment, { foreignKey: 'replyTo' })
  public responses: HasMany<typeof Comment>

  @belongsTo(() => Comment, { localKey: 'replyTo' })
  public parent: BelongsTo<typeof Comment>

  @computed()
  public get createdAtCalendar() {
    return this.createdAt.toRelativeCalendar();
  }
}
