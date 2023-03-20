<script setup lang="ts">
  
  import { useForm } from 'vee-validate'
  import { useNotyf } from '/@src/composable/useNotyf'
  import { useI18n } from 'vue-i18n'

  import { convertFilterSchemaToObject } from '/@src/utils/app/CRUD/filters'
  import { formatError } from '/@src/utils/app/CRUD/helpers'

  const { t }  = useI18n()
  const notyf  = useNotyf()

  const emits = defineEmits<{
    (e: 'hidePopup'): void
    (e: 'filterList'): void
  }>()

  const props = defineProps<{
    modalTitle: string,
    formSchema: object,
  }>()

  const initialValues   = convertFilterSchemaToObject(props.formSchema)

  const { handleSubmit } = useForm({
    initialValues
  })

  const onFilter = handleSubmit(async (values, actions) => {
    try {
      emits('filterList', values)
      emits('hidePopup')
    } catch (err) {
      const formattedErrors = formatError(undefined, err.response.data)
      actions.setErrors(formattedErrors)

      notyf.error("Form Invalid")
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
            <VSelect v-if="schemaField.as === 'select'">
              <VOption value="">Select a Type</VOption>
              <VOption v-for="(option, index) in schemaField.options" :value="index">{{ option }}</VOption>
            </VSelect>
            <VInput
              v-else
              :type="schemaField.type"
              :placeholder="t(`auth.placeholder.${schemaField.placeholder}`)"
              :autocomplete="schemaField.name"
            />
          </VControl>
        </VField>
      </form>
    </template>
    <template #action>
      <VButton type="submit" @click="onFilter" color="primary" raised>Filter</VButton>
    </template>
  </VModal>
</template>