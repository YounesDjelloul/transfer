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

  const selectItem = (item, schemaField, setFieldValue, multiple) => {

    const currentSelection = fieldsTypeData.value[schemaField.id].selectedItem

    if (currentSelection.includes(item)) {
      return;
    }

    fieldsTypeData.value[schemaField.id].selectedItem.push(item)
    fieldsTypeData.value[schemaField.id].toSubmitValues.push(item.value)

    setFieldValue(schemaField.id, fieldsTypeData.value[schemaField.id].toSubmitValues)
  }

  const removeItem = (item, schemaField, setFieldValue, multiple) => {

    let currentSelection = fieldsTypeData.value[schemaField.id].selectedItem

    currentSelection = currentSelection.filter((selectedOption) => {
      return selectedOption !== item
    })

    fieldsTypeData.value[schemaField.id].selectedItem   = currentSelection

    let currentToSubmitValues = fieldsTypeData.value[schemaField.id].toSubmitValues

    currentToSubmitValues = currentToSubmitValues.filter((selectedOption) => {
      return selectedOption !== item.value
    })

    fieldsTypeData.value[schemaField.id].toSubmitValues = currentToSubmitValues

    setFieldValue(schemaField.id, fieldsTypeData.value[schemaField.id].toSubmitValues)
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
    removeItem,
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
