<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useForm } from 'vee-validate'
import { toFormValidator } from '@vee-validate/zod'
import { z as zod } from 'zod'
import { useI18n } from 'vue-i18n'

import APP_URLs from '/@src/utils/app/urls'

import { authenticateUser } from '/@src/services/modules/auth/accounts'
import { useDarkmode } from '/@src/stores/darkmode'
import { useUserSession } from '/@src/stores/userSession'
import { useNotyf } from '/@src/composable/useNotyf'

const { t } = useI18n()
const isLoading = ref(false)
const darkmode = useDarkmode()
const router = useRouter()
const route = useRoute()
const notyf = useNotyf()
const userSession = useUserSession()
const redirect = route.query.redirect as string

const validationSchema = toFormValidator(
  zod.object({
    username: zod
      .string({
        required_error: t('auth.errors.username.required'),
      })
      .min(1, t('auth.errors.username.length')),
    password: zod
      .string({
        required_error: t('auth.errors.password.required'),
      })
      .min(8, t('auth.errors.password.length')),
  })
)

const { handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    username: '',
    password: ''
  },
})

const onLogin = handleSubmit(async (values) => {
  if (!isLoading.value) {
    isLoading.value = true

    try {

      await authenticateUser(values)

      notyf.dismissAll()
      notyf.success('Welcome back, ' + values.username)

      if (redirect) {
        router.push(redirect)
      } else {
        router.push(APP_URLs.HOME)
      }

    } catch (error: any) {
      notyf.error(error)

    } finally {
      isLoading.value = false
    }
  }
})

useHead({
  title: 'LexAlgeria - Login',
})
</script>

<template>
  <div class="auth-wrapper-inner columns is-gapless">
    <!-- Image section (hidden on mobile) -->
    <div class="column login-column is-8 h-hidden-mobile h-hidden-tablet-p hero-banner">
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

    <!-- Form section -->
    <div class="column is-4">
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
              <AnimatedLogo width="36px" height="36px" />
            </RouterLink>
          </div>
        </div>
        <div class="hero-body">
          <div class="container">
            <div class="columns">
              <div class="column is-12">
                <div class="auth-content">
                  <h2>Welcome Back.</h2>
                  <p>Please sign in to your account</p>
                  <RouterLink :to="APP_URLs.REGISTRATION">
                    I do not have an account yet
                  </RouterLink>
                </div>
                <div class="auth-form-wrapper">
                  <!-- Login Form -->
                  <form @submit.prevent="onLogin">
                    <div class="login-form">
                      <!-- Username -->
                      <VField id="username" v-slot="{ field }">
                        <VControl icon="feather:user">
                          <VInput
                            type="text"
                            :placeholder="t('auth.placeholder.username')"
                            autocomplete="name"
                          />
                          <p v-if="field?.errors?.value?.length" class="help is-danger">
                            {{ field.errors?.value?.join(', ') }}
                          </p>
                        </VControl>
                      </VField>

                      <!-- Password -->
                      <VField id="password" v-slot="{ field }">
                        <VControl icon="feather:lock">
                          <VInput
                            type="password"
                            :placeholder="t('auth.placeholder.password')"
                            autocomplete="new-password"
                          />
                          <p v-if="field?.errors?.value?.length" class="help is-danger">
                            {{ field.errors?.value?.join(', ') }}
                          </p>
                        </VControl>
                      </VField>

                      <!-- Submit -->
                      <div class="login">
                        <VButton
                          :loading="isLoading"
                          color="primary"
                          type="submit"
                          bold
                          fullwidth
                          raised
                        >
                          Sign In
                        </VButton>
                      </div>

                      <div class="forgot-link has-text-centered">
                        <a>Forgot Password?</a>
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
  </div>
</template>
