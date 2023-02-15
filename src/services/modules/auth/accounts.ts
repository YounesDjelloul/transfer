import { useApi } from '/@src/composable/useApi'
import { useUserSession } from '/@src/stores/userSession'

export async function authenticateUser(credentials: object) {

	const userSession = useUserSession()
	const api         = useApi()
	
	const loginRoute: string  = "/auth/login"

	const data = await api.post(loginRoute, credentials)

	userSession.setAccessToken(data.access_token)
	userSession.setRefreshToken(data.access_token)

	const userDetails: object = api.get("/auth/user")
	userSession.setUser(userDetails)
}