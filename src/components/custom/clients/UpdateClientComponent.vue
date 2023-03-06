<script setup lang="ts">

  const emits = defineEmits<{
    (e: 'hideUpdateClientDetailsPopup'): void
    (e: 'loadClients'): void
  }>()

  const props = defineProps(['clientId'])

  import { useForm } from 'vee-validate'
  import { toFormValidator } from '@vee-validate/zod'
  import { z as zod } from 'zod'
  import { useI18n } from 'vue-i18n'
  import { useNotyf } from '/@src/composable/useNotyf'

  import { getClientDetails, updateClientDetailsRequest } from '/@src/utils/api/clients'

  const notyf       = useNotyf()
  const { t }       = useI18n()

  const clientDetailsUpdatingLoading = ref(true)

  const clientToUpdate = ref()

  async function getDetails() {

    clientToUpdate.value = await getClientDetails(props.clientId)
    clientDetailsUpdatingLoading.value = false
  }

  await getDetails()

  const validationSchema = toFormValidator(
    zod.object({
      legal_name: zod
        .string({
          required_error: t('auth.errors.username.required'),
        }),
      legal_form: zod
        .string({
          required_error: t('auth.errors.username.required'),
        }),
      person_type: zod
        .string({
          required_error: t('auth.errors.username.required'),
        }),
      website: zod
        .string({
          required_error: t('auth.errors.username.required'),
        }),
      licence: zod
        .string({
          required_error: t('auth.errors.username.required'),
        }),    
    })
  )

  const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
      legal_name: clientToUpdate.value.legal_name,
      legal_form: clientToUpdate.value.legal_form,
      person_type: clientToUpdate.value.person_type,
      website: clientToUpdate.value.website,
      licence: clientToUpdate.value.licence,
    },
  })

  const updateClientDetails = handleSubmit(async (values) => {
    clientDetailsUpdatingLoading.value = true

    try {
      const response = await updateClientDetailsRequest(props.clientId, values)
      notyf.dismissAll()
      notyf.success("Client Updated Successfully!")

    } catch (error) {
      notyf.error(error)

    } finally {
      emits('hideUpdateClientDetailsPopup')
      emits('loadClients')
      clientDetailsUpdatingLoading.value = false
    }
  })

</script>

<template>
  <VModal
    :open="true"
    title="Update Client Details"
    size="large"
    actions="right"
    noscroll
    @close="$emit('hideUpdateClientDetailsPopup')"
  >
    <template #content>
      <VPlaceload v-if="clientDetailsUpdatingLoading" />
      
      <form class="form-layout is-stacked" v-if="!clientDetailsUpdatingLoading">
        <div class="form-outer">
          <div class="form-body">
            <div class="form-section is-grey">
              <div class="form-section-header">
                <div class="left"><h3>General</h3></div>
              </div>

              <div class="form-section-inner is-horizontal">
                <VField id="legal_name" horizontal label="Legal Name">
                  <VControl class="has-icons-left" fullwidth icon="feather:globe">
                    <VInput
                      type="text"
                      placeholder="Legal Name"
                    />
                  </VControl>
                </VField>
                <VField id="legal_form" horizontal label="Legal Form">
                  <VControl class="has-icons-left" fullwidth icon="feather:globe">
                    <VInput
                      type="text"
                      placeholder="Legal Form"
                    />
                  </VControl>
                </VField>
                <VField id="person_type" horizontal label="Person Type">
                  <VControl class="has-icons-left" fullwidth icon="feather:globe">
                    <VSelect>
                      <VOption value="">Select a Type</VOption>
                      <VOption value="M">Moral Person</VOption>
                      <VOption value="P">Physical Person</VOption>
                    </VSelect>
                  </VControl>
                </VField>
                <VField id="website" horizontal label="Website">
                  <VControl class="has-icons-left" fullwidth icon="feather:globe">
                    <VInput
                      type="url"
                      placeholder="Website"
                    />
                  </VControl>
                </VField>
                <VField id="licence" horizontal label="Licence">
                  <VControl class="has-icons-left" fullwidth icon="feather:globe">
                    <VInput
                      type="text"
                      placeholder="Licence"
                    />
                  </VControl>
                </VField>
              </div>
            </div>
          </div>
        </div>
      </form>
    </template>
    <template #action>
      <VButton type="submit" @click="updateClientDetails" color="primary" raised>Update</VButton>
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
