import { h } from 'vue'
import { z as zod } from 'zod'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { convertObjectToFilterString, convertSchemaToEmptyFilterString } from '/@src/utils/app/CRUD/filters'
import { getFieldChoices, getEndpointInstanceDetails } from '/@src/utils/api/modelApiCallFunctions'
import { useFieldSelect } from '/@src/stores/fieldTypeSelect'
import { getEndpointDependencies } from '/@src/utils/app/deep_invoices/helpers'

export function deleteCurrentInstance(instance: object) {
  return instance.user.id !== this
}

export function getRowPk(row, modelPk) {

  modelPk = modelPk === 'pk' ? 'id' : modelPk

  const flattendRow = flattenObj(row)
  return flattendRow[modelPk.replaceAll('__', '.')]
}

export function updateCurrentInstance(instance: object, instanceIndex: number, data: []) {
  
  const instanceId   = this[0]
  const instanceData = this[1]

  if (instance.user.id === instanceId) {
    for (const prop in instanceData.value) {
      data[instanceIndex][prop] = instanceData.value[prop]
    }
  }
}

export const flattenObj = (ob) => {
 
  let result = {};

  for (const i in ob) {
    if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i]);
      for (const j in temp) {
        result[i + '.' + j] = temp[j];
      }
    }

    else {
      result[i] = ob[i];
    }
  }
  return result;
};

export function generateInitialValues(schema: [], instance: object = {}) {
  let result = {}

  function recurse(nesting, val) {

    const lastKey = nesting.pop()
    const lastObj = nesting.reduce((result, key) => 
      result[key] = result[key] || {}, result
    )

    lastObj[lastKey] = val
  }

  const flattendInstance = flattenObj(instance)

  for (const field of schema) {

    const fieldValues = {
      "image upload": null,
      "boolean": false,
      "many_to_many": [],
      "": null,
      "string": "",
      "choice": "",
      "email": "",
      "url": "",
    }

    let fieldType = field.type

    if (fieldType === 'field') {
      fieldType = field.drf_type
    }

    let currentValue = flattendInstance[field.id] ?? fieldValues[fieldType]

    if (field.id.includes(".")) {
      const nesting = field.id.split(".")
      recurse(nesting, currentValue)
      continue
    }

    result[field.name] = currentValue
  }

  return result
}

export function formatView(instance: object) {

  let result = {}

  function recurse(currentValue: object) {

    for (const fieldName in currentValue) {

      const fieldValue = currentValue[fieldName]

      if (typeof fieldValue === 'object' && fieldValue !== null) { // Checking if it's nested
        recurse(fieldValue)
        continue
      }
      
      result[fieldName] = fieldValue
    }
  }

  recurse(instance)

  return result
}

export function formatError(key?: string | undefined, errorObject: object) {

  let result = {}

  function recurse(errorKey: string | undefined, errorInner: object){

    for (const one in errorInner) {

      const errorValue = errorInner[one]

      if (Array.isArray(errorValue)) {
        errorKey ? result[`${errorKey}.${one}`] = errorValue[0] : result[one] = errorValue[0]
      
      } else if (typeof errorValue === 'object') {
        recurse(one, errorValue)
      }
    }
  }

  recurse(key, errorObject)
  return result
}

export function formatCreateSchema(fullSchema: object) {

  let result = []

  function recurse(fieldIdPrefix: string, obj: object) {

    for (const field in obj) {

      let fieldProp: object = obj[field]

      if (fieldProp.read_only) {
        continue
      }

      if (fieldProp.type === "nested object") {
        recurse(fieldIdPrefix+`${field}.`, fieldProp.children)
        continue
      }

      fieldProp["name"] = field
      fieldProp["id"]   = fieldIdPrefix + field
      result.push(fieldProp)
    }
  }

  recurse("", fullSchema)

  return result
}

export function formatUpdateSchema(fullSchema: object) {

  let result = []

  function recurse(fieldIdPrefix: string, obj: object) {

    for (const field in obj) {

      let fieldProp: object = obj[field]
      
      if (fieldProp.read_only) {
        continue
      }

      if (fieldProp.type === "nested object") {
        recurse(fieldIdPrefix+`${field}.`, fieldProp.children)
        continue
      }

      fieldProp["name"] = field
      fieldProp["id"]   = fieldIdPrefix + field
      result.push(fieldProp)
    }
  }

  recurse("", fullSchema)
  return result
}

