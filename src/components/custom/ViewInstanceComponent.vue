<script setup lang='ts'>

  import { useNotyf } from '/@src/composable/useNotyf'
	
	const emits = defineEmits<{
    (e: 'hidePopup'): void
  }>()

  const props = defineProps<{
    requestFunction: void,
    modalTitle: string,
    clientId: number,
  }>()

	const notyf = useNotyf()

	const isLoading = ref(true)
  const instance  = ref()

  onMounted(async () => {

    const toRequest = props.requestFunction

    try {
      const response = await toRequest(props.clientId)
      instance.value = response

      console.log(response)

    } catch (error) {
      notyf.error(error)
      emits('hidePopup')

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
      <VPlaceload v-if="isLoading" />
      <div class="view-container" v-else>
        <div class="view-section">
          <div class="view-section-header">
            <h3 class="content">User</h3>
          </div>
          <div class='view-section-info' v-for="(value, detail) in instance">
            <span>{{ detail }}</span>
            <span>{{ value }}</span>
          </div>
        </div>
      </div>
    </template>
  </VModal>
</template>