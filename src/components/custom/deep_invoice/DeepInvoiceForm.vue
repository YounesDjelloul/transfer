<script setup lang="ts">

  import API_URLs from '/@src/utils/api/urls'

  import { provide } from 'vue'
  import { useHead } from '@vueuse/head'
  import { useViewWrapper } from '/@src/stores/viewWrapper'
  import { useForm } from 'vee-validate'
  import { toFormValidator } from '@vee-validate/zod'

  import { useI18n } from 'vue-i18n'
  import { useNotyf } from '/@src/composable/useNotyf'
  import { useModelSchemas } from '/@src/utils/app/CRUD/modelCache'
  import { useHandleInstance } from '/@src/stores/handleInstance'
  import { useFieldSelect } from '/@src/stores/fieldTypeSelect'
  import { createNewInstance } from '/@src/utils/api/modelApiCallFunctions'

  import {
    formatError,
    objectToFormData,
    checkIfFileFieldExist,
  } from '/@src/utils/app/shared/helpers'

  const props = defineProps<{
    componentDependencies: object,
  }>()

  const endpointUrl = inject('endpointUrl')

  const { handleSubmit, setFieldValue } = useForm({
    validationSchema: props.validationSchema,
    initialValues: props.initialValues,
  })

  const handleInstance = useHandleInstance()
  const fieldSelect    = useFieldSelect()
  const fieldsData     = fieldSelect.fieldsTypeData

  const notyf = useNotyf()
  const { y } = useWindowScroll()
  const { t } = useI18n()

  const isStuck = computed(() => {
    return y.value > 30
  })

  const currentPopupSchema = ref()
  const currentFieldId      = ref()
  const currentEndpointUrl  = ref()
  const instancePk          = ref('')
  const updateAllowedMethod = ref('')

  const onShowCreatePopup = (field) => {
    fieldSelect.toggleCreatePopup()
    currentPopupSchema.value   = fieldsData[field.id].createSchema
    currentFieldId.value        = field.id
    currentEndpointUrl.value    = field.endpoint_url
  }

  const onShowUpdatePopup = (field, instanceId) => {
    fieldSelect.toggleUpdatePopup()
    currentPopupSchema.value  = fieldsData[field.id].updateSchema
    updateAllowedMethod.value = fieldsData[field.id].updateAllowedMethod
    currentFieldId.value      = field.id
    currentEndpointUrl.value  = field.endpoint_url
    instancePk.value          = instanceId
  }

  const onCreate = handleSubmit(async (values, actions) => {

    isLoading.value = true

    try {

      values = checkIfFileFieldExist(props.formSchema) ? objectToFormData(values) : values
      const response  = await createNewInstance(endpointUrl.value, values)
      notyf.success('form created successfully..')

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
  <form class="form-layout column" @submit.prevent="onSubmit">

    <CreateInvoicesFieldComponent
      v-if="fieldSelect.showCreatePopup"
      :formSchema="currentPopupSchema"
      :field-id="currentFieldId"
      :endpointUrl="currentEndpointUrl"
    />

    <UpdateInvoicesFieldComponent
      v-if="fieldSelect.showUpdatePopup"
      :formSchema="currentPopupSchema"
      :field-id="currentFieldId"
      :endpointUrl="currentEndpointUrl"
      :instance-pk="instancePk"
      :updateAllowedMethod="updateAllowedMethod"
    />

    <div class="form-outer">
      <div :class="[isStuck && 'is-stuck']" class="form-header stuck-header">
        <div class="form-header-inner">
          <div class="left">
            <h3>Request a Demo</h3>
          </div>
          <div class="right">
            <div class="buttons">
              <VButton
                icon="lnir lnir-arrow-left rem-100"
                to="/sidebar/layouts/profile-view"
                light
                dark-outlined
              >
                Cancel
              </VButton>
              <VButton type="submit" color="primary" raised> Schedule </VButton>
            </div>
          </div>
        </div>
      </div>
      <div class="form-body">
        <!--Fieldset-->
        <div class="form-fieldset">
          <div class="fieldset-heading">
            <h4>General information</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit</p>
          </div>

          <div class="columns is-multiline">
            <div class="column is-6" v-for="field in componentDependencies.normalFieldsSchema">
              <VField :id="field.id" v-slot="{ f }">
                <VLabel>{{ field.label }}</VLabel>
                <VControl icon="feather:user">
                  <VInput
                    :type="field.html_input_type"
                    :placeholder="field.placeholder"
                  />
                  <p v-if="f?.errors?.value?.length" class="help is-danger">
                    {{ f.errors?.value?.join(', ') }}
                  </p>
                  <p class="help is-primary" v-else-if="field.required">Required Field</p>
                </VControl>
              </VField>
            </div>
          </div>
        </div>

        <div class="form-fieldset" v-for="field in componentDependencies.tableFieldsSchema">
          <div class="fieldset-heading">
            <h4>
              {{ field.label }}
              <VTag
                class="update-create-button"
                color="primary"
                label="+ New"
                curved
                outlined
                @click="onShowCreatePopup(field)"
              />
            </h4>
            <p>More details</p>
          </div>

          <fieldTable
            class="field-table"
            :records="fieldsData[field.id].options"
            :field="field"
            @trigger-update="onShowUpdatePopup"
          />

          <div class="columns is-multiline">
            <div class="column is-12">
              <VField :id="field.id" v-slot="{ f }">
                <VLabel>{{ field.label }}</VLabel>
                <VControl icon="feather:briefcase">
                  <MultipleFieldSelectComponent
                    v-if="field.relationship === 'many_to_many'"
                    :schemaField="field"
                    :setFieldValue="setFieldValue"
                  />
                  <OneFieldSelectComponent
                    v-else
                    :schemaField="field"
                    :setFieldValue="setFieldValue"
                  />
                  <p v-if="f?.errors?.value?.length" class="help is-danger">
                    {{ f.errors?.value?.join(', ') }}
                  </p>
                  <p class="help is-primary" v-else-if="field.required">Required Field</p>
                </VControl>
              </VField>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<style lang="scss">
  @import '/@src/scss/abstracts/all';
  @import '/@src/scss/components/forms-outer';

  .update-create-button {
    cursor: pointer;
  }

  .field-table {
    margin-bottom: 2.5rem;
  }

  .form-layout {
    max-width: 940px;
    margin: 0 auto;
  }

  .form-fieldset {
    max-width: 680px;
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
</style>