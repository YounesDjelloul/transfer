import { acceptHMRUpdate, defineStore } from 'pinia'
import { formatFieldChoices } from '/@src/utils/app/shared/helpers'
import { getFieldChoices } from '/@src/utils/api/clients'

export const useFieldSelect = defineStore('fieldTypeSelect', () => {
  
  const fieldsTypeData      = ref()
  const fieldOptionsLoading = ref(false)

  const filteredItems = async (event, schemaField) => {
    const searchTerm = event.target.value
    fieldOptionsLoading.value = true
    fieldsTypeData.value[schemaField.id].options = formatFieldChoices(await getFieldChoices(schemaField.endpoint_url, searchTerm))
    fieldOptionsLoading.value = false
  }

  const selectItem = (item, schemaField, setFieldValue) => {
    fieldsTypeData.value[schemaField.id].selectedItem = item.value
    setFieldValue(schemaField.id, item.value)
  }

  const toggleSelect = (schemaField) => {
    fieldsTypeData.value[schemaField.id].isOpen = !fieldsTypeData.value[schemaField.id].isOpen
  }

  const setData = (dataObj) => {
    fieldsTypeData.value = dataObj
  }

  return {
    setData,
    fieldsTypeData,
    fieldOptionsLoading,
    filteredItems,
    selectItem,
    toggleSelect,
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
  import.meta.hot.accept(acceptHMRUpdate(useFieldSelect, import.meta.hot))
}
