<script setup lang="ts">

  import { useI18n } from 'vue-i18n'
  import { useHead } from '@vueuse/head'
  import { useViewWrapper } from '/@src/stores/viewWrapper'
  import { useCreateClientSchema, useUpdateClientSchema } from '/@src/utils/app/CRUD/clientsCache'

  import { useFilterClientsSchema } from '/@src/utils/app/CRUD/filters'
  import { useHandleInstance } from '/@src/stores/handleInstance'
  import { useQueryParam } from '/@src/stores/queryParam'

  import {
    deleteCurrentClient,
    updateCurrentClient,
    generateInitialValues,
    generateValidationSchema,
  } from '/@src/utils/app/CRUD/helpers'

  import {
    createNewClient,
    getClients,
    updateClientDetailsRequest,
    getClientDetails,
    deleteClientRequest,
  } from '/@src/utils/api/clients'

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

  let creationFormSchema = undefined
  let createInstanceValidationSchema = undefined
  let createInstanceInitialValues = undefined
  let filtersFormSchema = undefined

  onMounted(async () => {

    creationFormSchema             = await useCreateClientSchema()
    createInstanceValidationSchema = generateValidationSchema(creationFormSchema, t)
    createInstanceInitialValues    = generateInitialValues({}, creationFormSchema)

    filtersFormSchema              = await useFilterClientsSchema()
  })

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
        :columns="columns"

        :fetch-instances-function="getClients"
        :update-current-instance-function="updateCurrentClient"
        :delete-current-instance-function="deleteCurrentClient"
      >
        <template #createInstanceSlot>
          <CreateInstanceComponent
            :validation-schema="createInstanceValidationSchema"
            :initial-values="createInstanceInitialValues"
            :request-function="createNewClient"
            :formSchema="creationFormSchema"
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
            :form-schema-function="useUpdateClientSchema"
            :instance-details-function="getClientDetails"
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
            :formSchema="filtersFormSchema"
            modal-title="Filter Records"
            @filter-list="(filters) => queryParam.filtersTerm = filters"
          />
        </template>
      </FlexListV1>
    </div>
  </div>
</template>