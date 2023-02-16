import { useApi } from '/@src/composable/useApi'
import { useUserSession } from '/@src/stores/userSession'

const userSession = useUserSession()
const api         = useApi()

export async function authenticateUser(credentials: object) {
	
	const loginRoute: string  = "/auth/login"

	const data = await api.post(loginRoute, credentials)

	userSession.setAccessToken(data.access_token)
	userSession.setRefreshToken(data.access_token)

	const userDetails: object = api.get("/auth/user")
	userSession.setUser(userDetails)
}

export async function registerUser(registrationObject: object) {

	const registerRoute: string  = "/auth/registration"

	const data = await api.post(registerRoute, registrationObject)
}