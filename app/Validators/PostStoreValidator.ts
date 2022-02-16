import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostStoreValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  get slugUniqueConstraint() {
  	return !this.ctx.params.id ? {} : {
			whereNot: { id: this.ctx.params.id }
		}
  }

  public schema = schema.create({
		title: schema.string({ trim: true }, [rules.maxLength(100)]),
		slug: schema.string.optional({ trim: true }, [rules.maxLength(255), rules.unique({
			table: 'posts',
			column: 'slug',
			...this.slugUniqueConstraint
		})]),
		pageTitle: schema.string.optional({ trim: true }, [rules.maxLength(100)]),
		description: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
		metaDescription: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
		canonical: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
		body: schema.string.optional({}),
		bodyBlocks: schema.string.optional(),
    repositoryUrl: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
    isFeatured: schema.boolean.optional(),
		videoUrl: schema.string.optional({ trim: true }, [rules.maxLength(255), rules.url()]),
    videoSeconds: schema.number.optional(),
		timezone: schema.string.optional({ trim: true }),
		publishAtDate: schema.date.optional({ format: 'yyyy-MM-dd' }),
		publishAtTime: schema.date.optional({ format: 'HH:mm' }),
		postTypeId: schema.number.optional(),
		stateId: schema.number.optional(),
		assetIds: schema.array.optional().members(schema.number([rules.exists({ table: 'assets', column: 'id' })])),
    taxonomyIds: schema.array.optional().members(schema.number([rules.exists({ table: 'taxonomies', column: 'id' })]))
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
