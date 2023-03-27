import { useApi } from '/@src/composable/useApi'
import API_URLs from '/@src/utils/api/urls'

const api = useApi()

export async function newAccessToken(userSession: any) {

	userSession.cookies.set('isLoggedIn', false)
	const body: object = {"refresh": userSession.cookies.get('refresh_token')}

	const { data: data } = await api.post(API_URLs.NEW_ACCESS_TOKEN, body)
	userSession.setAccessToken(data.access)
}

export async function getUserProfile(userSession: any) {

	const userDetails = await api.get(API_URLs.CURRENT_USER_PROFILE)
	userSession.setUser(userDetails.data)
}

export async function getSignupSchema() {

	const { data } = await api.options(API_URLs.REGISTRATION)
	return data.actions.POST
}