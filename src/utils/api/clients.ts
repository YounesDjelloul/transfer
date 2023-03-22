import { useApi } from '/@src/composable/useApi'
import API_URLs from '/@src/utils/api/urls'
import { z as zod } from 'zod'

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

export async function getCreateClientSchema() {

	const { data } = await api.options(API_URLs.CLIENTS)
	return data
}

export async function getUpdateClientSchema(clientId: number) {

	const { data } = await api.options(API_URLs.CLIENTS+clientId+'/')
	return data
}