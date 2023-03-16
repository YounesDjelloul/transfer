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

export async function getClientDetails(clientId: number) {

	const { data: data } = await api.get(API_URLs.CLIENTS+clientId)
	return data
}

export async function deleteClientRequest(clientId: number) {

	const response = await api.delete(API_URLs.CLIENTS+clientId)
}

export async function updateClientDetailsRequest(clientId: number, body: object) {

	return await api.put(API_URLs.CLIENTS+clientId+'/', body)
}