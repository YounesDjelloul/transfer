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