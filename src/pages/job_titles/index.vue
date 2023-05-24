<script setup lang="ts">

  import API_URLs from '/@src/utils/api/urls'

  import { provide } from 'vue'
  import { useHead } from '@vueuse/head'
  import { useViewWrapper } from '/@src/stores/viewWrapper'

  import { useHandleInstance } from '/@src/stores/handleInstance'
  import { useQueryParam } from '/@src/stores/queryParam'
  import { useModelSchemas } from '/@src/utils/app/CRUD/modelCache'

  import { GeneratorFunctionForLists } from '/@src/utils/app/VFlexTable/helpers'

  const endpointUrl    = API_URLs.JOB_TITLES
  const renderLoading  = ref(true)
  const errorToDisplay = ref('')

  const componentDependencies = reactive({
    createModelSchema: undefined,
    updateModelSchema: undefined,
    filtersModelSchema: undefined,
    updateMethod: undefined,
    columns: undefined,
    modelPk: undefined,
  })

  onMounted(() => { GeneratorFunctionForLists(componentDependencies, "JobTitles", renderLoading, errorToDisplay, endpointUrl)})

  provide("endpointUrl", endpointUrl)

  const handleInstance = useHandleInstance()
  const queryParam     = useQueryParam()

  const viewWrapper = useViewWrapper()
  viewWrapper.setPageTitle('Job Titles')

  useHead({
    title: 'Lex Algeria - Job Titles',
  })
</script>

<template>
  <GeneratedComponentContent
    :component-dependencies="componentDependencies"
    :render-loading="renderLoading"
    :error-to-display="errorToDisplay"
  />
</template>