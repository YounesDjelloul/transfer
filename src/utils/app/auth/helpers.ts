import { getInstanceSchemas as schemasFunction } from '/@src/utils/api/modelApiCallFunctions'
import { useModelSchemas } from '/@src/utils/app/CRUD/modelCache'

export const registerDependencyGenerator = async (componentDependencies: object, modelName: string, errorToDisplay, endpointUrl) => {
  try {
    const { createSchema } = await useModelSchemas(endpointUrl, schemasFunction, modelName)

    componentDependencies.createSchema = createSchema

  } catch (error) {
    errorToDisplay.value = "Request Failed! We working on it.."
  }
}