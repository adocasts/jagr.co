import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column, HasMany, hasMany,
  ManyToMany,
  manyToMany
} from '@ioc:Adonis/Lucid/Orm'
import CollectionType from 'App/Enums/Collectiontype'
import Status from 'App/Enums/Status'
import User from './User'
import Post from './Post'
import Taxonomy from './Taxonomy'
import Asset from './Asset'
import State from 'App/Enums/States'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

export default class Collection extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public ownerId: number

  @column()
  public parentId: number | null

  @column()
  public collectionTypeId: CollectionType

  @column()
  public statusId: Status

  @column()
  public stateId: State

  @column()
  public assetId: number | null

  @column()
  public name: string

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['name']
  })
  public slug: string

  @column()
  public description: string

  @column()
  public pageTitle: string

  @column()
  public metaDescription: string

  @column()
  public sortOrder: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public owner: BelongsTo<typeof User>

  @belongsTo(() => Asset)
  public asset: BelongsTo<typeof Asset>

  @belongsTo(() => Collection)
  public parent: BelongsTo<typeof Collection>

  @manyToMany(() => Post, {
    pivotTable: 'collection_posts',
    pivotColumns: ['sort_order']
  })
  public posts: ManyToMany<typeof Post>

  @manyToMany(() => Taxonomy, {
    pivotTable: 'collection_taxonomies',
    pivotColumns: ['sort_order']
  })
  public taxonomies: ManyToMany<typeof Taxonomy>

  @hasMany(() => Collection, {
    foreignKey: 'parentId'
  })
  public children: HasMany<typeof Collection>
}
