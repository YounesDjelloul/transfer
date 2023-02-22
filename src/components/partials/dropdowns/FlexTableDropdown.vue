<script setup lang="ts">
const emits = defineEmits<{
  (e: 'viewDetail'): void
  (e: 'updateClient'): void
  (e: 'deleteClient'): void
}>()
</script>

<template>
  <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
    <template #content="{ close }">
      <a
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('viewDetail')
            close()
          }
        "
      >
        <div class="icon">
          <i aria-hidden="true" class="feather:eye"></i>
        </div>
        <div class="meta">
          <span>View</span>
          <span>View client details</span>
        </div>
      </a>

      <a
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('updateDetail')
            close()
          }
        "
      >
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-briefcase"></i>
        </div>
        <div class="meta">
          <span>Update</span>
          <span>Update client details</span>
        </div>
      </a>

      <hr class="dropdown-divider" />

      <a
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.prevent="
          () => {
            emits('deleteClient')
            close()
          }
        "
      >
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-trash-can-alt"></i>
        </div>
        <div class="meta">
          <span>Delete</span>
          <span>Delete client record</span>
        </div>
      </a>
    </template>
  </VDropdown>
</template>