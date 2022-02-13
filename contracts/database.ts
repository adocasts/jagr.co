declare module '@ioc:Adonis/Lucid/Orm' {
  import States from 'App/Enums/States'

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
    highlight(columnName?: string, targetColumnName?: string): this
    highlightOrFail(columnName?: string, targetColumnName?: string): this
    highlightAll(columnName?: string, targetColumnName?: string): this
  }
}
