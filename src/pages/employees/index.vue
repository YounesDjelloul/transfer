<script setup lang="ts">

  import { useI18n } from 'vue-i18n'
  import { useHead } from '@vueuse/head'
  import { useViewWrapper } from '/@src/stores/viewWrapper'
  import { useEmployeeSchemas } from '/@src/utils/app/CRUD/employeesCache'

  import { useHandleInstance } from '/@src/stores/handleInstance'
  import { useQueryParam } from '/@src/stores/queryParam'

  import {
    deleteCurrentInstance,
    updateCurrentInstance,
  } from '/@src/utils/app/shared/helpers'

  import {
    createNewEmployee,
    getEmployees,
    updateEmployeeDetailsRequest,
    getEmployeeDetails,
    deleteEmployeeRequest,
  } from '/@src/utils/api/employees'

  const columns = {
    user_avatar: {
      id: "user.user_avatar.url",
      label: 'Avatar',
      media: true,
    },
    id: {
      id: "id",
      label: 'Id',
      sortable: true,
    },
    email: {
      id: "user.email",
      label: 'Email',
      grow: true,
    },
    username: {
      id: "user.username",
      label: 'Username',
      sortable: true,
    },
    first_name: {
      id: "user.first_name",
      label: 'Firstname',
      sortable: true,
    },
    last_name: {
      id: "user.last_name",
      label: 'Lastname',
      sortable: true,
    },
    actions: {
      id: "actions",
      label: 'Actions',
      align: 'end',
    },

  } as const

  const { t }  = useI18n()

  const handleInstance = useHandleInstance()
  const queryParam     = useQueryParam()

  let createSchema;
  let updateSchema;
  let filtersSchema;
  let updateMethod;

  onMounted(async () => {

    const { createEmployeeSchema, updateEmployeeSchema, filtersEmployeeSchema, updateAllowedMethod } = await useEmployeeSchemas()
    
    createSchema  = createEmployeeSchema
    updateSchema  = updateEmployeeSchema
    filtersSchema = filtersEmployeeSchema
    updateMethod  = updateAllowedMethod
  })

  const viewWrapper = useViewWrapper()
  viewWrapper.setPageTitle('Employees')

  useHead({
    title: 'Lex Algeria - Employees',
  })
</script>

<template>
  <div class="page-content-inner">
    <div class="column is-12">
      <FlexListV1
        :columns="columns"

        :fetch-instances-function="getEmployees"
        :update-current-instance-function="updateCurrentInstance"
        :delete-current-instance-function="deleteCurrentInstance"
      >
        <template #createInstanceSlot>
          <CreateInstanceComponent
            :request-function="createNewEmployee"
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
            :request-function="updateEmployeeDetailsRequest"
            :form-schema="updateSchema"
            :instance-details-function="getEmployeeDetails"
            :update-allowed-method="updateMethod"
            modal-title="Update Record"
            @handle-update-instance-affect="handleInstance.handleInstanceUpdateAffect"
          />
        </template>
        <template #deleteInstanceSlot>
          <DeleteInstanceComponent
            :request-function="deleteEmployeeRequest"
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