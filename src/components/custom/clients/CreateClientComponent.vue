<script setup lang="ts">
  
  const emits = defineEmits<{
    (e: 'hideCreateClientPopup'): void
    (e: 'loadClients'): void
  }>()

  import { useForm } from 'vee-validate'
  import { toFormValidator } from '@vee-validate/zod'
  import { z as zod } from 'zod'
  import { useI18n } from 'vue-i18n'
  import { useNotyf } from '/@src/composable/useNotyf'

  import { createNewClient } from '/@src/utils/api/clients'

  const notyf  = useNotyf()
  const { t }  = useI18n()

  const ClientCreationLoading = ref(false)

  const validationSchema = toFormValidator(
    zod.object({
      person_type: zod
        .string({
          required_error: t('auth.errors.username.required'),
        }),
      user: zod.object({
        username: zod
          .string({
            required_error: t('auth.errors.username.required'),
          })
          .min(8, t('auth.errors.username.length')),
        email: zod
          .string({
            required_error: t('auth.errors.email.required'),
          })
          .min(8, t('auth.errors.email.format')),
        ip: zod
          .string({
            required_error: t('auth.errors.ip.required'),
          })
      })      
    })
  )

  const { handleSubmit } = useForm({
   validationSchema,
    initialValues: {
      person_type: '',
      user: {
        username: '',
        email: '',
        ip: ''
      }
    },
  })

  const createClient = handleSubmit(async (values) => {

    ClientCreationLoading.value = true

    try {

      const data = await createNewClient(values)

      notyf.dismissAll()
      notyf.success("Client Created Successfully!")

      emits('hideCreateClientPopup')
      emits('loadClients') // To update our list of clients
    } catch (err) {
      notyf.error(err)
    } finally {
      ClientCreationLoading.value = false
    }
  })

</script>

<template>
  <VModal
    :open="true"
    title="Create New Client"
    size="meduim"
    actions="right"
    noscroll
    @close="$emit('hideCreateClientPopup')"
  >
    <template #content>
      <VPlaceload v-if="ClientCreationLoading" />
      <form class="modal-form" v-else>
        <VField id="user.username" v-slot="{ field }">
          <VControl icon="feather:user">
            <VInput
              type="text"
              :placeholder="t('auth.placeholder.username')"
              autocomplete="name"
            />
            <p v-if="field?.errors?.value?.length" class="help is-danger">
              {{ field.errors?.value?.join(', ') }}
            </p>
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
        <VField id="user.email" v-slot="{ field }">
          <VControl icon="feather:mail">
            <VInput
              type="email"
              :placeholder="t('auth.placeholder.email')"
              autocomplete="email"
            />
            <p v-if="field?.errors?.value?.length" class="help is-danger">
              {{ field.errors?.value?.join(', ') }}
            </p>
          </VControl>
        </VField>
        <VField id="user.ip" v-slot="{ field }">
          <VControl icon="feather:user">
            <VInput
              type="text"
              :placeholder="t('auth.placeholder.ip')"
              autocomplete="name"
            />
            <p v-if="field?.errors?.value?.length" class="help is-danger">
              {{ field.errors?.value?.join(', ') }}
            </p>
          </VControl>
        </VField>
      </form>
    </template>
    <template #action>
      <VButton type="submit" @click="createClient" color="primary" raised>Create</VButton>
    </template>
  </VModal>
</template>