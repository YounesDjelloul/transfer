<route lang="yaml">
meta:
  guest: true
</route>

<script setup lang="ts">

import { registerUser } from '/@src/services/modules/auth/accounts'
import APP_URLs from '/@src/utils/app/urls'
import { getSignupSchema } from '/@src/utils/api/auth'

import {
  formatCreateSchema,
  formatError,
  generateValidationSchema,
} from '/@src/utils/app/CRUD/helpers'

import { useApi } from '/@src/composable/useApi'
import { useI18n } from 'vue-i18n'

import { useHead } from '@vueuse/head'
import { toFormValidator } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z as zod } from 'zod'

import { useDarkmode } from '/@src/stores/darkmode'
import { useNotyf } from '/@src/composable/useNotyf'

const darkmode = useDarkmode()
const router = useRouter()
const notyf = useNotyf()
const api = useApi()

const isLoading = ref(false)
const { t } = useI18n()

const signupSchema    = await getSignupSchema()
const formattedSchema = formatCreateSchema(signupSchema)

const validationSchema = toFormValidator(
  generateValidationSchema(signupSchema)
  .refine((data) => data.password1 === data.password2, {
    message: t('auth.errors.passwordCheck.match'),
    path: ['password2'],
  })
)

const { handleSubmit } = useForm({
  validationSchema,
})

const onSignup = handleSubmit(async (values, actions) => {
  if (!isLoading.value) {
    isLoading.value = true

    try {

      await registerUser(values)

      notyf.dismissAll()
      notyf.success('Welcome, ' + values.username)

      router.push(APP_URLs.LOGIN)
    } catch (err: any) {
      const formattedErrors = formatError(undefined, err.response.data)
      actions.setErrors(formattedErrors)
      notyf.error(t('form.invalid'))

    } finally {
      isLoading.value = false
  
    }
  }
})

useHead({
  title: 'LexAlgeria - Signup',
})
</script>

<template>
  <div class="auth-wrapper-inner columns is-gapless">
    <!-- Form section -->
    <div class="column is-5">
      <div class="hero is-fullheight is-white">
        <div class="hero-heading">
          <label
            class="dark-mode ml-auto"
            tabindex="0"
            @keydown.space.prevent="(e) => (e.target as HTMLLabelElement).click()"
          >
            <input
              type="checkbox"
              :checked="!darkmode.isDark"
              @change="darkmode.onChange"
            />
            <span></span>
          </label>
          <div class="auth-logo">
            <RouterLink to="/">
              <AnimatedLogo class="top-logo" width="36px" height="36px" />
            </RouterLink>
          </div>
        </div>
        <div class="hero-body">
          <div class="container">
            <div class="columns">
              <div class="column is-12">
                <div class="auth-content">
                  <h2>{{ t('auth.title') }}</h2>
                  <p>{{ t('auth.subtitle') }}</p>
                  <RouterLink :to="APP_URLs.LOGIN">
                    {{ t('auth.action.login') }}
                  </RouterLink>
                </div>
                <div class="auth-form-wrapper">
                  <!-- Signup Form -->
                  <form @submit="onSignup">
                    <div id="signin-form" class="login-form">
                      <!-- Input -->

                      <VField v-for="schemaField in formattedSchema" :id="schemaField.id" v-slot="{ field }">
                        <VControl class="has-icons-left" icon="feather:user">
                          <VSelect v-if="schemaField.type === 'choice'">
                            <VOption disabled hidden value="undefined">Select a Type</VOption>
                            <VOption v-for="choice in schemaField.choices" :value="choice.value">{{ choice.display_name }}</VOption>
                          </VSelect>
                          <VInput
                            v-else
                            :type="schemaField.type"
                            :placeholder="schemaField.label"
                          />
                          <p v-if="field?.errors?.value?.length" class="help is-danger">
                            {{ field.errors?.value?.join(', ') }}
                          </p>
                        </VControl>
                      </VField>

                      <div class="login">
                        <VButton :loading="isLoading" type="submit" color="primary" bold fullwidth raised>
                          {{ t('auth.action.signup') }}
                        </VButton>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image section (hidden on mobile) -->
    <div class="column login-column is-7 is-hidden-mobile hero-banner">
      <div class="hero login-hero is-fullheight is-app-grey">
        <div class="hero-body">
          <div class="columns">
            <div class="column is-10 is-offset-1">
              <img
                class="light-image has-light-shadow has-light-border"
                src="/@src/assets/illustrations/apps/vuero-banking-light.webp"
                alt=""
              />
              <img
                class="dark-image has-light-shadow"
                src="/@src/assets/illustrations/apps/vuero-banking-dark.webp"
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="hero-footer">
          <p class="has-text-centered"></p>
        </div>
      </div>
    </div>
  </div>
</template>
