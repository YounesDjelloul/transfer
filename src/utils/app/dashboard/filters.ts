export function convertObjectToFilterString(obj: object) {

	let result: string = '?'

	for (const key in obj) {
	  result += `${key}=${obj[key]}&`
	}

	return result.slice(0, -1)
}