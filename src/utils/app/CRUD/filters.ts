export function convertObjectToFilterString(obj: object) {

	let result: string = ''

	for (const key in obj) {
		const currentValue = obj[key]

		if (!currentValue) {
			continue
		}

		result += `${key}=${currentValue}&`
	}

	return result.slice(0, -1)
}