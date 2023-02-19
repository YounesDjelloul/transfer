import { useApi } from '/@src/composable/useApi'
import { useUserSession } from '/@src/stores/userSession'

const userSession = useUserSession()
const api         = useApi()

export async function logoutUser() {
	await userSession.logoutUser()
}

export async function getUserDetails() {

	const getUserDetailsRoute = "/auth/user/"

	const userDetails = await api.get(getUserDetailsRoute)
	userSession.setUser(userDetails.data)
}

export async function authenticateUser(credentials: object) {

	const loginRoute: string  = "/auth/login/"
	const { data: data } = await api.post(loginRoute, credentials)

	userSession.setAccessToken(data.access_token)
	//userSession.setRefreshToken(data.refresh_token)
}

export async function registerUser(registrationObject: object) {

	const registerRoute: string  = "/auth/registration/"
	const data = await api.post(registerRoute, registrationObject)
}