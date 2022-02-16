declare module '@ioc:Adonis/Lucid/Orm' {
  import States from 'App/Enums/States'
  import Post from 'App/Models/Post'

  interface ModelQueryBuilderContract<
    Model extends LucidModel,
    Result = InstanceType<Model>
    > {
    wherePublic(): this
    whereState(stateId: States): this
    withWatchlist(userId: number | undefined): this
    getCount(): Promise<BigInt>
    selectIds(idColumn?: string): number
    selectId(idColumn?: string): number
    selectIdOrFail(idColumn?: string): number
    highlight(columnName?: string, targetColumnName?: string): Post
    highlightOrFail(columnName?: string, targetColumnName?: string): Post
    highlightAll(columnName?: string, targetColumnName?: string): Post[]
  }
}
