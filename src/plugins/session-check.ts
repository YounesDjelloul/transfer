import { definePlugin } from '/@src/app'
import { useUserSession } from '/@src/stores/userSession'

import APP_URLs from '/@src/utils/app/urls'
import API_URLs from '/@src/utils/api/urls'

import { newAccessToken, getUserProfile } from '/@src/utils/api/auth'

/**
 * Here we are setting up two router navigation guards
 * (note that we can have multiple guards in multiple plugins)
 *
 * We can add meta to pages either by declaring them manualy in the
 * routes declaration (see /@src/router.ts)
 * or by adding a <route> tag into .vue files (see /@src/pages/sidebar/dashboards.ts)
 *
 * <route lang="yaml">
 * meta:
 *   requiresAuth: true
 * </route>
 *
 * <script setup lang="ts">
 *  // TS script
 * </script>
 *
 * <template>
 *  // HTML content
 * </template>
 */
export default definePlugin(async ({ router, api, pinia }) => {
  const userSession = useUserSession(pinia)

  router.beforeEach(async (to) => {

    const cookies       = userSession.cookies
    const authenticated = cookies.get('isLoggedIn') && cookies.get('access_token') !== "" && cookies.get('access_token') ? true : false

    if (to.meta.requiresAuth && authenticated !== true) {
      // If the page requires auth, check if user is logged in
      // if not, redirect to login page.
      return {
        name: APP_URLs.LOGIN,
        // save the location we were at to come back later
        query: { redirect: to.fullPath },
      }
    }

    if (authenticated) {
      
      // If the page needs to be seen just by guests, check if use is logged in
      // if yes, redirect to home page
      if (to.meta.guest) {
        return {
          name: APP_URLs.HOME,
        }
      }

      // Check token validity at each page
      try {
        // Do api request call to retreive user profile.
        await getUserProfile(userSession)
      } catch (error) {

        const refreshTokenCheck = cookies.get('refresh_token') !== '' && cookies.get('refresh_token') ? true : false

        if (error.response.status === 401 && refreshTokenCheck) {
          
          try {
            await newAccessToken(userSession)
          } catch (err) {
            if (err.status === 400) {
              userSession.logoutUser()
              return {
                name: APP_URLs.LOGIN,
                query: { redirect: to.fullPath },
              }
            }
          }
        
        } else if (error.response.status === 401 && !refreshTokenCheck) {
          userSession.logoutUser()
          return {
            name: APP_URLs.LOGIN,
            query: { redirect: to.fullPath },
          }
        }
      }
    }

  })
})
