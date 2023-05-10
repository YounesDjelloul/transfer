<script setup lang="ts">

  import { useI18n } from 'vue-i18n'
  import { useHead } from '@vueuse/head'
  import { useViewWrapper } from '/@src/stores/viewWrapper'

  import { useHandleInstance } from '/@src/stores/handleInstance'
  import { useQueryParam } from '/@src/stores/queryParam'
  import { useModelSchemas } from '/@src/utils/app/CRUD/modelCache'

  import {
    deleteCurrentInstance,
    updateCurrentInstance,
    generateColumns,
  } from '/@src/utils/app/shared/helpers'

  import {
    createNewCompany,
    getCompanies,
    updateCompanyDetailsRequest,
    getCompanyDetails,
    deleteCompanyRequest,
    getCompanySchemas as schemasFunction,
  } from '/@src/utils/api/companies'

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
    const { createSchema, updateSchema, filtersSchema, sortingSchema, updateAllowedMethod, lookupField } = await useModelSchemas(schemasFunction, 'Company')

    createModelSchema  = createSchema
    updateModelSchema  = updateSchema
    filtersModelSchema = filtersSchema
    sortingModelSchema = sortingSchema
    updateMethod       = updateAllowedMethod
    toShow             = sortingSchema
    modelPk            = lookupField
    columns            = generateColumns(createSchema, sortingSchema, toShow)
    
    renderLoading.value = false
  })

  const handleInstance = useHandleInstance()
  const queryParam     = useQueryParam()

  const viewWrapper = useViewWrapper()
  viewWrapper.setPageTitle('Companies')

  useHead({
    title: 'Lex Algeria - Companies',
  })
</script>

<template>
  <div class="page-content-inner">
    <div class="column is-12">
      <FlexListV1
        v-if="!renderLoading"
        :columns="columns"

        :model-pk="modelPk"
        :fetch-instances-function="getCompanies"
        :update-current-instance-function="updateCurrentInstance"
        :delete-current-instance-function="deleteCurrentInstance">
        <template #createInstanceSlot>
          <CreateInstanceComponent
            :request-function="createNewCompany"
            :formSchema="createModelSchema"
            modal-title="Create New Record"
            @handle-create-instance-affect="handleInstance.handleInstanceCreationAffect"
          />
        </template>
        <template #viewInstanceSlot>
          <ViewInstanceComponent
            :request-function="getCompanyDetails"
            modal-title="Record Details"
          />
        </template>
        <template #updateInstanceSlot>
          <UpdateInstanceComponent
            :request-function="updateCompanyDetailsRequest"
            :form-schema="updateModelSchema"
            :instance-details-function="getCompanyDetails"
            :update-allowed-method="updateMethod"
            modal-title="Update Record"
            @handle-update-instance-affect="handleInstance.handleInstanceUpdateAffect"
          />
        </template>
        <template #deleteInstanceSlot>
          <DeleteInstanceComponent
            :request-function="deleteCompanyRequest"
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
