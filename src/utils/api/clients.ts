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

export async function getClientDetails(clientPk: string) {

	const { data: data } = await api.get(API_URLs.CLIENTS+clientPk)
	return data
}

export async function deleteClientRequest(clientPk: string) {

	const response = await api.delete(API_URLs.CLIENTS+clientPk)
}

export async function updateClientDetailsRequest(clientPk: string, body: object) {

	return await api.put(API_URLs.CLIENTS+clientPk+'/', body)
}

export async function getCreateClientSchema() {

	const { data } = await api.options(API_URLs.CLIENTS)
	return data
}

export async function getUpdateClientSchema(clientPk: string) {

	const { data } = await api.options(API_URLs.CLIENTS+clientPk+'/')
	return data
}

export async function getFilterClientsSchema() {

	const { data } = await api.options(API_URLs.CLIENTS)
	return data
}