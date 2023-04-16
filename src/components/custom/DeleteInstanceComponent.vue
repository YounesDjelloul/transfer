<script setup lang='ts'>
	
  import { useNotyf } from '/@src/composable/useNotyf'
  import { useHandleInstance } from '/@src/stores/handleInstance'

  const handleInstance = useHandleInstance()

  const notyf = useNotyf()

	const emits = defineEmits<{
    (e: 'handleDeleteInstanceAffect'): void
  }>()
	
  const props = defineProps<{
    requestFunction: void,
    modalTitle: string,
  }>()

	const isLoading = ref(false)

	async function onDelete() {

  	isLoading.value = true

    try {

      const toDelete = props.requestFunction
      const response = await toDelete(handleInstance.instanceToDeletePk)
      emits('handleDeleteInstanceAffect')

    } catch (err) {
      notyf.error(err.response.data)

    } finally {
      isLoading.value = false
    }
  }

</script>

<template>
	<VModal
    :open="true"
    :title="modalTitle"
    size="meduim"
    actions="right"
    noscroll
    @close="handleInstance.showDeleteInstancePopup=false"
  >
    <template #content>
      <VPlaceload v-if="isLoading" />
      <div class="view-container" v-else>
        <div class="view-section">
          <div class="delete-header">
            <h3 class="content">Are you sure you want to delete this client?</h3>
          </div>
        </div>
      </div>
    </template>
    <template #action>
      <VButton type="submit" @click="onDelete" color="danger" raised>Delete</VButton>
    </template>
  </VModal>
</template>