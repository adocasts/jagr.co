import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import AssetService from 'App/Services/AssetService'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready
    const View = this.app.container.use('Adonis/Core/View')

    View.global('appUrl', (path) => {
      return 'http://localhost:3333' + path
    })

    View.global('img', AssetService.getAssetUrl)
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
