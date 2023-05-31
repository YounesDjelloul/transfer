<script setup lang="ts">
  import { useFieldSelect } from '/@src/stores/fieldTypeSelect'

  const props = defineProps<{
    schemaField: object,
    setFieldValue: void,
  }>()

  const fieldSelect = useFieldSelect()
  const fieldsData = fieldSelect.fieldsTypeData

</script>

<template>
  <div class="custom-dropdown" :class="{ 'is-open': fieldsData[schemaField.id].isOpen }">
    <input
      class="input"
      :type="schemaField.html_input_type"
      :placeholder="`Search ${schemaField.label}`"
      v-model="fieldsData[schemaField.id].typed"
      @input="fieldSelect.filteredItems($event, schemaField, setFieldValue)"
      @click="fieldSelect.toggleSelect(schemaField)"
      @blur="fieldsData[schemaField.id].isOpen = false"
    />
    <div class="dropdown-container">
      <ul class="dropdown-list">
        <div v-if="fieldSelect.fieldOptionsLoading" class="dropdown-loader">
          <VPlaceload/>
        </div>
        <div class="no-options" v-else-if="fieldsData[schemaField.id].options.length === 0">No Records Match</div>
        <div v-else>
          <li
            v-for="item in fieldsData[schemaField.id].options"
            @mousedown="fieldSelect.selectItem(item, schemaField, setFieldValue, false)"
          >
            {{ item.display_name }}
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">

  .dropdown-container {
    padding: 5px 10px !important;
  }

  .field-type-container {
    display: flex;
    
    .field-type-search {
      margin-right: 5px;
    }
  }
</style>