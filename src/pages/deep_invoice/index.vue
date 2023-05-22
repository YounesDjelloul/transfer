<script setup lang="ts">

  import API_URLs from '/@src/utils/api/urls'

  import { provide } from 'vue'
  import { useHead } from '@vueuse/head'
  import { useViewWrapper } from '/@src/stores/viewWrapper'

  import { useHandleInstance } from '/@src/stores/handleInstance'
  import { useQueryParam } from '/@src/stores/queryParam'
  import { useModelSchemas } from '/@src/utils/app/CRUD/modelCache'

  import {
    GeneratorFunctionForLists,
    InvoicesDependencyGenerator,
    splitCreateSchemaFields
  } from '/@src/utils/app/VFlexTable/helpers'

  const endpointUrl    = API_URLs.BILLING__INVOICES
  const renderLoading  = ref(true)
  const errorToDisplay = ref('')

  const componentDependencies = reactive({
    modelPk: undefined,
    overAllSchema: [],
    normalFieldsSchema: [],
    tableFieldsSchema: [],
  })

  onMounted(async () => {
    await InvoicesDependencyGenerator(componentDependencies, "deepInvoice", renderLoading, errorToDisplay, endpointUrl)
  })

  provide("endpointUrl", endpointUrl)
  provide("modelPk", componentDependencies.modelPk)

  const handleInstance = useHandleInstance()
  const queryParam     = useQueryParam()

  const viewWrapper = useViewWrapper()
  viewWrapper.setPageTitle('Invoice Form')

  useHead({
    title: 'Lex Algeria - Invoice Form',
  })
</script>

<template>
  <VCard radius="small" color="info" v-if="renderLoading">
    <h3 class="title is-5 mb-2">Loading Data..</h3>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quibusnam praeteritis? At
      multis se probavit. Quoniam, si dis placet, ab Epicuro loqui discimus. Et ille
      ridens.
    </p>
  </VCard>
  <VCard radius="small" color="warning" v-else-if="!renderLoading && errorToDisplay.length > 0">
    <h3 class="title is-5 mb-2">{{ errorToDisplay }}</h3>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quibusnam praeteritis? At
      multis se probavit. Quoniam, si dis placet, ab Epicuro loqui discimus. Et ille
      ridens.
    </p>
  </VCard>
  <FormLayout
    v-else
    :component-dependencies="componentDependencies"
  />
</template>