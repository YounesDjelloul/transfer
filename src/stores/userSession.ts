import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useCookies } from '@vueuse/integrations/useCookies'

export type UserData = Record<string, any> | null

export const useUserSession = defineStore('userSession', () => {
  // token will be synced with local storage
  // @see https://vueuse.org/core/usestorage/
  const cookies = useCookies(['refresh_token', 'access_token'])

  const refreshToken = cookies.get("refresh_token")
  const accessToken  = cookies.get("access_token")

  const user = ref<Partial<UserData>>()
  const loading = ref(true)

  const isLoggedIn = computed(() => accessToken !== undefined && accessToken !== '')

  function setUser(newUser: Partial<UserData>) {
    user.value = newUser
  }

  function setRefreshToken(newToken: string) {
    cookies.set('refresh_token', newToken)
  }

  function setAccessToken(newToken: string) {
    cookies.set('access_token', newToken)
  }

  function setLoading(newLoading: boolean) {
    loading.value = newLoading
  }

  async function logoutUser() {
    cookies.set('refresh_token', undefined)
    cookies.set('access_token', undefined)
    user.value = undefined
  }

  return {
    user,
    refreshToken,
    accessToken,
    isLoggedIn,
    loading,
    logoutUser,
    setUser,
    setRefreshToken,
    setAccessToken,
    setLoading,
  } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserSession, import.meta.hot))
}
