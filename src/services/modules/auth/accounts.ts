import { useApi } from '/@src/composable/useApi'
import { useUserSession } from '/@src/stores/userSession'
import API_URLs from '/@src/utils/api/urls'

const userSession = useUserSession()
const api         = useApi()

export async function getUserDetails() {

	const getUserDetailsRoute = API_URLs.CURRENT_USER_PROFILE
	const userDetails         = await api.get(getUserDetailsRoute)

	userSession.setUser(userDetails.data)
}

export async function authenticateUser(credentials: object) {

	const loginRoute: string  = API_URLs.LOGIN
	const { data: data }      = await api.post(loginRoute, credentials)

	userSession.setAccessToken(data.access_token)
	userSession.setRefreshToken(data.refresh_token)
}

export async function registerUser(registrationObject: object) {

	const registerRoute: string  = API_URLs.REGISTRATION
	const data                   = await api.post(registerRoute, registrationObject)
}

export async function changeUserPassword(passwordsData: object) {

	const registerRoute: string  = API_URLs.PASSWORD__CHANGE
	return await api.post(API_URLs.PASSWORD__CHANGE, passwordsData)
}