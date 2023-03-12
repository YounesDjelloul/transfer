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