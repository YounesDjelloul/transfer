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

    const isLoggedIn = userSession.cookies.get('isLoggedIn')

    if (to.meta.requiresAuth && isLoggedIn !== true) {
      // If the page requires auth, check if user is logged in
      // if not, redirect to login page.
      return {
        name: APP_URLs.LOGIN,
        // save the location we were at to come back later
        query: { redirect: to.fullPath },
      }
    }

    if (isLoggedIn === true) {
      
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
        // request another access token if it fails
        await newAccessToken(userSession)
      }
    }

  })
})
