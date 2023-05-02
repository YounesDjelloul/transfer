<script setup lang="ts">

  import { computed, ref, watch, watchEffect } from 'vue'
  import VueMultiselect from 'vue-multiselect'
  import { useForm, ErrorMessage } from 'vee-validate'
  import { toFormValidator } from '@vee-validate/zod'
  import { useI18n } from 'vue-i18n'
  import { useNotyf } from '/@src/composable/useNotyf'
  import {
    formatError,
    generateInitialValues,
    generateValidationSchema,
    objectToFormData,
    generateAndAssignDataObjectToStore,
  } from '/@src/utils/app/shared/helpers'

  import { useHandleInstance } from '/@src/stores/handleInstance'
  import { useFieldSelect } from '/@src/stores/fieldTypeSelect'

  const { t }  = useI18n()
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

  const { handleSubmit, setFieldValue } = useForm({
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
      <VPlaceload v-if="isLoading" />
      <form class="modal-form" enctype='multipart/form-data'>
        <VField v-for="schemaField in formSchema" :id="schemaField.id" v-slot="{ field }">
          <VControl class="has-icons-left" icon="feather:user">
            <div class="custom-dropdown" :class="{ 'is-open': fieldSelect.fieldsTypeData[schemaField.id].isOpen }" v-if="schemaField.type === 'field'">
              <div class="dropdown-header" @click="fieldSelect.toggleSelect(schemaField)">
                <VInput
                  :type="schemaField.html_input_type"
                  :placeholder="schemaField.label"
                  v-model="fieldSelect.fieldsTypeData[schemaField.id].selectedItem"
                  @input="fieldSelect.filteredItems($event, schemaField)"
                  @blur="fieldSelect.fieldsTypeData[schemaField.id].isOpen = false"
                />
              </div>
              <ul class="dropdown-list" >
                <div v-if="fieldSelect.fieldOptionsLoading" class="dropdown-loader">
                  <VPlaceload/>
                </div>
                <!--div v-else-if="filteredItems.length === 0">No Records Match</div-->
                <div v-else>
                  <li
                    v-for="item in fieldSelect.fieldsTypeData[schemaField.id].options"
                    :key="item.value"
                    @mousedown="fieldSelect.selectItem(item, schemaField, setFieldValue)"
                  >
                    {{ item.display_name }}
                  </li>
                </div>
              </ul>
            </div>
            <VSelect v-else-if="schemaField.html_input_type === 'select'">
              <VOption disabled hidden value="">Select an option</VOption>
              <VOption v-for="choice in schemaField.choices" :value="choice.value">{{ choice.display_name }}</VOption>
            </VSelect>
            <div class="file has-name" v-else-if="schemaField.html_input_type == 'file'">
              <label class="file-label">
                <input class="file-input" type="file" :id="schemaField.id" name="resume" @change="handleUpload($event, schemaField)" />
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