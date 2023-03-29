import {
  getCreateClientSchema,
  getUpdateClientSchema,
} from '/@src/utils/api/clients'

import {
  formatCreateSchema,
  formatUpdateSchema,
  generateValidationSchema,
} from '/@src/utils/app/CRUD/helpers'

function saveSchematoStorage(action: string, formSchema: string) {

	switch (action) {
		case "create":
			localStorage.setItem("createClientSchema", formSchema)
			break;
		case "update":
			localStorage.setItem("updateClientSchema", formSchema)
			break;
	}
}

export async function useCreateClientSchema() {

	let formattedSchema = undefined;

	if (!formattedSchema) {
		const { actions: createActions } = await getCreateClientSchema()
		formattedSchema  = formatCreateSchema(createActions.POST)
		saveSchematoStorage("create", JSON.stringify(formattedSchema))
	}

	return typeof formattedSchema === "string" ? JSON.parse(formattedSchema) : formattedSchema
}

export async function useUpdateClientSchema(clientId: number) {

	let formattedSchema = undefined;

	if (!formattedSchema) {
		const { actions: updateActions } = await getUpdateClientSchema(clientId)
		formattedSchema = formatUpdateSchema(updateActions.PUT)
		saveSchematoStorage("update", JSON.stringify(formattedSchema))
	}

	return typeof formattedSchema === "string" ? JSON.parse(formattedSchema) : formattedSchema
}