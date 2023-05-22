import { useModelSchemas } from '/@src/utils/app/CRUD/modelCache'
import { getInstanceSchemas as schemasFunction } from '/@src/utils/api/modelApiCallFunctions'

export const getEndpointDependencies = async (endpointUrl, modelName) => {
	const { createSchema, updateSchema, updateAllowedMethod } = await useModelSchemas(endpointUrl, schemasFunction, modelName)

	return {
		createSchema,
		updateSchema,
		updateAllowedMethod
	}
}