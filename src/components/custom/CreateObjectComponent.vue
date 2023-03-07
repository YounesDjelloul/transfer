<script setup lang="ts">
  
  import { useForm } from 'vee-validate'
  import { toFormValidator } from '@vee-validate/zod'

  const emits = defineEmits<{
    (e: 'handleCreateInstanceAffect'): void
    (e: 'hidePopup'): void
  }>()

  const props = defineProps<{
    validationSchema: object,
    initialValues: object,
    requestFunction: void,
    modalTitle: string,
  }>()

  const validationSchema = toFormValidator(props.validationSchema)
  const initialValues    = props.initialValues

  const { handleSubmit } = useForm({
    validationSchema,
    initialValues,
  })

  const isLoading = ref(false)

  const onCreate = handleSubmit(async (values) => {

    isLoading.value = true

    try {

      const toRequest = props.requestFunction
      await toRequest(values)

      emits('handleCreateInstanceAffect')
    } catch (err) {
      notyf.error(err)

    } finally {
      isLoading.value = false
    }
  })

</script>

<template>
  <VModal
    :open="true"
    :title="modalTitle"
    size="meduim"
    actions="right"
    noscroll
    @close="$emit('hidePopup')"
  >
    <template #content>
      <VPlaceload v-if="isLoading" />
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
      <VButton type="submit" @click="onCreate" color="primary" raised>Create</VButton>
    </template>
  </VModal>
</template>