export function getValueFromNestedObject(fieldProps: object, path: string) {
	return path.split('.').reduce((value, el) => value[el], fieldProps)
}