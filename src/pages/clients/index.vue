<script setup lang="ts">
  import { useHead } from '@vueuse/head'
  import { useViewWrapper } from '/@src/stores/viewWrapper'
  import { useCreateClientSchema, useUpdateClientSchema } from '/@src/utils/app/CRUD/clientsCache'

  import { useFilterClientsSchema } from '/@src/utils/app/CRUD/filters'

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
        :filter-instances-form-schema-function="useFilterClientsSchema"
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