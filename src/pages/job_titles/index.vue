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
  provide("modelPk", componentDependencies.modelPk)

  const handleInstance = useHandleInstance()
  const queryParam     = useQueryParam()

  const viewWrapper = useViewWrapper()
  viewWrapper.setPageTitle('Job Titles')

  useHead({
    title: 'Lex Algeria - Job Titles',
  })
</script>

<template>
  <div class="page-content-inner">
    <div class="column is-12">
      <VCard radius="small" color="warning" v-if="!renderLoading && errorToDisplay.length > 0">
        <h3 class="title is-5 mb-2">{{ errorToDisplay }}</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quibusnam praeteritis? At
          multis se probavit. Quoniam, si dis placet, ab Epicuro loqui discimus. Et ille
          ridens.
        </p>
      </VCard>
      <FlexListV1
        v-if="!renderLoading && errorToDisplay.length === 0"

        :component-dependencies="componentDependencies"
      >
      </FlexListV1>
    </div>
  </div>
</template>