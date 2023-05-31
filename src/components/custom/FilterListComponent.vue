<script setup lang="ts">
  
  import { useForm } from 'vee-validate'
  import { useNotyf } from '/@src/composable/useNotyf'
  import { useI18n } from 'vue-i18n'

  import { formatError } from '/@src/utils/app/shared/helpers'
  import { useHandleInstance } from '/@src/stores/handleInstance'
  import { convertObjectToFilterString } from '/@src/utils/app/CRUD/filters'


  const handleInstance = useHandleInstance()

  const notyf  = useNotyf()

  const emits = defineEmits<{
    (e: 'filterList'): void
  }>()

  const props = defineProps<{
    modalTitle: string,
    formSchema: object,
  }>()

  const { handleSubmit } = useForm()

  const onFilter = handleSubmit(async (values, actions) => {
    try {
      emits('filterList', convertObjectToFilterString(values))
      handleInstance.showFilterInstancesPopup=false
    } catch (err) {
      console.log(err)
      const formattedErrors = formatError(undefined, err.response.data)
      actions.setErrors(formattedErrors)

      notyf.error(t('form.invalid'))
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
    @close="handleInstance.showFilterInstancesPopup=false"
  >
    <template #content>
      <form class="modal-form">
        <VField v-for="schemaField in formSchema" :id="schemaField.id" v-slot="{ field }">
          <VControl class="has-icons-left" icon="feather:user">
            <VSelect v-if="schemaField.as === 'select'">
              <VOption value>Select a Type</VOption>
              <VOption v-for="(option, index) in schemaField.options" :value="index">{{ option }}</VOption>
            </VSelect>
            <VInput
              v-else
              :type="schemaField.type"
              :placeholder="schemaField.name"
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