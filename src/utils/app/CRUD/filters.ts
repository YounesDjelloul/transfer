import { getFilterClientsSchema } from '/@src/utils/api/clients'
import { formatCreateSchema } from '/@src/utils/app/CRUD/helpers'

export function convertObjectToFilterString(obj: object) {

	let result: string = ''

	for (const key in obj) {
		const currentValue = obj[key]

		if (!currentValue) {
			continue
		}

		result += `${key}=${currentValue}&`
	}

	return result.slice(0, -1)
}

export async function useFilterClientsSchema() {

	const { filtering_schema } = await getFilterClientsSchema()
	return formatCreateSchema(filtering_schema)
}