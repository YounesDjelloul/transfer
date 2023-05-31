<script setup>
  import { useUserSession } from '/@src/stores/userSession'
  import { useNotyf } from '/@src/composable/useNotyf'
  import { useI18n } from 'vue-i18n'
  
  import APP_URLs from '/@src/utils/app/urls'
  
  const { t } = useI18n()
  const router = useRouter()
  const notyf = useNotyf()
  const userSession = useUserSession()

  function logout() {
    userSession.logoutUser()
    notyf.success(t('auth.logout.success'))
    router.push(APP_URLs.LOGIN)
  }
</script>

<template>
  <VDropdown right spaced class="user-dropdown profile-dropdown">
    <template #button="{ toggle }">
      <a
        tabindex="0"
        class="is-trigger dropdown-trigger"
        aria-haspopup="true"
        @keydown.space.prevent="toggle"
        @click="toggle"
      >
        <VAvatar picture="/images/avatars/svg/vuero-1.svg" />
      </a>
    </template>

    <template #content>
      <div class="dropdown-head">
        <VAvatar size="large" picture="/images/avatars/svg/vuero-1.svg" />

        <div class="meta">
          <span>Erik Kovalsky</span>
          <span>Product Manager</span>
        </div>
      </div>

      <RouterLink :to="APP_URLs.VIEW_PROFILE" role="menuitem" class="dropdown-item is-media">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-user-alt"></i>
        </div>
        <div class="meta">
          <span>Profile</span>
          <span>View your profile</span>
        </div>
      </RouterLink>

      <hr class="dropdown-divider" />

      <a href="#" role="menuitem" class="dropdown-item is-media">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-briefcase"></i>
        </div>
        <div class="meta">
          <span>Projects</span>
          <span>All my projects</span>
        </div>
      </a>

      <a href="#" role="menuitem" class="dropdown-item is-media">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-users-alt"></i>
        </div>
        <div class="meta">
          <span>Team</span>
          <span>Manage your team</span>
        </div>
      </a>

      <hr class="dropdown-divider" />

      <RouterLink :to="APP_URLs.UPDATE_PROFILE" role="menuitem" class="dropdown-item is-media">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-cog"></i>
        </div>
        <div class="meta">
          <span>Settings</span>
          <span>Account settings</span>
        </div>
      </RouterLink>

      <hr class="dropdown-divider" />

      <div class="dropdown-item is-button">
        <VButton
          class="logout-button"
          icon="feather:log-out"
          color="primary"
          role="menuitem"
          raised
          fullwidth
          @click="logout"
        >
          Logout
        </VButton>
      </div>
    </template>
  </VDropdown>
</template>
