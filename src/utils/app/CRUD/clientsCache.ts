import {
  getClientSchemas,
} from '/@src/utils/api/clients'

import {
  formatCreateSchema,
  formatUpdateSchema,
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
	}
}

export async function useClientSchemas() {

	let createClientSchema  = undefined;
	let updateClientSchema  = undefined;
	let filtersClientSchema = undefined;
	let updateAllowedMethod;

	if (!createClientSchema || !updateClientSchema || !filtersClientSchema) {
		const { actions, filtering_schema } = await getClientSchemas()

		createClientSchema  = formatCreateSchema(actions.POST)
		updateClientSchema  = formatUpdateSchema(getPrioritizedUpdateMethod(actions) == "put" ? actions.PUT : actions.PATCH)
		filtersClientSchema = formatCreateSchema(filtering_schema)
		updateAllowedMethod = getPrioritizedUpdateMethod(actions)

		saveSchematoStorage("create", JSON.stringify(createClientSchema))
		saveSchematoStorage("udpate", JSON.stringify(updateClientSchema))
		saveSchematoStorage("filters", JSON.stringify(filtersClientSchema))
	}

	return {
		createClientSchema,
		updateClientSchema,
		filtersClientSchema,
		updateAllowedMethod,
	}
}