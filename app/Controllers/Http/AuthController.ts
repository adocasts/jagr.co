import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema as Schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async signupShow({ view }: HttpContextContract) {
    return view.render('auth/signup')
  }

  public async signup({ request, response, auth, session }: HttpContextContract) {
    const schema = await Schema.create({
      username: Schema.string({ trim: true }, [rules.unique({ table: 'users', column: 'username' })]),
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
    const { email, password } = request.only(['email', 'password'])

    try {
      await auth.attempt(email, password)
    } catch (error) {
      session.flash('errors', { form: 'The provided email or password is incorrect' })
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
