import {
  getClientSchemas,
} from '/@src/utils/api/clients'

import {
  formatCreateSchema,
  formatUpdateSchema,
  formatSortSchema,
  generateValidationSchema,
  getPrioritizedUpdateMethod,
} from '/@src/utils/app/shared/helpers'

function saveSchematoStorage(action: string, formSchema: string) {

	switch (action) {
		case "create":
			localStorage.setItem("createClientSchema", formSchema)
			break;
		case "update":
			localStorage.setItem("updateClientSchema", formSchema)
			break;
		case "filters":
			localStorage.setItem("filtersClientSchema", formSchema)
			break;
		case "sort":
			localStorage.setItem("sortingClientSchema", formSchema)
			break;	
	}
}

export async function useClientSchemas() {

	let createClientSchema  = undefined;
	let updateClientSchema  = undefined;
	let filtersClientSchema = undefined;
	let sortingClientSchema = undefined;
	let updateAllowedMethod;

	if (!createClientSchema || !updateClientSchema || !filtersClientSchema || !sortingClientSchema) {
		const { actions, filtering_schema, ordering_schema } = await getClientSchemas()

		createClientSchema  = formatCreateSchema(actions.POST)
		updateClientSchema  = formatUpdateSchema(getPrioritizedUpdateMethod(actions) == "put" ? actions.PUT : actions.PATCH)
		filtersClientSchema = formatCreateSchema(filtering_schema)
		sortingClientSchema = formatSortSchema(ordering_schema)
		updateAllowedMethod = getPrioritizedUpdateMethod(actions)

		saveSchematoStorage("create", JSON.stringify(createClientSchema))
		saveSchematoStorage("udpate", JSON.stringify(updateClientSchema))
		saveSchematoStorage("filters", JSON.stringify(filtersClientSchema))
		saveSchematoStorage("sort", JSON.stringify(sortingClientSchema))
	}

	return {
		createClientSchema,
		updateClientSchema,
		filtersClientSchema,
		sortingClientSchema,
		updateAllowedMethod,
	}
}