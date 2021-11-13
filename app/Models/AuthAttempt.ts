import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class AuthAttempt extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  uid: string

  @column()
  purposeId: number

  @column.dateTime()
  deletedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
