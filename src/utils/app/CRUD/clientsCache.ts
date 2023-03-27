import {
  getCreateClientSchema,
  getUpdateClientSchema,
} from '/@src/utils/api/clients'

import {
  formatCreateSchema,
  formatUpdateSchema,
  generateValidationSchema,
} from '/@src/utils/app/CRUD/helpers'

function saveSchematoStorage(action: string, formSchema: string, validationSchema: string) {

	switch (action) {
		case "create":
			localStorage.setItem("createClientSchema", formSchema)
			localStorage.setItem("createClientValidationSchema", validationSchema)
			break;
		case "update":
			localStorage.setItem("updateClientSchema", formSchema)
			break;
	}
}

export async function useCreateClientSchema() {

	let formattedSchema = undefined;
	let validationSchema = undefined;

	if (!formattedSchema || !validationSchema) {
		const { actions: createActions } = await getCreateClientSchema()
		formattedSchema  = formatCreateSchema(createActions.POST)
		validationSchema = generateValidationSchema(createActions.POST)
		saveSchematoStorage("create", JSON.stringify(formattedSchema), validationSchema)
	}

	return {
		formSchema: typeof formattedSchema === "string" ? JSON.parse(formattedSchema) : formattedSchema,
		validationSchema: validationSchema,
	}
}

export async function useUpdateClientSchema(clientId: number) {

	let formattedSchema = localStorage.getItem("updateClientSchema");

	if (!formattedSchema) {
		const { actions: updateActions } = await getUpdateClientSchema(clientId)
		formattedSchema = formatUpdateSchema(updateActions.PUT)
		saveSchematoStorage("update", JSON.stringify(formattedSchema))
	}

	return typeof formattedSchema === "string" ? JSON.parse(formattedSchema) : formattedSchema
}