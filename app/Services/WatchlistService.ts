import Watchlist from 'App/Models/Watchlist'

export default class WatchlistService {
  public static async toggle(userId: number, data: { [x: string]: any }) {
    const record = await Watchlist.query().where(data).where({ userId }).first()

    const watchlist = record
      ? await record.delete()
      : await Watchlist.create({ ...data, userId })

    return [watchlist, !!record]
  }
}
