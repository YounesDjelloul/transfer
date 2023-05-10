<script setup lang="ts">

  import { useForm, ErrorMessage } from 'vee-validate'
  import { toFormValidator } from '@vee-validate/zod'
  import { useNotyf } from '/@src/composable/useNotyf'
  import {
    formatError,
    generateInitialValues,
    generateValidationSchema,
    objectToFormData,
    generateAndAssignDataObjectToStore,
    setPksForFieldTypeInputs
  } from '/@src/utils/app/shared/helpers'

  import { useHandleInstance } from '/@src/stores/handleInstance'
  import { useFieldSelect } from '/@src/stores/fieldTypeSelect'

  const notyf  = useNotyf()

  const emits = defineEmits<{
    (e: 'handleCreateInstanceAffect', data): void
  }>()

  const props = defineProps<{
    requestFunction: void,
    modalTitle: string,
    formSchema: object,
  }>()

  const handleInstance = useHandleInstance()
  const fieldSelect    = useFieldSelect()

  const validationSchema = toFormValidator(generateValidationSchema(props.formSchema))
  const initialValues    = generateInitialValues(props.formSchema)
  
  await generateAndAssignDataObjectToStore(initialValues, props.formSchema)

  const { handleSubmit, setFieldValue, errors, values } = useForm({
    validationSchema,
    initialValues,
  })

  const isLoading   = ref(false)

  const onCreate = handleSubmit(async (values, actions) => {

    isLoading.value = true

    try {
      const valuesInFormData = objectToFormData(values)
      const toRequest        = props.requestFunction
      const response         = await toRequest(valuesInFormData)

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
      <VPlaceload v-if="isLoading" />
      <UpdateCreateForm
        v-else
        :form-schema="formSchema"
        :set-field-value="setFieldValue"
      />
    </template>
    <template #action>
      <VButton :loading="isLoading" type="submit" @click="onCreate" color="primary" raised>Create</VButton>
    </template>
  </VModal>
</template>

<style lang="scss">

  .file-label {

    width: 100%;

    .file-name {
      max-width: none;
      width: 60%;
    }

    .file-cta {
      width: 40%;
    }
  }

  .custom-dropdown {
    position: relative;
    display: block;
    width: 100%;
    font-size: 1rem;

    .dropdown-list {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 5;
      display: none;
      list-style: none;
      background: var(--dark-sidebar-light-8);
      width: 100%;
      overflow-y: scroll;
      max-height: 120px;
      border-radius: 0px 0px 6px 6px;

      .dropdown-loader {
        padding: 20px 10px 10px 39px;
      }

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 4px;
      }

      li {
        padding: 10px 10px 10px 39px;
        cursor: pointer;
        color: var(--primary--color-invert);

        &:hover {
          background-color: var(--primary);
        }
      }
    }

    &.is-open {
      .dropdown-list {
        display: block;
      }
    }
  }

  .switch-block {
    padding: 5px 40px;
  }


  .field-type-container {
    display: flex;
    
    .field-type-search {
      margin-right: 5px;
    }
  }

  .v-avatar {

    position: relative;
    display: block;
    margin: 0 auto;
    margin-bottom: 35px;

    .edit-button {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
</style>