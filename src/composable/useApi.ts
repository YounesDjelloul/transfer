import axios, { type RawAxiosRequestHeaders, type AxiosInstance } from 'axios'

import { useUserSession } from '/@src/stores/userSession'

let api: AxiosInstance

export function createApi() {
  // Here we set the base URL for all requests made to the api
  api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  })

  // We set an interceptor for each request to
  // include Bearer token to the request if user is logged in
  api.interceptors.request.use((config) => {
    const userSession = useUserSession()
    const accessToken = userSession.cookies.get('access_token')

    console.log(accessToken, userSession.cookies.get('isLoggedIn'))

    if (userSession.cookies.get('isLoggedIn') !== 'undefined') {
      config.headers = {
        ...((config.headers as RawAxiosRequestHeaders) ?? {}),
        Authorization: `Bearer ${accessToken}`,
      }
    }

    return config
  })

  return api
}

export function useApi() {
  if (!api) {
    createApi()
  }
  return api
}

/*

import { useNotyf } from '/@src/composable/useNotyf'

const notyf = useNotyf()

export function createApi() {
  api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })

  api.interceptors.response.use(
    (response) => {
      return response
    },
    (err) => {
      if (err.message == 'Network Error')
        notyf.error({
          message: 'Connection error! Please try again later',
          duration: 5000,
        })
      return Promise.reject(err)
    }
  )

  return api
}

export function useApi() {
  if (!api) {
    createApi()
  }
  return api
}
*/