<script setup lang="ts">

  import API_URLs from '/@src/utils/api/urls'

  import { provide } from 'vue'
  import { useHead } from '@vueuse/head'
  import { useViewWrapper } from '/@src/stores/viewWrapper'
  import { useMatterSchemas } from '/@src/utils/app/CRUD/mattersCache'

  import { useHandleInstance } from '/@src/stores/handleInstance'
  import { useQueryParam } from '/@src/stores/queryParam'
  import { useModelSchemas } from '/@src/utils/app/CRUD/modelCache'

  import {
    deleteCurrentInstance,
    updateCurrentInstance,
    generateColumns,
  } from '/@src/utils/app/shared/helpers'

  import {
    createNewInstance,
    getInstances,
    updateInstanceDetailsRequest,
    getInstanceDetails,
    deleteInstanceRequest,
    getInstanceSchemas as schemasFunction,
  } from '/@src/utils/api/modelApiCallFunctions'

  const endpointUrl = API_URLs.MATTERS
  provide("endpointUrl", endpointUrl)

  const renderLoading = ref(true)

  let createModelSchema;
  let updateModelSchema;
  let filtersModelSchema;
  let sortingModelSchema;
  let updateMethod;
  let columns;
  let toShow;
  let modelPk;

  onMounted(async () => {
    const {
      createSchema,
      updateSchema,
      filtersSchema,
      sortingSchema,
      updateAllowedMethod,
      lookupField,
      listingColumns,
    } = await useModelSchemas(endpointUrl, schemasFunction, 'Matter')

    createModelSchema  = createSchema
    updateModelSchema  = updateSchema
    filtersModelSchema = filtersSchema
    sortingModelSchema = sortingSchema
    updateMethod       = updateAllowedMethod
    toShow             = listingColumns
    modelPk            = lookupField
    columns            = generateColumns(createSchema, sortingSchema, toShow)

    renderLoading.value = false
  })

  const handleInstance = useHandleInstance()
  const queryParam     = useQueryParam()

  const viewWrapper = useViewWrapper()
  viewWrapper.setPageTitle('Matters')

  useHead({
    title: 'Lex Algeria - Matters',
  })
</script>

<template>
  <div class="page-content-inner">
    <div class="column is-12">
      <FlexListV1
        v-if="!renderLoading"
        :columns="columns"

        :model-pk="modelPk"
        :fetch-instances-function="getInstances"
        :update-current-instance-function="updateCurrentInstance"
        :delete-current-instance-function="deleteCurrentInstance">
        <template #createInstanceSlot>
          <CreateInstanceComponent
            :request-function="createNewInstance"
            :formSchema="createModelSchema"
            modal-title="Create New Record"
            @handle-create-instance-affect="handleInstance.handleInstanceCreationAffect"
          />
        </template>
        <template #viewInstanceSlot>
          <ViewInstanceComponent
            :request-function="getInstanceDetails"
            modal-title="Record Details"
          />
        </template>
        <template #updateInstanceSlot>
          <UpdateInstanceComponent
            :request-function="updateInstanceDetailsRequest"
            :form-schema="updateModelSchema"
            :instance-details-function="getInstanceDetails"
            :update-allowed-method="updateMethod"
            modal-title="Update Record"
            @handle-update-instance-affect="handleInstance.handleInstanceUpdateAffect"
          />
        </template>
        <template #deleteInstanceSlot>
          <DeleteInstanceComponent
            :request-function="deleteInstanceRequest"
            modal-title="Delete Record"
            @handle-delete-instance-affect="handleInstance.handleInstanceDeleteAffect"
          />
        </template>
        <template #filterInstancesSlot>
          <FilterListComponent
            :form-schema="filtersModelSchema"
            modal-title="Filter Records"
            @filter-list="(filters) => queryParam.filtersTerm = filters"
          />
        </template>
      </FlexListV1>
    </div>
  </div>
</template>
