<script setup lang="ts">
  import { useHead } from '@vueuse/head'
  import { useViewWrapper } from '/@src/stores/viewWrapper'
  import { useCreateClientSchema, useUpdateClientSchema } from '/@src/utils/app/CRUD/clientsCache'

  import {
    deleteCurrentClient,
    updateCurrentClient,
  } from '/@src/utils/app/CRUD/helpers'

  import {
    createNewClient,
    getClients,
    updateClientDetailsRequest,
    getClientDetails,
    deleteClientRequest,
  } from '/@src/utils/api/clients'

  const email = "user.email"

  const columns = {
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

  const filtersFormSchema = [
    {
      name: 'username',
      id: 'user__username',
      placeholder: 'username',
      as: 'input',
      type: 'text',
    },
    {
      name: 'first_name',
      id: 'user__first_name',
      placeholder: 'first_name',
      as: 'input',
      type: 'text',
    },
    {
      name: 'last_name',
      id: 'user__last_name',
      placeholder: 'last_name',
      as: 'input',
      type: 'text',
    },
  ]

  const defaultFilters    = "user__username=&user__first_name=&user__last_name="

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
        :filters-form-schema="filtersFormSchema"
        :default-filters="defaultFilters"

        :fetch-instances-function="getClients"
        :create-instance-form-schema-function="useCreateClientSchema"
        :update-instance-form-schema-function="useUpdateClientSchema"
        :update-current-instance-function="updateCurrentClient"
        :delete-current-instance-function="deleteCurrentClient"
        :create-new-instance-function="createNewClient"
        :update-instance-details-function="updateClientDetailsRequest"
        :get-instance-details-function="getClientDetails"
        :delete-instance-function="deleteClientRequest"
      />
    </div>
  </div>
</template>