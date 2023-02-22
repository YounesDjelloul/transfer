import { useApi } from '/@src/composable/useApi'
import API_URLs from '/@src/utils/api/urls'

const api = useApi()

export async function getAllClients() {

	const { data: data } = await api.get(API_URLs.CLIENTS)
	return data
}

export async function createNewClient(body: object) {

	const { data: data } = await api.post(API_URLs.CLIENTS, body)
	return data
}

export async function getClientDetail(clientId: number) {

	const { data: data } = await api.get(API_URLs.CLIENTS+clientId)
	return data
}

export async function deleteClientRequest(clientId: number) {

	const response = await api.delete(API_URLs.CLIENTS+clientId)
}