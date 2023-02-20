import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useCookies } from '@vueuse/integrations/useCookies'

export type UserData = Record<string, any> | null

export const useUserSession = defineStore('userSession', () => {
  // token will be synced with local storage
  // @see https://vueuse.org/core/usestorage/
  const cookies = useCookies(['access_token', 'refresh_token', 'isLoggedIn'])

  const user = ref<Partial<UserData>>()
  const loading = ref(true)

  function setUser(newUser: Partial<UserData>) {
    user.value = newUser
  }

  function setAccessToken(newToken: string) {
    cookies.set('access_token', newToken)
    cookies.set('isLoggedIn', true)
  }

  function setRefreshToken(newToken: string) {
    cookies.set('refresh_token', newToken)
  }

  function setLoading(newLoading: boolean) {
    loading.value = newLoading
  }

  function logoutUser() {
    cookies.set('access_token', undefined)
    cookies.set('isLoggedIn', false)
    cookies.set('refresh_token', undefined)
    user.value = undefined
  }

  return {
    cookies,
    user,
    loading,
    logoutUser,
    setUser,
    setAccessToken,
    setRefreshToken,
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
