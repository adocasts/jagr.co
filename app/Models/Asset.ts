import { DateTime } from 'luxon'
import { BaseModel, column, computed, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Post from './Post'
import AssetService from 'App/Services/AssetService'

export default class Asset extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public assetTypeId: number

  @column()
  public filename: string

  @column()
  public byteSize: number | null

  @column()
  public altText: string | null

  @column()
  public credit: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get assetUrl() {
    return AssetService.getAssetUrl(this.filename)
  }

  @manyToMany(() => Post, {
    pivotTable: 'asset_posts',
    pivotColumns: ['sort_order']
  })
  public posts: ManyToMany<typeof Post>
}
