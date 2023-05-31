<template>
  <div class="mobile-subsidebar">
    <div class="inner">
      <div class="sidebar-title">
        <h3>Sides</h3>
      </div>

      <ul class="submenu" data-simplebar>
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
      </ul>
    </div>
  </div>
</template>
