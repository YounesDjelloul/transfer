import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { useQueryParam } from '/@src/stores/queryParam'

export const useHandleInstance = defineStore('handleInstance', () => {

  const notyf  = useNotyf()
  const router = useRouter()
  const route  = useRoute()
  const queryParam = useQueryParam()

  const showCreateInstancePopup = ref(false)
  const showDeleteInstancePopup = ref(false)
  const showViewInstanceDetailsPopup = ref(false)
  const showUpdateInstancePopup  = ref(false)
  const showFilterInstancesPopup = ref(false)

  const totalInstances   = ref(0)
  const currentReload    = ref(false)
  const operatedInstance = ref()

  let status               = undefined
  let currentStateData     = undefined

  const instanceToUpdatePk = ref()
  const instanceToDeletePk = ref()
  const instanceToViewPk   = ref()

  function getUpdateInstanceDetailsPopup(instancePk, stateData) {
    instanceToUpdatePk.value = instancePk
    currentStateData         = stateData
    showUpdateInstancePopup.value = true
  }

  function getCreateInstancePopup(stateData) {
    currentStateData        = stateData
    showCreateInstancePopup.value = true
  }

  function getDeleteInstancePopup(instancePk, stateData) {
    instanceToDeletePk.value = instancePk
    currentStateData         = stateData
    showDeleteInstancePopup.value = true
  }

  function getViewInstanceDetailsPopup(instancePk) {
    instanceToViewPk.value             = instancePk
    showViewInstanceDetailsPopup.value = true
  }

  function reload(operation) {
    status = operation
    queryParam.reload = !currentReload.value
  }

  function handleInstanceCreationAffect(data) {

    notyf.dismissAll()
    notyf.success("Record Created Successfully!")

    showCreateInstancePopup.value = false
    operatedInstance.value        = data
    reload('create')
  }

  function handleInstanceUpdateAffect(data) {

    notyf.dismissAll()
    notyf.success("Record Updated Successfully!")

    showUpdateInstancePopup.value    = false
    operatedInstance.value = data
    reload('update')
  }

  function handleInstanceDeleteAffect() {

    notyf.dismissAll()
    notyf.success("Record Deleted Successfully!")

    showDeleteInstancePopup.value = false
    reload('delete')
  }

  return {
    showCreateInstancePopup,
    showDeleteInstancePopup,
    showViewInstanceDetailsPopup,
    showUpdateInstancePopup,
    showFilterInstancesPopup,
    totalInstances,
    currentReload,
    status,
    currentStateData,
    operatedInstance,
    instanceToUpdatePk,
    instanceToDeletePk,
    instanceToViewPk,

    handleInstanceDeleteAffect,
    handleInstanceUpdateAffect,
    handleInstanceCreationAffect,
    getViewInstanceDetailsPopup,
    getDeleteInstancePopup,
    getCreateInstancePopup,
    getUpdateInstanceDetailsPopup,
  }
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHandleInstance, import.meta.hot))
}
