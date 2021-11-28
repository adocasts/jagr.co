import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CollectionType from 'App/Enums/Collectiontype'
import Status from 'App/Enums/Status'

export default class CollectionValidator {
  constructor (protected ctx: HttpContextContract) {
  }

	get slugUniqueConstraint() {
  	return !this.ctx.params.id ? {} : {
			whereNot: { id: this.ctx.params.id }
		}
  }

  public schema = schema.create({
		name: schema.string({ trim: true }, [rules.maxLength(100)]),
		slug: schema.string.optional({}, [rules.maxLength(150), rules.unique({ 
			table: 'posts', 
			column: 'slug', 
			...this.slugUniqueConstraint
		})]),
		collectionTypeId: schema.number(),
		statusId: schema.number(),
		stateId: schema.number(),
		assetId: schema.number.optional([rules.exists({ table: 'assets', column: 'id' })]),
		pageTitle: schema.string.optional({ trim: true }, [rules.maxLength(100)]),
		description: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
		metaDescription: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
		postIds: schema.array.optional().members(schema.number([rules.exists({ table: 'posts', column: 'id' })])),
		subcollectionCollectionIds: schema.array.optional().members(
			schema.number([rules.exists({ table: 'collections', column: 'id' })])
		),
		subcollectionPostIds: schema.array.optional().members(
			schema.array.optional().members(
				schema.number([rules.exists({ table: 'posts', column: 'id' })])
			)
		)
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
