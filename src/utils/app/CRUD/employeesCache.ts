import {
  getEmployeeSchemas,
} from '/@src/utils/api/employees'

import {
  formatCreateSchema,
  formatUpdateSchema,
  generateValidationSchema,
} from '/@src/utils/app/shared/helpers'

function saveSchematoStorage(action: string, formSchema: string) {

	switch (action) {
		case "create":
			localStorage.setItem("createEmployeeSchema", formSchema)
			break;
		case "update":
			localStorage.setItem("updateEmployeeSchema", formSchema)
			break;
		case "filters":
			localStorage.setItem("filtersEmployeeSchema", formSchema)
			break;
	}
}

export async function useEmployeeSchemas() {

	let createEmployeeSchema  = undefined;
	let updateEmployeeSchema  = undefined;
	let filtersEmployeeSchema = undefined;
	let updateAllowedMethod;

	if (!createEmployeeSchema || !updateEmployeeSchema || !filtersEmployeeSchema) {
		const { actions, filtering_schema } = await getEmployeeSchemas()

		createEmployeeSchema  = formatCreateSchema(actions.POST)
		updateEmployeeSchema  = formatUpdateSchema(actions.PATCH ?? actions.PUT)
		filtersEmployeeSchema = formatCreateSchema(filtering_schema)
		updateAllowedMethod = actions.PATCH ? "patch" : "put"

		saveSchematoStorage("create", JSON.stringify(createEmployeeSchema))
		saveSchematoStorage("udpate", JSON.stringify(updateEmployeeSchema))
		saveSchematoStorage("filters", JSON.stringify(filtersEmployeeSchema))
	}

	return {
		createEmployeeSchema,
		updateEmployeeSchema,
		filtersEmployeeSchema,
		updateAllowedMethod,
	}
}