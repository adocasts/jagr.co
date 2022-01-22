import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema as Schema, rules } from '@ioc:Adonis/Core/Validator'
import AuthAttemptService from 'App/Services/AuthAttemptServices'

export default class AuthController {
  public async signupShow({ view }: HttpContextContract) {
    return view.render('auth/signup')
  }

  public async signup({ request, response, auth, session }: HttpContextContract) {
    const schema = Schema.create({
      username: Schema.string({ trim: true }, [rules.unique({ table: 'users', column: 'username', caseInsensitive: true })]),
      email: Schema.string({ trim: true }, [rules.unique({ table: 'users', column: 'email' })]),
      password: Schema.string({ trim: true }, [rules.minLength(8)]),
    })

    const data = await request.validate({ schema })

    const user = await User.create(data)

    await auth.login(user)

    session.flash('success', 'Welcome to Jagr!')

    return response.redirect('/')
  }

  public async signinShow({ view }: HttpContextContract) {
    return view.render('auth/signin')
  }

  public async signin({ request, response, auth, session }: HttpContextContract) {
    const schema = Schema.create({
      uid: Schema.string(),
      password: Schema.string(),
      remember_me: Schema.boolean.optional()
    })

    const { uid, password, remember_me } = await request.validate({ schema })

    const loginAttemptsRemaining = await AuthAttemptService.getRemainingAttempts(uid)
    if (loginAttemptsRemaining <= 0) {
      session.flash('error', 'Your account has been locked due to repeated bad login attempts. Please reset your password.')
      return response.redirect('/forgot-password')
    }

    try {
      await auth.attempt(uid, password, remember_me)
      await AuthAttemptService.deleteBadAttempts(uid)
    } catch (error) {
      await AuthAttemptService.recordLoginAttempt(uid)

      session.flash('errors', { form: 'The provided username/email or password is incorrect' })
      return response.redirect().back()
    }

    session.flash('success', 'Welcome back!')

    return response.redirect('/')
  }

  public async signout({ response, auth, session }: HttpContextContract) {
    await auth.logout()

    session.flash('success', 'You have been logged out')

    return response.redirect('/')
  }
}
