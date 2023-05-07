<script setup lang="ts">
  import { useFieldSelect } from '/@src/stores/fieldTypeSelect'

  const props = defineProps<{
    schemaField: object,
  }>()

  const fieldSelect = useFieldSelect()
  const fieldsData = fieldSelect.fieldsTypeData

</script>

<template>
  <VSelect>
    <VOption value>Select {{ schemaField.label }}</VOption>
    <VOption v-for="choice in fieldsData[schemaField.id].options" :value="choice.value">{{ choice.display_name }}</VOption>
  </VSelect>
</template>