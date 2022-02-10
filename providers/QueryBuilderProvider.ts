import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import States from 'App/Enums/States'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class QueryBuilderProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // All bindings are ready, feel free to use them
    const { ModelQueryBuilder } = this.app.container.resolveBinding('Adonis/Lucid/Database')

    ModelQueryBuilder.macro('wherePublic', function() {
      return this.where({ stateId: States.PUBLIC })
    })

    ModelQueryBuilder.macro('whereState', function(stateId: States) {
      return this.where({ stateId })
    })

    ModelQueryBuilder.macro('withWatchlist', function(userId: number | undefined) {
      return this
        .if (userId, query => query
          .withCount('watchlist', query => query.where({ userId }))
        )
    })

    ModelQueryBuilder.macro('getCount', async function () {
      const result = await this.count('* as total')
      return BigInt(result[0].$extras.total)
    })

    // @ts-ignore
    ModelQueryBuilder.macro('selectIds', async function(idColumn: string = 'id') {
      const results = await this.select(idColumn)
      return results.map(r => r.id)
    })

    // @ts-ignore
    ModelQueryBuilder.macro('selectId', async function(idColumn: string = 'id') {
      const result = await this.select(idColumn).first()
      return result.length && result[0].id
    })

    // @ts-ignore
    ModelQueryBuilder.macro('selectIdOrFail', async function(idColumn: string = 'id') {
      const result = await this.select(idColumn).firstOrFail()
      return result.length && result[0].id
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
