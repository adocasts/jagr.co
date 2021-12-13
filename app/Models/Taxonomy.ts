import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Asset from './Asset'
import Collection from './Collection'
import Post from './Post'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

export default class Taxonomy extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public parentId: number | null

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

  @belongsTo(() => Collection)
  public parent: BelongsTo<typeof Collection>

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
