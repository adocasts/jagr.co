import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, belongsTo, BelongsTo, hasMany, HasMany, hasOne, HasOne, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import Topic from './Topic'
import Profile from './Profile'
import Post from './Post'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public roleId: number

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @hasMany(() => Topic)
  public topics: HasMany<typeof Topic>

  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>

  @manyToMany(() => Post)
  public posts: ManyToMany<typeof Post>
}
