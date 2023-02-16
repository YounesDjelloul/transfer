import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useCookies } from '@vueuse/integrations/useCookies'

export type UserData = Record<string, any> | null

export const useUserSession = defineStore('userSession', () => {
  // token will be synced with local storage
  // @see https://vueuse.org/core/usestorage/
  const accessToken = useStorage('access_token', '')
  const refreshToken = useStorage('refresh_token', '')

  const user = ref<Partial<UserData>>()
  const loading = ref(true)

  const isLoggedIn = computed(() => accessToken.value !== undefined && accessToken.value !== '')

  function setUser(newUser: Partial<UserData>) {
    user.value = newUser
  }

  function setAccessToken(newToken: string) {
    accessToken.value = newToken
  }

  function setRefreshToken(newToken: string) {
    refreshToken.value = newToken
  }

  function setLoading(newLoading: boolean) {
    loading.value = newLoading
  }

  async function logoutUser() {
    accessToken.value = undefined
    refreshToken.value = undefined
    user.value = undefined
  }

  return {
    user,
    accessToken,
    refreshToken,
    isLoggedIn,
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
