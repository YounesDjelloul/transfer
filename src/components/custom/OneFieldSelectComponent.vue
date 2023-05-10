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
        <li
          v-for="item in fieldsData[schemaField.id].options"
          @mousedown="fieldSelect.selectItem(item, schemaField, setFieldValue, false)"
        >
          {{ item.display_name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">

  .custom-dropdown {
    position: relative;
    display: block;
    width: 100%;
    font-size: 1rem;
    margin-bottom: 8px;
    height: auto;
    font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
    cursor: pointer;

    .dropdown-result {

      width: 100%;
      min-height: 2.7rem;
      background: var(--dark-sidebar-light-8);
      font-size: inherit;
      font-family: inherit;
      padding: calc(0.6em - 1px) 38px 9px;
    }

    .dropdown-container {
      display: none;
      position: relative;
      z-index: 5;
      background: var(--dark-sidebar-light-8);
      width: 100%;
      max-height: 120px;
      border-radius: 0px 0px 6px 6px;
      padding: 14px 10px;

      .dropdown-header {
        input {
          padding-left: 15px;
        }
      }

      .dropdown-list {
        position: absolute;
        top: 100%;
        left: 0;
        list-style: none;

        .dropdown-loader {
          padding: 0px 10px 10px 39px;
        }

        li {
          padding: 10px 10px 10px 20px;
          cursor: pointer;
          color: var(--primary--color-invert);

          &:hover {
            background-color: var(--primary);
          }
        }
      }
    }

    &.is-open {
      .dropdown-container {
        display: block;
      }
    }
  }




  .field-type-container {
    display: flex;
    
    .field-type-search {
      margin-right: 5px;
    }
  }
</style>