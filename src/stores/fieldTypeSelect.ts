import { acceptHMRUpdate, defineStore } from 'pinia'
import { formatFieldChoices } from '/@src/utils/app/shared/helpers'
import { getFieldChoices } from '/@src/utils/api/modelApiCallFunctions'
import { useNotyf } from '/@src/composable/useNotyf'

export const useFieldSelect = defineStore('fieldTypeSelect', () => {

  const notyf  = useNotyf()

  const fieldsTypeData      = ref()
  const fieldOptionsLoading = ref(false)
  const showCreatePopup     = ref(false)

  const clearSelectedValueForOne = (schemaField, setFieldValue) => {
    fieldsTypeData.value[schemaField.id].toSubmitValues = null
    fieldsTypeData.value[schemaField.id].selectedItem   = []
    setFieldValue(schemaField.id, fieldsTypeData.value[schemaField.id].toSubmitValues)
  }

  const checkValuesDuplication = (selection, item) => {
    for (const one of selection) {
      if (JSON.stringify(one) === JSON.stringify(item)) {
        return true
      }
    }

    return false
  }

  const filteredItems = async (event, schemaField, setFieldValue) => {
    const searchTerm = event.target.value

    if (schemaField.relationship !== "many_to_many") {
      clearSelectedValueForOne(schemaField, setFieldValue)
    }

    fieldOptionsLoading.value = true
    fieldsTypeData.value[schemaField.id].options = formatFieldChoices(await getFieldChoices(schemaField.endpoint_url, searchTerm))
    fieldOptionsLoading.value = false
  }

  const selectItem = (item, schemaField, setFieldValue, multiple) => {

    const currentSelection = fieldsTypeData.value[schemaField.id].selectedItem

    const duplicationCheckResult = checkValuesDuplication(currentSelection, item)

    if (!duplicationCheckResult) {
      fieldsTypeData.value[schemaField.id].selectedItem.push(item)
      fieldsTypeData.value[schemaField.id].typed = item.display_name

      if (multiple) {
        fieldsTypeData.value[schemaField.id].toSubmitValues.push(item.value)
      } else {
        fieldsTypeData.value[schemaField.id].toSubmitValues = item.value
      }

      setFieldValue(schemaField.id, fieldsTypeData.value[schemaField.id].toSubmitValues)
    }
  }

  const removeItem = (item, schemaField, setFieldValue, multiple) => {

    let currentSelection = fieldsTypeData.value[schemaField.id].selectedItem
    let currentToSubmitValues = fieldsTypeData.value[schemaField.id].toSubmitValues

    currentSelection = currentSelection.filter((selectedOption) => {
      return selectedOption !== item
    })

    currentToSubmitValues = currentToSubmitValues.filter((selectedOption) => {
      return selectedOption !== item.value
    })

    fieldsTypeData.value[schemaField.id].selectedItem   = currentSelection
    fieldsTypeData.value[schemaField.id].toSubmitValues = currentToSubmitValues

    setFieldValue(schemaField.id, fieldsTypeData.value[schemaField.id].toSubmitValues)
  }

  const toggleSelect = (schemaField) => {
    fieldsTypeData.value[schemaField.id].isOpen = !fieldsTypeData.value[schemaField.id].isOpen
  }

  const setData = (dataObj) => {
    fieldsTypeData.value = {...dataObj, ...fieldsTypeData.value}
  }

  const handleNewOptionCreationAffect = (instance, id) => {
    fieldsTypeData.value[id].options.push(...formatFieldChoices([instance]))
    showCreatePopup.value = false
    notyf.dismissAll()
    notyf.success("Record Created Successfully!")
  }

  const toggleCreatePopup = () => {
    showCreatePopup.value = !showCreatePopup.value
  }

  return {
    setData,
    handleNewOptionCreationAffect,
    showCreatePopup,
    toggleCreatePopup,
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
