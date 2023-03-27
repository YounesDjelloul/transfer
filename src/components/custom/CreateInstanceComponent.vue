<script setup lang="ts">

  import { useForm, ErrorMessage } from 'vee-validate'
  import { toFormValidator } from '@vee-validate/zod'
  import { useI18n } from 'vue-i18n'
  import { useNotyf } from '/@src/composable/useNotyf'
  import { formatError } from '/@src/utils/app/CRUD/helpers'

  const { t }  = useI18n()
  const notyf  = useNotyf()

  const emits = defineEmits<{
    (e: 'handleCreateInstanceAffect', data): void
    (e: 'hidePopup'): void
  }>()

  const props = defineProps<{
    validationSchema: object,
    requestFunction: void,
    modalTitle: string,
    formSchema: object,
  }>()

  const validationSchema = toFormValidator(props.validationSchema)

  const { handleSubmit } = useForm({
    validationSchema,
  })

  const isLoading = ref(false)

  const onCreate = handleSubmit(async (values, actions) => {

    isLoading.value = true

    try {

      const toRequest = props.requestFunction
      const response  = await toRequest(values)

      emits('handleCreateInstanceAffect', response.data)
    } catch (err) {

      const formattedErrors = formatError(undefined, err.response.data)
      actions.setErrors(formattedErrors)

      notyf.error(t('form.invalid'))

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
      <form class="modal-form">
        <VField v-for="schemaField in formSchema" :id="schemaField.id" v-slot="{ field }">
          <VControl class="has-icons-left" icon="feather:user">
            <VSelect v-if="schemaField.type === 'choice'">
              <VOption disabled hidden value="undefined">Select a Type</VOption>
              <VOption v-for="choice in schemaField.choices" :value="choice.value">{{ choice.display_name }}</VOption>
            </VSelect>
            <VInput
              v-else
              :type="schemaField.html_input_type"
              :placeholder="schemaField.label"
            />
            <p v-if="field?.errors?.value?.length" class="help is-danger">
              {{ field.errors?.value?.join(', ') }}
            </p>
          </VControl>
        </VField>
      </form>
    </template>
    <template #action>
      <VButton :loading="isLoading" type="submit" @click="onCreate" color="primary" raised>Create</VButton>
    </template>
  </VModal>
</template>