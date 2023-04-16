<script setup lang="ts">

  import 'vue-search-select/dist/VueSearchSelect.css'
  import { ModelListSelect } from 'vue-search-select'
  import { useForm, ErrorMessage } from 'vee-validate'
  import { toFormValidator } from '@vee-validate/zod'
  import { useI18n } from 'vue-i18n'
  import { useNotyf } from '/@src/composable/useNotyf'
  import { formatError } from '/@src/utils/app/CRUD/helpers'

  import { useHandleInstance } from '/@src/stores/handleInstance'

  const handleInstance = useHandleInstance()

  const { t }  = useI18n()
  const notyf  = useNotyf()

  const emits = defineEmits<{
    (e: 'handleCreateInstanceAffect', data): void
  }>()

  const props = defineProps<{
    validationSchema: object,
    initialValues: object,
    requestFunction: void,
    modalTitle: string,
    formSchema: object,
  }>()

  const validationSchema = toFormValidator(props.validationSchema)
  const initialValues    = props.initialValues

  const { handleSubmit } = useForm({
    validationSchema,
    initialValues,
  })

  const isLoading = ref(false)

  const onCreate = handleSubmit(async (values, actions) => {

    isLoading.value = true

    try {

      console.log(values)

      const toRequest = props.requestFunction
      //const response  = await toRequest(values)

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
    @close="handleInstance.showCreateInstancePopup=false"
  >
    <template #content>
      <form class="modal-form">
        <VField v-for="schemaField in formSchema" :id="schemaField.id" v-slot="{ field }">
          <VControl class="has-icons-left" icon="feather:user">
            <VInput v-if="schemaField.type === 'field'" />
            <VSelect v-if="schemaField.html_input_type === 'select'">
              <VOption disabled hidden value="">Select an option</VOption>
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
            <p class="help is-primary" v-else-if="schemaField.required">Required Field</p>
          </VControl>
        </VField>
      </form>
    </template>
    <template #action>
      <VButton :loading="isLoading" type="submit" @click="onCreate" color="primary" raised>Create</VButton>
    </template>
  </VModal>
</template>