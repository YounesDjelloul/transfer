export function FormatingOrderingParam(sortParam: string) {

	const [sort_field, order_value] = sortParam.split(':')

	if (order_value === "desc") {
		return '-' + sort_field
	}

	return sort_field // Ascending case
}