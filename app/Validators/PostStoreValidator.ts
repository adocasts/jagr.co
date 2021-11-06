import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostType from 'App/Enums/PostType'
import State from 'App/Enums/States'

export default class PostStoreValidator {
  constructor (protected ctx: HttpContextContract) {
  }

	/*
	 * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
	 *
	 * For example:
	 * 1. The username must be of data type string. But then also, it should
	 *    not contain special characters or numbers.
	 *    ```
	 *     schema.string({}, [ rules.alpha() ])
	 *    ```
	 *
	 * 2. The email must be of data type string, formatted as a valid
	 *    email. But also, not used by any other user.
	 *    ```
	 *     schema.string({}, [
	 *       rules.email(),
	 *       rules.unique({ table: 'users', column: 'email' }),
	 *     ])
	 *    ```
	 */
  public schema = schema.create({
		title: schema.string({}, [rules.maxLength(100)]),
		slug: schema.string.optional({}, [rules.maxLength(255)]),
		pageTitle: schema.string.optional({}, [rules.maxLength(100)]),
		description: schema.string.optional({}, [rules.maxLength(255)]),
		metaDescription: schema.string.optional({}, [rules.maxLength(255)]),
		canonical: schema.string.optional({}, [rules.maxLength(255)]),
		body: schema.string.optional({}),
		videoUrl: schema.string.optional({}, [rules.maxLength(255), rules.url()]),
		timezone: schema.string.optional(),
		publishAtDate: schema.date.optional({ format: 'yyyy-MM-dd' }),
		publishAtTime: schema.date.optional({ format: 'HH:mm' }),
		postTypeId: schema.number.optional(),
		stateId: schema.number.optional()
  })

	/**
	 * Custom messages for validation failures. You can make use of dot notation `(.)`
	 * for targeting nested fields and array expressions `(*)` for targeting all
	 * children of an array. For example:
	 *
	 * {
	 *   'profile.username.required': 'Username is required',
	 *   'scores.*.number': 'Define scores as valid numbers'
	 * }
	 *
	 */
  public messages = {}
}
