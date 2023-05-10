<script setup lang="ts">

  import { useI18n } from 'vue-i18n'
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
    createNewMatter,
    getMatters,
    updateMatterDetailsRequest,
    getMatterDetails,
    deleteMatterRequest,
    getMatterSchemas as schemasFunction,
  } from '/@src/utils/api/matters'

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
    const { createSchema, updateSchema, filtersSchema, sortingSchema, updateAllowedMethod, lookupField } = await useModelSchemas(schemasFunction, 'Matter')

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
        :fetch-instances-function="getMatters"
        :update-current-instance-function="updateCurrentInstance"
        :delete-current-instance-function="deleteCurrentInstance">
        <template #createInstanceSlot>
          <CreateInstanceComponent
            :request-function="createNewMatter"
            :formSchema="createModelSchema"
            modal-title="Create New Record"
            @handle-create-instance-affect="handleInstance.handleInstanceCreationAffect"
          />
        </template>
        <template #viewInstanceSlot>
          <ViewInstanceComponent
            :request-function="getMatterDetails"
            modal-title="Record Details"
          />
        </template>
        <template #updateInstanceSlot>
          <UpdateInstanceComponent
            :request-function="updateMatterDetailsRequest"
            :form-schema="updateModelSchema"
            :instance-details-function="getMatterDetails"
            :update-allowed-method="updateMethod"
            modal-title="Update Record"
            @handle-update-instance-affect="handleInstance.handleInstanceUpdateAffect"
          />
        </template>
        <template #deleteInstanceSlot>
          <DeleteInstanceComponent
            :request-function="deleteMatterRequest"
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
