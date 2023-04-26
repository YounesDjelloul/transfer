<script setup lang="ts">

  import { ref, onMounted } from 'vue'
  import { useForm } from 'vee-validate'
  import { toFormValidator } from '@vee-validate/zod'
  import { useI18n } from 'vue-i18n'
  import { useNotyf } from '/@src/composable/useNotyf'
  import { getFieldChoices } from '/@src/utils/api/clients'

  import { generateInitialValues, formatFieldChoices, objectToFormData, formatError, generateValidationSchema, cleanValuesIfPatch } from '/@src/utils/app/shared/helpers'

  import { useHandleInstance } from '/@src/stores/handleInstance'

  const handleInstance = useHandleInstance()
  const notyf          = useNotyf()
  const { t }          = useI18n()

  const emits = defineEmits<{
    (e: 'handleUpdateInstanceAffect', data): void
  }>()

  const props = defineProps<{
    requestFunction: void,
    formSchema: object,
    instanceDetailsFunction: void,
    modalTitle: string,
    updateAllowedMethod: string,
  }>()

  const instanceDetails  = await props.instanceDetailsFunction(handleInstance.instanceToUpdatePk)
  const validationSchema = toFormValidator(generateValidationSchema(props.formSchema))
  const initialValues    = generateInitialValues(props.formSchema, instanceDetails)

  const { handleSubmit } = useForm({
    validationSchema,
    initialValues,
  })

  const isLoading  = ref(false)

  const onUpdate = handleSubmit(async (values, actions) => {
    isLoading.value = true

    try {

      const formattedValues = cleanValuesIfPatch(values, props.updateAllowedMethod, initialValues)
      const valuesInFormData = objectToFormData(formattedValues)
      const toUpdate = props.requestFunction
      const { data } = await toUpdate(handleInstance.instanceToUpdatePk, formattedValues, props.updateAllowedMethod)

      emits('handleUpdateInstanceAffect', data)
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

    const response = await getFieldChoices(endpointUrl, currentValue)
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
    size="large"
    actions="right"
    noscroll
    @close="handleInstance.showUpdateInstancePopup=false"
  >
    <template #content>
      <VPlaceload v-if="isLoading" />
      <form class="form-layout is-stacked" v-else>
        <div class="form-outer">
          <div class="form-body">
            <div class="form-section is-grey">
              <div class="form-section-header">
                <div class="left"><h3>General</h3></div>
              </div>
              <div class="form-section-inner is-horizontal">
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
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #action v-if="!isLoading">
      <VButton :loading="isLoading" type="submit" @click="onUpdate" color="primary" raised>Update</VButton>
    </template>
  </VModal>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

.is-navbar {
  .form-layout {
    margin-top: 30px;
  }
}

.form-layout {
  max-width: 740px;
  margin: 0 auto;

  &.is-stacked {
    .form-outer {
      .form-body {
        padding: 0;

        .form-section {
          padding: 40px;
          border-bottom: 1px solid var(--fade-grey-dark-4);

          &.is-grey {
            background: #fafafa;
          }

          .form-section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--fade-grey-dark-4);
            padding-bottom: 20px;
            margin-bottom: 30px;

            .left {
              h3 {
                font-family: var(--font-alt);
                font-weight: 600;
                color: var(--dark-text);
              }
            }
          }

          .form-section-inner {
            &.is-horizontal {
              max-width: 540px;
            }

            .field {
              &.is-horizontal {
                .field-label {
                  padding-top: 0.75em;
                }
              }
            }
          }

          .columns {
            .column {
              padding-top: 0.5rem;
              padding-bottom: 0.5rem;
            }
          }

          .field {
            .control {
              .checkbox {
                padding: 0;
                padding-right: 10px;
                font-size: 0.9rem;
              }
            }
          }

          .participants {
            display: flex;
            padding-bottom: 10px;

            .v-avatar {
              margin-right: 8px;
            }

            .add-participant {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 40px;
              width: 40px;
              min-width: 40px;
              border-radius: var(--radius-rounded);
              border: 1.6px dashed var(--light-text);
              color: var(--light-text);
              padding: 0;
              background: none;
              margin-left: 4px;
              cursor: pointer;
              transition: color 0.3s, background-color 0.3s, border-color 0.3s,
                height 0.3s, width 0.3s;

              &:hover,
              &:focus {
                border: 1.6px solid var(--primary);
                color: var(--primary);
              }

              &:focus-visible {
                outline-offset: var(--accessibility-focus-outline-offset);
                outline-width: var(--accessibility-focus-outline-width);
                outline-style: var(--accessibility-focus-outline-style);
                outline-color: var(--accessibility-focus-outline-color);
              }

              svg {
                height: 16px;
                width: 16px;
              }
            }
          }

          .color-codes {
            display: flex;
            align-items: center;
            height: 38px;

            .color-code {
              height: 14px;
              width: 14px;
              border-radius: var(--radius-rounded);
              background: var(--white);
              margin-right: 10px;
              border: 3px solid var(--light-text);
              cursor: pointer;
              opacity: 0.6;
              transition: color 0.3s, background-color 0.3s, border-color 0.3s,
                height 0.3s, width 0.3s;

              &:hover,
              &:focus {
                opacity: 1;
              }

              &:focus-visible {
                outline-offset: var(--accessibility-focus-outline-offset);
                outline-width: var(--accessibility-focus-outline-width);
                outline-style: var(--accessibility-focus-outline-style);
                outline-color: var(--accessibility-focus-outline-color);
              }

              &.is-primary {
                border-color: var(--primary);

                &.is-active {
                  background: var(--primary);
                }
              }

              &.is-secondary {
                border-color: var(--secondary);

                &.is-active {
                  background: var(--secondary);
                }
              }

              &.is-info {
                border-color: var(--info);

                &.is-active {
                  background: var(--info);
                }
              }

              &.is-success {
                border-color: var(--success);

                &.is-active {
                  background: var(--success);
                }
              }

              &.is-purple {
                border-color: var(--purple);

                &.is-active {
                  background: var(--purple);
                }
              }
            }
          }

          .add-link {
            display: inline-block;
            padding: 4px 0;
            font-family: var(--font);
            font-weight: 500;
            font-size: 0.9rem;
            color: var(--primary);
          }
        }
      }
    }
  }
}

.is-dark {
  .form-layout {
    &.is-stacked {
      .form-outer {
        .form-body {
          .form-section {
            border-color: var(--dark-sidebar-light-12);

            &.is-grey {
              background: var(--dark-sidebar-light-4);
            }

            .form-section-header {
              border-color: var(--dark-sidebar-light-12);

              .left {
                h3 {
                  color: var(--dark-dark-text);
                }
              }
            }

            .form-section-inner {
              .add-link {
                color: var(--primary);
              }

              .color-codes {
                .color-code {
                  background: var(--dark-sidebar-light-6);

                  &.is-primary {
                    border-color: var(--primary);
                  }
                }
              }

              .participants {
                .add-participant {
                  &:hover {
                    border: 1.6px solid var(--primary);
                    color: var(--primary);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .form-layout {
    &.is-stacked {
      .form-outer {
        .form-body {
          .is-vhidden {
            display: none !important;
          }
        }
      }

      .v-calendar-combo {
        margin: 0 !important;

        .column {
          padding-top: 0 !important;
          padding-bottom: 0 !important;

          &:first-child {
            padding-left: 0 !important;
          }

          &:last-child {
            padding-right: 0 !important;
          }
        }
      }
    }
  }
}
</style>