export function generateValidationSchema(formSchema: object, translateFunction) {

  const t = translateFunction

  const zodFunctionsRepo = {
    "string": zod.string(),
    "choice": zod.coerce.string(),
    "email": zod.string(),
    "image upload": zod.any(),
    "array": zod.array(zod.number()),
    "boolean": zod.boolean(),
    "nullableNumber": zod.union([zod.null(), zod.number()]),
    "number": zod.coerce.number(),
    "decimal": zod.coerce.number(),
    "url": zod.string(),
    "date": zod.coerce.string(),
  }

  function getZodField(fieldProp) {

    let fieldType = fieldProp.type

    if (fieldType === 'field') {
      if (fieldProp.drf_type === "many_to_many") {
        fieldType = "array"
      } else if (fieldProp.drf_type !== "many_to_many") {
        fieldType = fieldProp.required ? "number" : 'nullableNumber'
      }
    }

    let zodField = zodFunctionsRepo[fieldType] ?? zod.string()

    if (fieldProp.required) {
      zodField = zodField.min(1, {message: "Field Required"})
    } else {
      zodField = zodField.optional()
    }

    return zodField
  }

  let result = zod.object({})

  function handleNestedFields(nesting, fieldProp) {

    const zodField = getZodField(fieldProp)
    
    let SchemaCopy = result
    let record     = {}

    for (let ind = 0; ind < nesting.length; ind++) {

      const part = nesting[ind]

      if (ind == nesting.length - 1) {
        SchemaCopy = SchemaCopy.extend({ [part]: zodField })
      }

      if (SchemaCopy.shape[part] == undefined) {
        SchemaCopy = SchemaCopy.extend({ [part]: zod.object({}) })
      }

      record[part] = SchemaCopy.shape[part]
      SchemaCopy = SchemaCopy.shape[part]
    }

    let props = Object.keys(record).reverse()

    for (let i = 0; i < props.length; i++) {

      const currentZodName = props[i]
      const nextZodName    = props[i+1]

      if (i == props.length - 1) {
        result = result.extend({ [currentZodName]: record[currentZodName] })
        continue
      }

      record[nextZodName] = record[nextZodName].extend({ [currentZodName]: record[currentZodName] })
    }
  }

  for (const fieldIndex in formSchema) {

    const fieldProp = formSchema[fieldIndex]
    const fieldId   = fieldProp.id

    const nesting = fieldId.split(".")
    handleNestedFields(nesting, fieldProp)
  }

  return result
}

export function formatFieldChoices(choicesObject: object) {

  let result = []

  for (const one of choicesObject) {
    const current = {value: one.id, display_name: one.label}
    result.push(current)
  }

  return result
}

export function objectToFormData(obj, formData, namespace="") {
    
  const fd = formData || new FormData();
  
  for (const key in obj) {

    const value = obj[key]

    if (typeof value == 'object' && !(value instanceof File)) {
      objectToFormData(value, fd, `${namespace}${key}.`)
      continue
    }

    fd.append(`${namespace}${key}`, value)
  }
  
  return fd
}

export function cleanValuesIfPatch(values, updateAllowedMethod, instanceValues) {

  if (updateAllowedMethod == "PUT") {
    return values
  }

  const flattendValues         = flattenObj(values)
  const flattendInstanceValues = flattenObj(instanceValues)
  let nestedResult             = {}

  for (const valueKey in flattendValues) {
    const value = flattendValues[valueKey]

    if (JSON.stringify(value) !== JSON.stringify(flattendInstanceValues[valueKey])) {
      nestedResult[valueKey] = value
    }
  }

  let result = {}

  function recurse(nesting, val) {

    const lastKey = nesting.pop()
    const lastObj = nesting.reduce((result, key) => 
      result[key] = result[key] || {}, result
    )

    lastObj[lastKey] = val
  }

  for (const one in nestedResult) {
    const nesting = one.split(".")
    recurse(nesting, nestedResult[one])
  }

  return result
}

