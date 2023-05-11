<script setup lang="ts">
  const emit = defineEmits(['close'])
  import APP_URLs from '/@src/utils/app/urls'
</script>

<template>
  <div class="sidebar-panel is-generic">
    <div class="subpanel-header">
      <h3 class="no-mb">Sides</h3>
      <div
        class="panel-close"
        tabindex="0"
        @keydown.space.prevent="emit('close')"
        @click="emit('close')"
      >
        <i aria-hidden="true" class="iconify" data-icon="feather:x"></i>
      </div>
    </div>
    <div class="inner" data-simplebar>
      <ul>
        <li>
          <RouterLink :to="APP_URLs.DASHBOARD">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Home
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="APP_URLs.CLIENTS">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Clients
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="APP_URLs.EMPLOYEES">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Employees
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="APP_URLs.MATTERS">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Matters
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="APP_URLs.COMPANIES">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Companies
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="APP_URLs.CONTACTS">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Contacts
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/layout/sidebar-panel';
</style>
