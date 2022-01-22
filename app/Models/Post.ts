import { DateTime } from 'luxon'
import {
  BaseModel,
  beforeSave,
  column,
  computed,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany
} from '@ioc:Adonis/Lucid/Orm'
import Asset from './Asset'
import PostSnapshot from './PostSnapshot'
import User from './User'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import State from 'App/Enums/States'
import Taxonomy from "App/Models/Taxonomy";
import ReadService from 'App/Services/ReadService'

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
  public readMinutes: number

  @column()
  public readTime: number

  @column()
  public wordCount: number

  @column()
  public videoSeconds: number

  @column()
  public postTypeId: number

  @column()
  public redirectUrl: string

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

  @manyToMany(() => Taxonomy, {
    pivotTable: 'post_taxonomies',
    pivotColumns: ['sort_order']
  })
  public taxonomies: ManyToMany<typeof Taxonomy>

  @computed()
  public get publishAtDateString() {
    return this.publishAt?.toFormat('yyyy-MM-dd')
  }

  @computed()
  public get publishAtTimeString() {
    return this.publishAt?.toFormat('HH:mm')
  }

  @computed()
  public get isPublished(): boolean {
    const isPublic = this.stateId === State.PUBLIC

    if (!this.publishAt) {
      return isPublic
    }

    const isPastPublishAt = this.publishAt.diffNow().as('seconds')

    return isPublic && isPastPublishAt < 0
  }

  @computed()
  public get isViewable(): boolean {
    const isPublicOrUnlisted = this.stateId === State.PUBLIC || this.stateId === State.UNLISTED;

    if (!this.publishAt) {
      return isPublicOrUnlisted
    }

    const isPastPublishAt = this.publishAt.diffNow().as('seconds')

    return isPublicOrUnlisted && isPastPublishAt < 0
  }

  @beforeSave()
  public static async setReadTimeValues(post: Post) {
    const readTime = ReadService.getReadCounts(post.body);
    post.readMinutes = readTime.minutes;
    post.readTime = readTime.time;
    post.wordCount = readTime.words;
  }
}
