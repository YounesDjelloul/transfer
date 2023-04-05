export function getValueFromNestedObject(fieldProps: object, path: string) {

	const nesting = path.split(".")
	let result = fieldProps

	for (const one of nesting) {
		
		if (!result) return null
		result = result[one]
	}

	return result
}