export function getPrioritizedUpdateMethod(actions: object) {
  return actions.PUT ? "put" : "patch"
}

export function formatUserAvatarUrl(url: string) {
  if (!url) {
    return null
  }

  return url.replace(/^(?:\/\/|[^/]+)*\//, '')
}

export async function generateAndAssignDataObjectToStore(initialValues, formSchema, deep=false) {

  const fieldSelect           = useFieldSelect()
  const fieldsTypeData        = reactive({})
  const flattendInitialValues = flattenObj(initialValues)

  for (const fieldSchema of formSchema) {
    if (fieldSchema.type !== 'field') {
      continue
    }

    let currentObject  = {'isOpen': false, 'typed': ''}
    const currentValue = flattendInitialValues[fieldSchema.id] ?? ""

    try {

      let jobsDetails    = [];
      let toSubmitValues = fieldSchema.relationship === 'many_to_many' ? [] : null

      if (typeof currentValue == 'number') {
        const detailsResponse = await getEndpointInstanceDetails(fieldSchema.endpoint_url, currentValue)
        jobsDetails.push({"value": detailsResponse.id, "display_name": detailsResponse.label})
        toSubmitValues = detailsResponse.id
      } else if (Array.isArray(currentValue)) {
        for (const onePk of currentValue) {
          const detailsResponse = await getEndpointInstanceDetails(fieldSchema.endpoint_url, onePk)
          jobsDetails.push({"value": detailsResponse.id, "display_name": detailsResponse.label})
          toSubmitValues.push(detailsResponse.id)
        }
      }
    
      currentObject['selectedItem']   = jobsDetails.length > 0 ? jobsDetails : []
      currentObject['toSubmitValues'] = toSubmitValues
      currentObject['options']        = formatFieldChoices(await getFieldChoices(fieldSchema.endpoint_url, ''))

      if (deep) {
        const currentEndpointDependencies = await getEndpointDependencies(fieldSchema.endpoint_url, fieldSchema.label)

        currentObject['createSchema']   = currentEndpointDependencies.createSchema
        currentObject['updateSchema']   = currentEndpointDependencies.updateSchema
        currentObject['updateAllowedMethod'] = currentEndpointDependencies.updateAllowedMethod
      }
    } catch (error) {
      currentObject['selectedItem']   = []
      currentObject['toSubmitValues'] = null
      currentObject['options']        = []
      currentObject['createSchema']   = []
    } finally {
      fieldsTypeData[fieldSchema.id]  = currentObject
    }
  }

  fieldSelect.setData(fieldsTypeData)
}

export function formatSortSchema(orderingSchema) {

  let result = new Set()

  for (const field of orderingSchema) {

    if (field.value === null) {
      continue
    }

    const fieldId = field.value.replaceAll('__', '.')
    result.add(fieldId)
  }

  return result
}

export function formatColumnListingSchema(listingSchema) {

  let result = []

  for (let field of listingSchema) {

    if (field.value === null) {
      continue
    }

    field.dotValue = field.value.replaceAll('__', '.')
    result.push(field)
  }
  return result
}

export function generateColumns(formSchema, sortingSchema, toShow) {

  let mediaFields = []
  let result      = []
  let headings    = []

  for (const one of formSchema) {
    if (one.html_input_type === 'file') {
      mediaFields.push(one.id)
    }
  }

  for (const field of toShow) {
    let orderable = sortingSchema.has(field.dotValue)

    let currentObj = {
      orderable: sortingSchema.has(field.dotValue),
      data: field.dotValue,
      display_name: field.display_name,
    }

    headings.push(currentObj)
    result.push(currentObj)
  }

  let currentObj = {
    orderable: false,
    data: "Actions",
    display_name: "Actions",
    render: (data, type, row) => {
      return h('div', { id: 'foo' }, 'hello')
    },
  }

  headings.push(currentObj)
  result.push(currentObj)

  return {result, headings}
}

export function saveSchematoStorage(actionKey: string, formSchema: string) {
  localStorage.setItem(actionKey, formSchema)
}

export function checkIfFileFieldExist(formSchema) {

  for (const field of formSchema) {
    if (field.html_input_type === 'file') {
      return true
    }
  }

  return false
}