import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import AssetService from 'App/Services/AssetService'
import State, { StateDesc } from 'App/Enums/States'
import Status, { StatusDesc } from 'App/Enums/Status'
import CollectionType, { CollectionTypeDesc } from "App/Enums/CollectionTypes"
import { DateTime } from 'luxon'
import PostType, {PostTypeDesc} from "App/Enums/PostType";
import Roles from 'App/Enums/Roles'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {}

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready
    const View = this.app.container.use('Adonis/Core/View')
    const Database = this.app.container.use('Adonis/Lucid/Database')
    const { string: stringHelpers } = this.app.container.use('Adonis/Core/Helpers')

    View.global('appUrl', (path) => {
      return 'http://localhost:3333' + path
    })

    View.global('img', AssetService.getAssetUrl)

    View.global('getSingularOrPlural', (string: string, array: any[] ) => {
      return array.length > 1 ? stringHelpers.pluralize(string) : string
    })

    View.global('Db', (table: string) => {
      return Database.from(table)
    })

    View.global('DateTime', DateTime)
    View.global('StateEnum', State)
    View.global('StateEnumDesc', StateDesc)
    View.global('StatusEnum', Status)
    View.global('StatusEnumDesc', StatusDesc)
    View.global('CollectionTypeEnum', CollectionType)
    View.global('CollectionTypeEnumDesc', CollectionTypeDesc)
    View.global('PostTypeEnum', PostType)
    View.global('PostTypeEnumDesc', PostTypeDesc)
    View.global('Roles', Roles)
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
