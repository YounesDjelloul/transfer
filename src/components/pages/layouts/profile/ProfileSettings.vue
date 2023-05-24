<script setup lang="ts">
  import { changeUserPassword } from '/@src/services/modules/auth/accounts'

  import { useForm } from 'vee-validate'
  import { toFormValidator } from '@vee-validate/zod'
  import { z as zod } from 'zod'
  import { useI18n } from 'vue-i18n'
  import { useNotyf } from '/@src/composable/useNotyf'

  const notyf = useNotyf()
  const { y } = useWindowScroll()
  const { t } = useI18n()

  const isLoading = ref(false)

  const isScrolling = computed(() => {
    return y.value > 30
  })

  const validationSchema = toFormValidator(
    zod.object({
      new_password1: zod
        .string({
          required_error: t('auth.errors.password.required'),
        })
        .min(8, t('auth.errors.password.length')),
      new_password2: zod
        .string({
          required_error: t('auth.errors.password.required'),
        })
        .min(8, t('auth.errors.password.length')),
    })
    .refine((data) => data.new_password1 === data.new_password2, {
      message: t('auth.errors.passwordCheck.match'),
      path: ['new_password2'],
    })
  )

  const { handleSubmit } = useForm({
    validationSchema,
  })

  const onChange = handleSubmit(async (values, actions) => {
    if (!isLoading.value) {
      isLoading.value = true

      try {

        await changeUserPassword(values)
        actions.resetForm()
        notyf.dismissAll()
        notyf.success("Password changed successfully!")
      } catch (err: any) {
        const formattedErrors = formatError(undefined, err.response.data)
        actions.setErrors(formattedErrors)
        notyf.error(t('form.invalid'))
      } finally {
        isLoading.value = false
      }
    }
  })
</script>

<template>
  <div class="account-box is-form is-footerless">
    <div class="form-head stuck-header" :class="[isScrolling && 'is-stuck']">
      <div class="form-head-inner">
        <div class="left">
          <h3>Settings</h3>
          <p>Edit your account prefs and settings</p>
        </div>
        <div class="right">
          <div class="buttons">
            <VButton
              to="/sidebar/layouts/profile-view"
              icon="lnir lnir-arrow-left rem-100"
              light
              dark-outlined
            >
              Go Back
            </VButton>
            <VButton
              color="primary"
              raised
              :loading="isLoading"
              tabindex="0"
              @keydown.space.prevent="onChange"
              @click="onChange"
            >
              Save Changes
            </VButton>
          </div>
        </div>
      </div>
    </div>
    <form class="form-body" @submit.prevent="onSave">
      <!--Fieldset-->
      <div class="fieldset">
        <div class="fieldset-heading">
          <h4>Change Password</h4>
          <p>For an improved account security</p>
        </div>
        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-12">
            <VField v-slot="{ field }" id="new_password1">
              <VControl icon="feather:lock">
                <VInput
                  type="password"
                  placeholder="New Password"
                  autocomplete="new-password"
                />
                <p v-if="field?.errors?.value?.length" class="help is-danger">
                  {{ field.errors?.value?.join(', ') }}
                </p>
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-12">
            <VField v-slot="{ field }" id="new_password2">
              <VControl icon="feather:lock">
                <VInput
                  type="password"
                  placeholder="Repeat New Password"
                  autocomplete="new-password"
                />
                <p v-if="field?.errors?.value?.length" class="help is-danger">
                  {{ field.errors?.value?.join(', ') }}
                </p>
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
