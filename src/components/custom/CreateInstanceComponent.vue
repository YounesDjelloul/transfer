<script setup lang="ts">

  import { useForm } from 'vee-validate'
  import { toFormValidator } from '@vee-validate/zod'
  import { useI18n } from 'vue-i18n'
  import { useNotyf } from '/@src/composable/useNotyf'

  const { t }  = useI18n()
  const notyf  = useNotyf()

  const emits = defineEmits<{
    (e: 'handleCreateInstanceAffect', data): void
    (e: 'hidePopup'): void
  }>()

  const props = defineProps<{
    validationSchema: object,
    requestFunction: void,
    modalTitle: string,
    formSchema: object,
  }>()

  const validationSchema = toFormValidator(props.validationSchema)

  const { handleSubmit } = useForm({
    validationSchema,
  })

  const isLoading = ref(false)

  const onCreate = handleSubmit(async (values) => {

    isLoading.value = true

    try {

      const toRequest = props.requestFunction
      const { data } = await toRequest(values)

      emits('handleCreateInstanceAffect', data)
    } catch (err) {
      notyf.error(err)

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
    @close="$emit('hidePopup')"
  >
    <template #content>
      <VPlaceload v-if="isLoading"/>
      <form class="modal-form" v-else>
        <VField v-for="schemaField in formSchema" :id="schemaField.id" v-slot="{ field }">
          <VControl class="has-icons-left" icon="feather:user">
            <VSelect v-if="schemaField.as === 'select'">
              <VOption disabled hidden value="undefined">Select a Type</VOption>
              <VOption v-for="(option, index) in schemaField.options" :value="index">{{ option }}</VOption>
            </VSelect>
            <VInput
              v-else
              :type="schemaField.type"
              :placeholder="t(`auth.placeholder.${schemaField.placeholder}`)"
              :autocomplete="schemaField.name"
            />
            <p v-if="field?.errors?.value?.length" class="help is-danger">
              {{ field.errors?.value?.join(', ') }}
            </p>
          </VControl>
        </VField>
      </form>
    </template>
    <template #action>
      <VButton type="submit" @click="onCreate" color="primary" raised>Create</VButton>
    </template>
  </VModal>
</template>