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
          <RouterLink :to="APP_URLs.MATTERS__PRACTICE_AREA">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Matters Practice Area
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="APP_URLs.JOB_TITLES">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Job Titles
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
        <li>
          <RouterLink :to="APP_URLs.CUSTOM_FIELDS">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Custom Fields
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="APP_URLs.ACTIVITIES__ACTIVITY_ITEMS">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Activity Items
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="APP_URLs.ACTIVITIES__EXPENSES">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Activities Expenses
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="APP_URLs.ACTIVITIES__FLAT_FEES">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Activities Flat Fees
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="APP_URLs.ACTIVITIES__TIME_ENTRIES">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Activities Time Entries
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="APP_URLs.BILLING__INVOICES">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Billing Invoices
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="APP_URLs.BILLING__PRICES">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Billing Prices
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="APP_URLs.BILLING__CURRENCY">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Billing Currency
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="APP_URLs.BILLING__SALE_TAXES">
            <i aria-hidden="true" class="lnil lnil-home pr-2"></i>
            Billing Sale Taxes
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/layout/sidebar-panel';
</style>
