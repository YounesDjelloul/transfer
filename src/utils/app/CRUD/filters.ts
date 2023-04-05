import { getFilterClientsSchema } from '/@src/utils/api/clients'
import { formatCreateSchema } from '/@src/utils/app/CRUD/helpers'

export function convertObjectToFilterString(obj: object) {

	let result: string = ''

	for (const key in obj) {
		result += `${key}=${obj[key]}&`
	}

	return result.slice(0, -1)
}

export function convertSchemaToEmptyFilterString(filterSchema: object) {

	let result: string = ''

	for (const one of filterSchema) {
		result += `${one.id}=&`
	}

	return result.slice(0, -1)
}

export function convertFilterSchemaToObject(schema: object[]) {

	const result: object = {}

	for (const schemaField of schema) {
		result[schemaField.id] = ''
	}

	return result
}

export async function useFilterClientsSchema() {

	const { filters } = await getFilterClientsSchema()
	return formatCreateSchema(filters.filtering)
}