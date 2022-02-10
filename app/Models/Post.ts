import { DateTime } from 'luxon'
import {
  beforeSave,
  column,
  computed,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany, scope
} from '@ioc:Adonis/Lucid/Orm'
import Asset from './Asset'
import PostSnapshot from './PostSnapshot'
import User from './User'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import State from 'App/Enums/States'
import Taxonomy from "App/Models/Taxonomy"
import ReadService from 'App/Services/ReadService'
import BodyTypes from 'App/Enums/BodyTypes'
import EditorBlockParser from 'App/Services/EditorBlockParser'
import PostType from 'App/Enums/PostType'
import Comment from './Comment'
import AppBaseModel from 'App/Models/AppBaseModel'
import States from 'App/Enums/States'
import Collection from 'App/Models/Collection'
import CollectionTypes from 'App/Enums/CollectionTypes'
import Watchlist from 'App/Models/Watchlist'

export default class Post extends AppBaseModel {
  public serializeExtras = true

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
  public bodyBlocks: object | string | null

  @column()
  public bodyTypeId: number

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

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

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

  @manyToMany(() => Collection, {
    onQuery(query) {
      query.where('collectionTypeId', CollectionTypes.SERIES)
    },
    pivotColumns: ['sort_order', 'root_collection_id', 'root_sort_order']
  })
  public series: ManyToMany<typeof Collection>

  @manyToMany(() => Collection, {
    onQuery(query) {
      query.where('collectionTypeId', CollectionTypes.SERIES)
    },
    pivotRelatedForeignKey: 'root_collection_id',
    pivotColumns: ['sort_order', 'root_collection_id', 'root_sort_order']
  })
  public rootSeries: ManyToMany<typeof Collection>

  @manyToMany(() => Collection, {
    onQuery(query) {
      query.where('collectionTypeId', CollectionTypes.COURSE)
    },
    pivotColumns: ['sort_order', 'root_collection_id', 'root_sort_order']
  })
  public courses: ManyToMany<typeof Collection>

  @manyToMany(() => Collection, {
    onQuery(query) {
      query.where('collectionTypeId', CollectionTypes.PLAYLIST)
    },
    pivotColumns: ['sort_order', 'root_collection_id', 'root_sort_order']
  })
  public playlists: ManyToMany<typeof Collection>

  @hasMany(() => Watchlist)
  public watchlist: HasMany<typeof Watchlist>

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

  @computed()
  public get rootSortOrder() {
    if (!this.series || !this.series.length) {
      return undefined
    }

    return this.series[0].$extras.pivot_root_sort_order
  }

  @computed()
  public get videoId() {
    if (!this.videoUrl) return '';

    return this.videoUrl
      .replace('https://www.', 'https://')
      .replace('https://youtube.com/watch?v=', '')
      .replace('https://youtube.com/embed/', '')
      .replace('https://youtu.be/', '');
  }

  @computed()
  public get isInWatchlist() {
    if (!this.$extras.watchlist_count) {
      return false
    }

    return Number(this.$extras.watchlist_count) > 0
  }

  @beforeSave()
  public static async setReadTimeValues(post: Post) {
    post.bodyTypeId = post.$dirty.bodyBlocks ? BodyTypes.JSON : BodyTypes.HTML

    if (post.bodyTypeId == BodyTypes.JSON) {
      await EditorBlockParser.parse(post)
    }

    const readTime = ReadService.getReadCounts(post.body)
    post.readMinutes = readTime.minutes
    post.readTime = readTime.time
    post.wordCount = readTime.words
  }

  public get lessonIndexDisplay() {
    const series = this.series?.length && this.series[0]

    if (!series) {
      return ''
    }

    if (!series.parentId) {
      return `${series.$extras.pivot_sort_order + 1}.0`
    }

    return `${series.sortOrder + 1}.${series.$extras.pivot_sort_order}`
  }

  public static lessons() {
    return this.query().where('postTypeId', PostType.LESSON)
  }

  public static blogs() {
    return this.query().where('postTypeId', PostType.BLOG)
  }

  public static links() {
    return this.query().where('postTypeId', PostType.LINK)
  }

  public static loadForDisplay() {
    return this.query().apply(scope => scope.forDisplay())
  }

  public static published = scope<typeof Post>((query) => {
    query
      .where('stateId', States.PUBLIC)
      .where('publishAt', '<=', DateTime.now().toSQL())
  })

  public static forDisplay = scope<typeof Post>((query) => {
    query
      .apply(scope => scope.published())
      .preload('assets')
      .preload('taxonomies')
      .preload('series')
      .preload('authors', query => query.preload('profile'))
  })

  public static forCollectionDisplay = scope<typeof Post>((query, { orderBy, direction }: { orderBy: 'pivot_sort_order'|'pivot_root_sort_order', direction: 'asc'|'desc' } = { orderBy: 'pivot_sort_order', direction: 'asc' }) => {
    query
      .apply(scope => scope.forDisplay())
      .orderBy(orderBy, direction)
  })
}
