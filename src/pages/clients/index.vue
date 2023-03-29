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

  const columns = {
    id: {
      label: 'Id',
      sortable: true,
    },
    user__email: {
      label: 'Email',
      grow: true,
    },
    user__username: {
      label: 'Username',
      sortable: true,
    },
    user__first_name: {
      label: 'Firstname',
      sortable: true,
    },
    user__last_name: {
      label: 'Lastname',
      sortable: true,
    },
    actions: {
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
    {
      name: 'person_type',
      id: 'person_type',
      placeholder: 'person_type',
      as: 'select',
      options: {
        M: 'Moral Person',
        P: 'Physical Person',
      },
    },
  ]

  const defaultFilters    = "user__username=&user__first_name=&user__last_name=&person_type="

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