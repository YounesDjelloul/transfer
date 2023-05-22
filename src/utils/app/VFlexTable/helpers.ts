import { getInstanceSchemas as schemasFunction } from '/@src/utils/api/modelApiCallFunctions'
import { useModelSchemas } from '/@src/utils/app/CRUD/modelCache'
import { generateColumns } from '/@src/utils/app/shared/helpers'

export function getValueFromNestedObject(fieldProps: object, path: string) {

	const nesting = path.split(".")
	let result = fieldProps

	for (const one of nesting) {
		
		if (!result) return null
		result = result[one]
	}

	return result
}

export const GeneratorFunctionForLists = async (componentDependencies: object, modelName: string, renderLoading, errorToDisplay, endpointUrl) => {
  try {
    const {
      createSchema,
      updateSchema,
      filtersSchema,
      sortingSchema,
      updateAllowedMethod,
      lookupField,
      listingColumns,
    } = await useModelSchemas(endpointUrl, schemasFunction, modelName)

    componentDependencies.createModelSchema  = createSchema
    componentDependencies.updateModelSchema  = updateSchema
    componentDependencies.filtersModelSchema = filtersSchema
    componentDependencies.updateMethod       = updateAllowedMethod
    componentDependencies.modelPk            = lookupField
    componentDependencies.columns            = generateColumns(createSchema, sortingSchema, listingColumns)
  } catch (error) {
    errorToDisplay.value = "Request Failed! We working on it.."

  } finally {
    renderLoading.value = false
  }
}

export const InvoicesDependencyGenerator = async (componentDependencies: object, modelName: string, renderLoading, errorToDisplay, endpointUrl) => {
  try {
    const {
      createSchema,
      lookupField,
    } = await useModelSchemas(endpointUrl, schemasFunction, modelName)    

    componentDependencies.modelPk       = lookupField
    componentDependencies.overAllSchema = createSchema

    splitCreateSchemaFields(componentDependencies, createSchema)

  } catch (error) {
    errorToDisplay.value = "Request Failed! We working on it.."

  } finally {
    renderLoading.value = false
  }
}

export const splitCreateSchemaFields = (componentDependencies, createSchema) => {
  for (const field of createSchema) {
    if (field.type === 'field') {
      componentDependencies.tableFieldsSchema.push(field)
    } else {
      componentDependencies.normalFieldsSchema.push(field)
    }
  }
}