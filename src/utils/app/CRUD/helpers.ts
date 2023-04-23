import { z as zod } from 'zod'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { convertObjectToFilterString, convertSchemaToEmptyFilterString } from '/@src/utils/app/CRUD/filters'

export function generateInitialValues(instance: object, schema: []) {
  let result = {}

  function recurse(nesting, val) {

    const lastKey = nesting.pop()
    const lastObj = nesting.reduce((result, key) => 
      result[key] = result[key] || {}, result
    )

    lastObj[lastKey] = val
  }

  for (const field of schema) {

    let currentValue = instance[field.name] ?? ""

    if (field.type == "image upload") {
      currentValue = null
    }

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


export function deleteCurrentClient(client: object) {
  return client.user.id !== this
}

export function updateCurrentClient(client: object, clientIndex: number, clients: []) {
  
  const clientId   = this[0]
  const clientData = this[1]

  if (client.user.id === clientId) {
    for (const prop in clientData.value) {
      clients[clientIndex][prop] = clientData.value[prop]
    }
  }
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
    "string": "string",
    "choice": "string",
    "email": "string",
    "image upload": "any",
  }

  function getZodField(fieldProp) {

    const fieldType = fieldProp.type
    const currentZodFunction = zodFunctionsRepo[fieldType] ?? "string"
    
    let result = zod[currentZodFunction]()

    if (fieldProp.required) {
      result = result.min(1, {message: "Field Required"})
    }

    return result
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
    const fieldName = fieldProp.name

    if (fieldId.includes(".")) {
      const nesting = fieldId.split(".")
      handleNestedFields(nesting, fieldProp)
      continue
    }

    result = result.extend({ [fieldId] : getZodField(fieldProp)});
  }

  return result
}

export function formatFieldChoices(choicesObject: object) {

  let result = []

  for (const one of choicesObject) {
    const current = {value: one.id, display_name: one.name}
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
  
  return fd;
};