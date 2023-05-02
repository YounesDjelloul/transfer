import { useApi } from '/@src/composable/useApi'
import API_URLs from '/@src/utils/api/urls'

const api = useApi()

export async function getClients(pageQuery) {

	const { data: data } = await api.get(API_URLs.CLIENTS + pageQuery)
	return data
}

export async function createNewClient(body: object) {
	
	return await api.post(API_URLs.CLIENTS, body)
}

export async function getClientDetails(clientPk: string) {

	const { data: data } = await api.get(API_URLs.CLIENTS+clientPk)
	return data
}

export async function deleteClientRequest(clientPk: string) {

	const response = await api.delete(API_URLs.CLIENTS+clientPk)
}

export async function updateClientDetailsRequest(clientPk: string, body: object, methodAllowed: string) {
	const result = await api.patch(API_URLs.CLIENTS+clientPk+'/', body)
	return result
}

export async function getClientSchemas() {

	const { data } = await api.options(API_URLs.CLIENTS)
	return data
}

export async function getFieldChoices(endpointUrl, searchKeyword) {
	const { data } = await api.get(`${endpointUrl}?search=${searchKeyword}`)
	return data.results
}

export async function getJobTitleDetails(endpointUrl, jobPk) {
	const response = await api.get(`${endpointUrl}${jobPk}`)
	return response.data
}