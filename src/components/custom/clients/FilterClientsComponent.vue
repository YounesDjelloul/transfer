<script setup lang="ts">
  
  const emits = defineEmits<{
    (e: 'hideFilterClientsPopup'): void
    (e: 'filterClients'): void
  }>()

  import { useForm } from 'vee-validate'
  import { useNotyf } from '/@src/composable/useNotyf'
  import { useI18n } from 'vue-i18n'

  const { t }  = useI18n()
  const notyf  = useNotyf()

  const { handleSubmit } = useForm({
    initialValues: {
      user__username: '',
      user__firstname: '',
      user__lastname: '',
      person_type: '',
    },
  })

  const triggerFilterClients = handleSubmit(async (values) => {
    try {
      emits('filterClients', values)
      emits('hideFilterClientsPopup')
    } catch (err) {
      notyf.error(err)
    }
  })

</script>

<template>
  <VModal
    :open="true"
    title="Filter Clients"
    size="meduim"
    actions="right"
    noscroll
    @close="$emit('hideFilterClientsPopup')"
  >
    <template #content>
      <form class="modal-form">
        <VField id="user__username" v-slot="{ field }">
          <VControl icon="feather:user">
            <VInput
              type="text"
              :placeholder="t('auth.placeholder.username')"
              autocomplete="name"
            />
          </VControl>
        </VField>
        <VField id="user__firstname" v-slot="{ field }">
          <VControl icon="feather:mail">
            <VInput
              type="text"
              :placeholder="t('auth.placeholder.firstname')"
              autocomplete="name"
            />
          </VControl>
        </VField>
        <VField id="user__lastname" v-slot="{ field }">
          <VControl icon="feather:user">
            <VInput
              type="text"
              :placeholder="t('auth.placeholder.lastname')"
              autocomplete="name"
            />
          </VControl>
        </VField>
        <VField id="person_type">
          <VControl class="has-icons-left" icon="feather:globe">
            <VSelect>
              <VOption value="">Select a Type</VOption>
              <VOption value="M">Moral Person</VOption>
              <VOption value="P">Physical Person</VOption>
            </VSelect>
          </VControl>
        </VField>
      </form>
    </template>
    <template #action>
      <VButton type="submit" @click="triggerFilterClients" color="primary" raised>Filter</VButton>
    </template>
  </VModal>
</template>