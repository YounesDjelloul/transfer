export function generateInitialValues(instance: object, schema: []) {
  let result = {}

  for (const field of schema) {

    if (!instance.hasOwnProperty(field.name)) { 
      continue
    }

    const currentValue = instance[field.name] !== null ? instance[field.name] : ''

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
  return client.user.id !== this.value
}

export function updateCurrentClient(client: object, clientIndex: number, clients: []) {
  
  const clientId   = this[0]
  const clientData = this[1]

  if (client.user.id === clientId.value) {
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
        errorKey ? result[`${errorKey}.${one}`] = errorValue : result[one] = errorValue
      
      } else if (typeof errorValue === 'object') {
        recurse(one, errorValue)
      }
    }
  }

  recurse(key, errorObject)
  return result
}