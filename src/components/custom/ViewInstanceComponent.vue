<script setup lang='ts'>

  import { inject } from 'vue'
  import { useNotyf } from '/@src/composable/useNotyf'
  import { formatView } from '/@src/utils/app/shared/helpers'
  import { useHandleInstance } from '/@src/stores/handleInstance'

  const props = defineProps<{
    requestFunction: void,
    modalTitle: string,
  }>()

	const notyf          = useNotyf()
  const handleInstance = useHandleInstance()

  const endpointUrl = inject('endpointUrl')

	const isLoading = ref(true)
  const instance  = ref()

  onMounted(async () => {

    try {
      
      const toRequest = props.requestFunction

      const response  = await toRequest(endpointUrl, handleInstance.instanceToViewPk)
      instance.value  = await formatView(response)

    } catch (error) {
      notyf.error(error)
      handleInstance.showViewInstanceDetailsPopup = false

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
    @close="handleInstance.showViewInstanceDetailsPopup=false"
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