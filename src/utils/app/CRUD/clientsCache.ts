import {
  getCreateClientSchema,
  getUpdateClientSchema,
} from '/@src/utils/api/clients'

import {
  formatCreateSchema,
  formatUpdateSchema,
} from '/@src/utils/app/CRUD/helpers'

function saveSchematoStorage(action: string, schema: string) {

	switch (action) {
		case "create":
			localStorage.setItem("createClientSchema", schema)
			break;
		case "update":
			localStorage.setItem("updateClientSchema", schema)
			break;
	}
}

export async function useCreateClientSchema() {

	let formattedSchema = localStorage.getItem("createClientSchema");

	if (!formattedSchema) {
		const { actions: createActions } = await getCreateClientSchema()
		formattedSchema = formatCreateSchema(createActions.POST)
		saveSchematoStorage("create", JSON.stringify(formattedSchema))
	}

	return typeof formattedSchema === "string" ? JSON.parse(formattedSchema) : formattedSchema
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