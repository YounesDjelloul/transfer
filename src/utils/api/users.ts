import { useApi } from '/@src/composable/useApi'
import API_URLs from '/@src/utils/api/urls'

const api = useApi()

export async function getUserDetails(userUsername: string) {

	const { data: data } = await api.get(`${API_URLs.USERS}${userUsername}/`)
	return data
}

export async function getUpdateUserSchema(userUsername: string) {

	const { data: data } = await api.options(`${API_URLs.USERS}${userUsername}/`)
	return data
}

export async function updateUserDetails(userUsername: string, body: object) {

	const { data: data } = await api.put(`${API_URLs.USERS}${userUsername}/`, body)
	return data
}