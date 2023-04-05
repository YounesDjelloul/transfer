import { z as zod } from 'zod'
import { useI18n } from 'vue-i18n'

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

    const currentValue = instance[field.name] ?? ""

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

    const fieldType = fieldProp.fieldType
    const currentZodFunction = zodFunctionsRepo[fieldType] ?? "string"
    
    let result = zod[currentZodFunction]()

    if (fieldProp.required) {
      result = result.min(1, {message: "Field Required"})
    }

    return result
  }

  let result = zod.object({})

  function handleNestedFields(parent, child, fieldProp) {

    let parentObject = result.shape[parent] ?? zod.object({})

    parentObject = parentObject.extend({ [child]: getZodField(fieldProp) })
    result       = result.extend({ [parent]: parentObject })
  }

  for (const fieldIndex in formSchema) {

    const fieldProp = formSchema[fieldIndex]
    const fieldId   = fieldProp.id
    const fieldName = fieldProp.name

    if (fieldId.includes(".")) {
      const nesting = fieldId.split(".")
      handleNestedFields(nesting[0], nesting[1], fieldProp)
      continue
    }

    result = result.extend({ [fieldId] : getZodField(fieldProp)});
  }

  return result
}