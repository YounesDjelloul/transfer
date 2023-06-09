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
    <div class="dropdown-result" @click="fieldSelect.toggleSelect(schemaField)">
      <span v-if="fieldsData[schemaField.id].selectedItem.length === 0">{{ schemaField.label }}</span>
      <VField grouped multiline v-else>
        <VControl v-for="option in fieldsData[schemaField.id].selectedItem">
          <VTags addons>
            <VTag :label="option.display_name" color="primary" />
            <VTag remove @mousedown="fieldSelect.removeItem(option, schemaField, setFieldValue, true)"/>
          </VTags>
        </VControl>
      </VField>
    </div>
    <div class="dropdown-container">
      <div class="dropdown-header">
        <input 
          class="input"
          :type="schemaField.html_input_type"
          :placeholder="`Search ${schemaField.label}` "
          @input="fieldSelect.filteredItems($event, schemaField)"
        >
      </div>
      <ul class="dropdown-list" >
        <div v-if="fieldSelect.fieldOptionsLoading" class="dropdown-loader">
          <VPlaceload/>
        </div>
        <div class="no-options" v-else-if="fieldsData[schemaField.id].options.length === 0">No Records Match</div>
        <div v-else>
          <li
            v-for="item in fieldsData[schemaField.id].options"
            :key="item.value"
            @mousedown="fieldSelect.selectItem(item, schemaField, setFieldValue, true)"
          >
            {{ item.display_name }}
          </li>
        </div>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">

  .is-dark {
    .dropdown-result, .dropdown-container, .dropdown-list {
      background: var(--dark-sidebar-light-8) !important;
    }

    .dropdown-list li {
      color: var(--primary--color-invert) !important;
    }
  }

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
      background: var(--white);
      font-size: inherit;
      font-family: inherit;
      padding: calc(0.6em - 1px) 38px 9px;
    }

    .dropdown-container {
      display: none;
      position: relative;
      z-index: 5;
      background: var(--white);
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
        background: var(--white);

        .dropdown-loader, .no-options {
          padding: 10px 10px 10px 39px;
        }

        .no-options {
          font-weight: bold;
        }

        li {
          padding: 10px 10px 10px 20px;
          cursor: pointer;
          color: hsl(0deg, 0%, 21%);

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