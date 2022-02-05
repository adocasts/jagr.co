import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Asset from './Asset'
import Collection from './Collection'
import Post from './Post'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import AppBaseModel from 'App/Models/AppBaseModel'

export default class Taxonomy extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public rootParentId: number | null

  @column()
  public parentId: number | null

  @column()
  public levelIndex: number

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Asset)
  public asset: BelongsTo<typeof Asset>

  @belongsTo(() => Taxonomy, {
    localKey: 'parentId'
  })
  public parent: BelongsTo<typeof Taxonomy>

  @hasMany(() => Taxonomy, {
    foreignKey: 'parentId'
  })
  public children: HasMany<typeof Taxonomy>

  @manyToMany(() => Post, {
    pivotTable: 'post_taxonomies',
    pivotColumns: ['sort_order']
  })
  public posts: ManyToMany<typeof Post>

  @manyToMany(() => Collection, {
    pivotTable: 'collection_taxonomies',
    pivotColumns: ['sort_order']
  })
  public collections: ManyToMany<typeof Collection>
}
