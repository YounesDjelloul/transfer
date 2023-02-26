<script setup lang='ts'>
	
	const emits = defineEmits<{
    (e: 'hideViewClientPopup'): void
  }>()

	import { useNotyf } from '/@src/composable/useNotyf'
	import { getClientDetails } from '/@src/utils/api/clients'
	
	const props = defineProps(['clientId'])
	const notyf = useNotyf()

	const clientDetailsLoading = ref(true)
  const clientDetails        = ref()

  onMounted(async () => {

    try {
      const response      = await getClientDetails(props.clientId)
      clientDetails.value = response.user

    } catch (error) {
      notyf.error(error)
      emits('hideViewClientPopup')

    } finally {
      clientDetailsLoading.value = false
    }
  })

</script>

<template>
	<VModal
    :open="true"
    title="Client Details"
    size="meduim"
    actions="right"
    noscroll
    @close="$emit('hideViewClientPopup')"
  >
    <template #content>
      <VPlaceload v-if="clientDetailsLoading" />
      <div class="view-container" v-else>
        <div class="view-section">
          <div class="view-section-header">
            <h3 class="content">User</h3>
          </div>
          <div class='view-section-info' v-for="(value, detail) in clientDetails">
            <span>{{ detail }}</span>
            <span>{{ value }}</span>
          </div>
        </div>
      </div>
    </template>
  </VModal>
</template>