import { useApi } from '/@src/composable/useApi'
import API_URLs from '/@src/utils/api/urls'

const api = useApi()

export async function getUserDetails() {

	const { data: data } = await api.get(`${API_URLs.CURRENT_USER_PROFILE}`)
	return data
}

export async function getUpdateUserSchema(userUsername: string) {

	const { data: data } = await api.options(`${API_URLs.CURRENT_USER_PROFILE}`)
	return data
}

export async function updateUserDetails(body: object) {

	const { data: data } = await api.put(`${API_URLs.CURRENT_USER_PROFILE}`, body)
	return data
}