<script setup lang='ts'>
	
	const emits = defineEmits<{
    (e: 'hideDeleteClientPopup'): void
    (e: 'loadClients'): void
  }>()

	import { useNotyf } from '/@src/composable/useNotyf'
	import { deleteClientRequest } from '/@src/utils/api/clients'
	
	const props = defineProps(['clientId'])
	const notyf = useNotyf()

	const clientDeletionLoading = ref(false)

	async function deleteClient() {

  	clientDeletionLoading.value = true

    try {
      const response = await deleteClientRequest(props.clientId)
      notyf.dismissAll()
      notyf.success("Client Deleted Successfully!")

    } catch (error) {
      notyf.error(error)

    } finally {
      clientDeletionLoading.value = false
      emits('hideDeleteClientPopup')
      emits('loadClients')
    }
  }

</script>

<template>
	<VModal
    :open="true"
    title="Delete Client"
    size="meduim"
    actions="right"
    noscroll
    @close="$emit('hideDeleteClientPopup')"
  >
    <template #content>
      <VPlaceload v-if="clientDeletionLoading" />
      <div class="view-container" v-else>
        <div class="view-section">
          <div class="delete-header">
            <h3 class="content">Are you sure you want to delete this client?</h3>
          </div>
        </div>
      </div>
    </template>
    <template #action>
      <VButton type="submit" @click="deleteClient" color="danger" raised>Delete</VButton>
    </template>
  </VModal>
</template>