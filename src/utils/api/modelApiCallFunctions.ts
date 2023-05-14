import { useApi } from '/@src/composable/useApi'

const api = useApi()

export async function getInstances(endpointUrl: string, pageQuery) {

	const { data: data } = await api.get(`${endpointUrl}${pageQuery}`)
	return data
}

export async function createNewInstance(endpointUrl: string, body: object) {
	
	return await api.post(endpointUrl, body)
}

export async function getInstanceDetails(endpointUrl: string, instancePk: string) {

	const { data: data } = await api.get(`${endpointUrl}${instancePk}`)
	return data
}

export async function deleteInstanceRequest(endpointUrl: string, instancePk: string) {

	const response = await api.delete(`${endpointUrl}${instancePk}`)
}

export async function updateInstanceDetailsRequest(endpointUrl: string, instancePk: string, body: object, methodAllowed: string) {
	const result = await api[methodAllowed](`${endpointUrl}${instancePk}`, body)
	return result
}

export async function getInstanceSchemas(endpointUrl: string) {

	const { data } = await api.options(endpointUrl)
	return data
}

export async function getFieldChoices(endpointUrl: string, searchKeyword) {
	const { data } = await api.get(`${endpointUrl}?search=${searchKeyword}`)
	return data.results
}

export async function getEndpointInstanceDetails(endpointUrl: string, instancePk) {
	const response = await api.get(`${endpointUrl}${instancePk}`)
	return response.data
}