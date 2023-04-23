<script setup lang="ts">

  import { computed, ref, watch, watchEffect } from 'vue'
  import 'vue-search-select/dist/VueSearchSelect.css'
  import { ModelListSelect } from 'vue-search-select'
  import { useForm, ErrorMessage } from 'vee-validate'
  import { toFormValidator } from '@vee-validate/zod'
  import { useI18n } from 'vue-i18n'
  import { useNotyf } from '/@src/composable/useNotyf'
  import { formatError, formatFieldChoices, generateValidationSchema, objectToFormData } from '/@src/utils/app/CRUD/helpers'
  import { getFieldChoices } from '/@src/utils/api/clients'
  import { arrayPop } from '/@src/utils/app/profile/helpers'

  import { useHandleInstance } from '/@src/stores/handleInstance'

  const { t }  = useI18n()
  const notyf  = useNotyf()

  const emits = defineEmits<{
    (e: 'handleCreateInstanceAffect', data): void
  }>()

  const props = defineProps<{
    initialValues: object,
    requestFunction: void,
    modalTitle: string,
    formSchema: object,
    hasPicture: boolean,
  }>()

  const handleInstance   = useHandleInstance()

  const formSchema       = props.formSchema
  const validationSchema = toFormValidator(generateValidationSchema(formSchema, t))
  const initialValues    = props.initialValues

  const { handleSubmit, setFieldValue } = useForm({
    validationSchema,
    initialValues,
  })

  const isUploading = ref(false)
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

  const choicesObject  = ref({})

  async function getFieldChoicesFunction(event, endpointUrl) {
    const currentValue = event.target.value
    const currentId    = event.target.id

    if (!currentValue) {
      choicesObject.value[currentId] = []
      return;
    }

    const response = await getFieldChoices("/users_/job_titles/", currentValue)
    choicesObject.value[currentId] = formatFieldChoices(response)
  }

  const selectedFileName = ref("Select a Picture..")

  function handleUpload(event, schemaField) {
    const file = event.target.files[0]
    selectedFileName.value = file ? file.name : "Select a Picture.."

    setFieldValue(schemaField.id, file)
  }

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
      <form class="modal-form" enctype='multipart/form-data'>
        <VField v-for="schemaField in formSchema" :id="schemaField.id" v-slot="{ field }">
          <VControl class="has-icons-left" icon="feather:user">
            <div v-if="schemaField.type === 'field'" class="field-type-container">
              <VInput
                type="text"
                class="field-type-search"
                :placeholder="schemaField.label+' Search'"
                @input="getFieldChoicesFunction($event, schemaField.endpoint_url)"
              />
              <VSelect :multiple="schemaField.relationship">
                <VOption disabled hidden value>Select an option</VOption>
                <VOption v-for="choice in choicesObject[schemaField.id]" :value="choice.value">{{ choice.display_name }}</VOption>
              </VSelect>
            </div>
            <VSelect v-else-if="schemaField.html_input_type === 'select'">
              <VOption disabled hidden value="">Select an option</VOption>
              <VOption v-for="choice in schemaField.choices" :value="choice.value">{{ choice.display_name }}</VOption>
            </VSelect>
            <div class="file has-name" v-else-if="schemaField.html_input_type == 'file'">
              <label class="file-label">
                <input class="file-input" type="file" name="resume" @change="handleUpload($event, schemaField)" />
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-cloud-upload-alt"></i>
                  </span>
                  <span class="file-label"> Choose a file… </span>
                </span>
                <span class="file-name light-text"> {{ selectedFileName }} </span>
              </label>
            </div>
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

<style lang="scss">
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