import { acceptHMRUpdate, defineStore } from 'pinia'
import { formatFieldChoices } from '/@src/utils/app/shared/helpers'
import { getFieldChoices } from '/@src/utils/api/clients'

export const useFieldSelect = defineStore('fieldTypeSelect', () => {
  
  const fieldsTypeData      = reactive({})
  const fieldOptionsLoading = ref(true)

  const filteredItems = async (event, schemaField) => {
    const searchTerm = event.target.value
    fieldOptionsLoading.value = true

    if (!fieldsTypeData[schemaField.id]) {
      fieldsTypeData[schemaField.id] = {}
    }

    fieldsTypeData[schemaField.id].options = formatFieldChoices(await getFieldChoices(schemaField.endpoint_url, searchTerm))
    fieldOptionsLoading.value = false
  }

  const selectItem = (item, schemaField, setFieldValue) => {
    fieldsTypeData[schemaField.id].selectedItem = item.display_name
    setFieldValue(schemaField.id, item.value)
    fieldsTypeData[schemaField.id].isOpen = false
  }

  return {
    fieldsTypeData,
    fieldOptionsLoading,
    filteredItems,
    selectItem,
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
