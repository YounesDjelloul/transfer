import { useModelSchemas } from '/@src/utils/app/CRUD/modelCache'
import { getInstanceSchemas as schemasFunction } from '/@src/utils/api/modelApiCallFunctions'

export const getEndpointCreateSchema = async (endpointUrl, modelName) => {
	const { createSchema } = await useModelSchemas(endpointUrl, schemasFunction, modelName)

	return createSchema
}