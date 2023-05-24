import {
  getUpdateUserSchema,
} from '/@src/utils/api/users'

import {
  formatUpdateSchema,
} from '/@src/utils/app/shared/helpers'

export function objectPop(propertyName: string, userDetailsObject: object) {

	const propertyValue: string = userDetailsObject[propertyName]
	delete userDetailsObject[propertyName]

	return propertyValue
}

export function arrayPop(propertyName: string, formSchema: object) {

	let targetProp = undefined

	for (const i in formSchema) {

		const fieldProp = formSchema[i]

		if (fieldProp.name == propertyName) {
			formSchema.splice(i, 1)
			targetProp = fieldProp
			break
		}
	}

	return targetProp
}

export async function getFormattedUpdateUserSchema() {

	const { actions: actions } = await getUpdateUserSchema()
	return formatUpdateSchema(actions.PUT)
}