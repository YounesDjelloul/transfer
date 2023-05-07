<script setup lang="ts">

  import { useI18n } from 'vue-i18n'
  import { useHead } from '@vueuse/head'
  import { useViewWrapper } from '/@src/stores/viewWrapper'
  import { useClientSchemas } from '/@src/utils/app/CRUD/clientsCache'

  import { useHandleInstance } from '/@src/stores/handleInstance'
  import { useQueryParam } from '/@src/stores/queryParam'

  import {
    deleteCurrentInstance,
    updateCurrentInstance,
    generateColumns,
  } from '/@src/utils/app/shared/helpers'

  import {
    createNewClient,
    getClients,
    updateClientDetailsRequest,
    getClientDetails,
    deleteClientRequest,
  } from '/@src/utils/api/clients'

  const renderLoading = ref(true)

  let createSchema;
  let updateSchema;
  let filtersSchema;
  let sortingSchema;
  let updateMethod;
  let columns;
  let toShow;

  onMounted(async () => {
    const { createClientSchema, updateClientSchema, filtersClientSchema, sortingClientSchema, updateAllowedMethod } = await useClientSchemas()

    createSchema  = createClientSchema
    updateSchema  = updateClientSchema
    filtersSchema = filtersClientSchema
    sortingSchema = sortingClientSchema
    updateMethod  = updateAllowedMethod
    toShow        = sortingClientSchema
    columns       = generateColumns(createClientSchema, sortingClientSchema, toShow)
    
    renderLoading.value = false
  })

  const handleInstance = useHandleInstance()
  const queryParam     = useQueryParam()

  const viewWrapper = useViewWrapper()
  viewWrapper.setPageTitle('Clients')

  useHead({
    title: 'Lex Algeria - Clients',
  })
</script>

<template>
  <div class="page-content-inner">
    <div class="column is-12">
      <FlexListV1
        v-if="!renderLoading"
        :columns="columns"

        :fetch-instances-function="getClients"
        :update-current-instance-function="updateCurrentInstance"
        :delete-current-instance-function="deleteCurrentInstance">
        <template #createInstanceSlot>
          <CreateInstanceComponent
            :request-function="createNewClient"
            :formSchema="createSchema"
            modal-title="Create New Record"
            @handle-create-instance-affect="handleInstance.handleInstanceCreationAffect"
          />
        </template>
        <template #viewInstanceSlot>
          <ViewInstanceComponent
            :request-function="getClientDetails"
            modal-title="Record Details"
          />
        </template>
        <template #updateInstanceSlot>
          <UpdateInstanceComponent
            :request-function="updateClientDetailsRequest"
            :form-schema="updateSchema"
            :instance-details-function="getClientDetails"
            :update-allowed-method="updateMethod"
            modal-title="Update Record"
            @handle-update-instance-affect="handleInstance.handleInstanceUpdateAffect"
          />
        </template>
        <template #deleteInstanceSlot>
          <DeleteInstanceComponent
            :request-function="deleteClientRequest"
            modal-title="Delete Record"
            @handle-delete-instance-affect="handleInstance.handleInstanceDeleteAffect"
          />
        </template>
        <template #filterInstancesSlot>
          <FilterListComponent
            :form-schema="filtersSchema"
            modal-title="Filter Records"
            @filter-list="(filters) => queryParam.filtersTerm = filters"
          />
        </template>
      </FlexListV1>
    </div>
  </div>
</template>