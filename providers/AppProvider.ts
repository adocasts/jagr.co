import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import AssetService from 'App/Services/AssetService'
import { DateTime } from 'luxon'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready
    const View = this.app.container.use('Adonis/Core/View')
    const { string: stringHelpers } = this.app.container.use('Adonis/Core/Helpers')

    View.global('appUrl', (path) => {
      return 'http://localhost:3333' + path
    })

    View.global('img', AssetService.getAssetUrl)

    View.global('getSingularOrPlural', (string: string, array: any[] ) => {
      return array.length > 1 ? stringHelpers.pluralize(string) : string
    })

    View.global('DateTime', DateTime)
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
