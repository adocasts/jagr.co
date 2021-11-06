import { DateTime } from 'luxon'
import { BaseModel, column, computed, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Topic from './Topic'
import Asset from './Asset'
import PostSnapshot from './PostSnapshot'
import User from './User'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import State from 'App/Enums/States'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['title']
  })
  public slug: string

  @column()
  public pageTitle: string | null

  @column()
  public description: string | null

  @column()
  public metaDescription: string | null

  @column()
  public canonical: string | null

  @column()
  public body: string | null

  @column()
  public videoUrl: string | null

  @column()
  public isFeatured: boolean | null

  @column()
  public isPersonal: boolean | null

  @column()
  public viewCount: number | null

  @column()
  public viewCountUnique: number | null

  @column()
  public stateId: State

  @column()
  public timezone: string | null

  @column()
  public publishAtUser: string | null

  @column.dateTime()
  public publishAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Topic, {
    pivotTable: 'post_topics',
    pivotColumns: ['sort_order']
  })
  public topics: ManyToMany<typeof Topic>

  @manyToMany(() => Asset, {
    pivotTable: 'asset_posts',
    pivotColumns: ['sort_order']
  })
  public assets: ManyToMany<typeof Asset>

  @hasMany(() => PostSnapshot)
  public snapshots: HasMany<typeof PostSnapshot>

  @manyToMany(() => User, {
    pivotTable: 'author_posts',
    pivotColumns: ['author_type_id']
  })
  public authors: ManyToMany<typeof User>

  @computed()
  public get publishAtDateString() {
    return this.publishAt?.toFormat('yyyy-MM-dd')
  }

  @computed()
  public get publishAtTimeString() {
    return this.publishAt?.toFormat('HH:mm')
  }
}
