import {
  formatCreateSchema,
  formatUpdateSchema,
  formatSortSchema,
  generateValidationSchema,
  getPrioritizedUpdateMethod,
  saveSchematoStorage,
  formatColumnListingSchema,
} from '/@src/utils/app/shared/helpers'

export async function useModelSchemas(SchemasRequestFunction, modelName) {

	let result = {
		createSchema: undefined,
		updateSchema: undefined,
		filtersSchema: undefined,
		sortingSchema: undefined,
		updateAllowedMethod: undefined,
		lookupField: undefined,
		listingColumns: undefined,
	}

	if (!result.createSchema || !result.updateSchema || !result.filtersSchema || !result.sortingSchema || !result.updateAllowedMethod || result.lookupField || result.listingColumns) {
		const { actions, filtering_schema, ordering_schema, lookup_field, listing_columns } = await SchemasRequestFunction()

		result.createSchema        = formatCreateSchema(actions.POST)
		result.updateSchema        = formatUpdateSchema(getPrioritizedUpdateMethod(actions) == "put" ? actions.PUT : actions.PATCH)
		result.filtersSchema       = formatCreateSchema(filtering_schema)
		result.sortingSchema       = formatSortSchema(ordering_schema)
		result.updateAllowedMethod = getPrioritizedUpdateMethod(actions)
		result.lookupField         = lookup_field
		result.listingColumns      = formatColumnListingSchema(listing_columns)

		saveSchematoStorage(`create${modelName}Schema`, JSON.stringify(result.createSchema))
		saveSchematoStorage(`update${modelName}Schema`, JSON.stringify(result.updateSchema))
		saveSchematoStorage(`filters${modelName}Schema`, JSON.stringify(result.filtersSchema))
		saveSchematoStorage(`sorting${modelName}Schema`, JSON.stringify(result.sortingSchema))
	}

	return result
}