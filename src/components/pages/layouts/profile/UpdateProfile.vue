<script setup lang="ts">

  import { useNotyf } from '/@src/composable/useNotyf'
  import { useI18n } from 'vue-i18n'
  import { useForm } from 'vee-validate'
  import { toFormValidator } from '@vee-validate/zod'

  import { onceImageErrored } from '/@src/utils/via-placeholder'
  import { getUserDetails, updateUserDetails } from '/@src/utils/api/users'
  import { useUserSession } from '/@src/stores/userSession'
  import { getFormattedUpdateUserSchema, objectPop, arrayPop } from '/@src/utils/app/profile/helpers'
  import {
    generateInitialValues,
    formatError,
    generateValidationSchema
  } from '/@src/utils/app/shared/helpers'
  import APP_URLs from '/@src/utils/app/urls'
  
  const notyf = useNotyf()
  const { y } = useWindowScroll()
  const { t } = useI18n()

  const userSession = useUserSession()

  const isUploading = ref(false)
  const isLoading   = ref(true)

  const currentUser     = userSession.user

  const currentUsername = currentUser.pk

  let formSchema        = await getFormattedUpdateUserSchema(currentUsername)
  const userAvatarProp  = arrayPop("url", formSchema)
  let validationSchema  = toFormValidator(generateValidationSchema(formSchema, t))
  let userDetails       = await getUserDetails(currentUsername)
  let initialValues     = generateInitialValues(userDetails, formSchema)

  isLoading.value = false

  const { handleSubmit, setFieldValue } = useForm({
    validationSchema,
    initialValues,
  })

  const isScrolling = computed(() => {
    return y.value > 30
  })

  const onAddFile = (error: any, file: any) => {
    if (error) {
      notyf.error(error)
      return
    }

    setFieldValue(userAvatarProp.id, file)
  }
  const onRemoveFile = (error: any, file: any) => {
    if (error) {
      notyf.error(error)
      return
    }

    setFieldValue(userAvatarProp.id, undefined)
  }
  
  const onUpdate = handleSubmit(async (values, actions) => {
    isLoading.value = true

    try {
      const result = await updateUserDetails(currentUsername, values)
      notyf.success(t('profile.form.update.success'))

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
  <form class="form-layout is-stacked">
    <div class="account-box is-form is-footerless">
      <div class="form-head stuck-header" :class="[isScrolling && 'is-stuck']">
        <div class="form-head-inner">
          <div class="left">
            <h3>General Info</h3>
            <p>Edit your account's general information</p>
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
                @keydown.space.prevent="onUpdate"
                @click="onUpdate"
              >
                Save Changes
              </VButton>
            </div>
          </div>
        </div>
      </div>
      <div class="form-body">
        <!--Fieldset-->
        <div class="fieldset">
          <div class="fieldset-heading">
            <h4>Profile Picture</h4>
            <p>This is how others will recognize you</p>
          </div>

          <VAvatar size="xl" class="profile-v-avatar">
            <template #avatar>
              <img
                v-if="!isUploading"
                class="avatar"
                src="/images/avatars/svg/vuero-1.svg"
                alt=""
                @error.once="onceImageErrored(150)"
              />
              <VFilePond
                v-else
                class="profile-filepond"
                name="profile-filepond"
                id="user_avatar.url"
                :chunk-retry-delays="[500, 1000, 3000]"
                label-idle="<i class='lnil lnil-cloud-upload'></i>"
                :accepted-file-types="['image/png', 'image/jpeg', 'image/gif']"
                :image-preview-height="140"
                :image-resize-target-width="140"
                :image-resize-target-height="140"
                image-crop-aspect-ratio="1:1"
                style-panel-layout="compact circle"
                style-load-indicator-position="center bottom"
                style-progress-indicator-position="right bottom"
                style-button-remove-item-position="left bottom"
                style-button-process-item-position="right bottom"
                @addfile="onAddFile"
                @removefile="onRemoveFile"
              />
              <VIconButton
                v-if="!isUploading"
                icon="feather:edit-2"
                class="edit-button is-edit"
                circle
                tabindex="0"
                @keydown.space.prevent="isUploading = true"
                @click="isUploading = true"
              />
              <VIconButton
                v-else
                icon="feather:arrow-left"
                class="edit-button is-back"
                circle
                tabindex="0"
                @keydown.space.prevent="isUploading = false"
                @click="isUploading = false"
              />
            </template>
          </VAvatar>
        </div>

        <!--Fieldset-->
        <div class="fieldset">
          <div class="fieldset-heading">
            <h4>Personal Info</h4>
            <p>Others diserve to know you more</p>
          </div>

          <div class="columns is-multiline">
            <!--Field-->
            <div class="column is-12" v-for="schemaField in formSchema">
              <VField :id="schemaField.id" v-slot="{ field }">
                <VControl class="has-icons-left" icon="feather:user">
                  <VSelect v-if="schemaField.type === 'choice'">
                    <VOption disabled hidden value="">Select a Type</VOption>
                    <VOption v-for="choice in schemaField.choices" :value="choice.value">{{ choice.display_name }}</VOption>
                  </VSelect>
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
    </div>
  </form>
</template>