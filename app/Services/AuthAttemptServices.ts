import AuthAttemptPurpose from "App/Enums/AuthAttemptPurpose"
import AuthAttempt from "App/Models/AuthAttempt"
import { DateTime } from "luxon"

export default class AuthAttemptService {
  public static allowedAttempts: number = 3

  public static async getAttempts(uid: string): Promise<number> {
    const attempts = (await AuthAttempt.query()
      .where('uid', uid)
      .whereNull('deletedAt')
      .count('id')
      .firstOrFail()).$extras.count

    return attempts
  }

  public static async getRemainingAttempts(uid: string): Promise<number> {
    const attempts = await this.getAttempts(uid)
    return this.allowedAttempts - attempts
  }

  public static async deleteBadAttempts(uid: string): Promise<void> {
    await AuthAttempt.query()
      .where('uid', uid)
      .whereNull('deletedAt')
      .update({ deletedAt: DateTime.now().toSQL() })
  }

  public static async recordLoginAttempt(uid: string): Promise<void> {
    await AuthAttempt.create({
      uid,
      purposeId: AuthAttemptPurpose.LOGIN
    })
  }

  public static async recordChangeEmailAttempt(email: string): Promise<void> {
    await AuthAttempt.create({
      uid: email,
      purposeId: AuthAttemptPurpose.CHANGE_EMAIL
    })
  }
}