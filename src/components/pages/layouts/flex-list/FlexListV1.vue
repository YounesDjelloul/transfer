<script setup lang="ts">

  import { toRaw } from 'vue';

  import { convertObjectToFilterString } from '/@src/utils/app/CRUD/filters'
  import { FormatingOrderingParam } from '/@src/utils/app/CRUD/sorts'
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

  import { z as zod } from 'zod'
  import { useI18n } from 'vue-i18n'
  import { useNotyf } from '/@src/composable/useNotyf'

  const notyf  = useNotyf()
  const { t }  = useI18n()
  const router = useRouter()
  const route  = useRoute()

  const columns = {
    created_by_id: {
      label: 'Created By Id',
      sortable: true,
    },
    username: 'Username',
    user_id: {
      label: 'User Id',
      sortable: true,
    },
    person_type: 'Person Type',
    user_ip: 'Ip',
    actions: {
      label: 'Actions',
      align: 'end',
    },
  } as const

  const createClientValidationSchema = zod.object({
    person_type: zod
      .string()
      .min(1, t('auth.errors.person_type.required')),
    user: zod.object({
      username: zod
      .string({
        required_error: t('auth.errors.username.required'),
      })
      .min(8, t('auth.errors.username.length')),
      email: zod
        .string({
          required_error: t('auth.errors.email.required'),
        })
        .min(8, t('auth.errors.email.format')),
    })
  })

  const creationFormSchema = await useCreateClientSchema()


  const updateClientValidationSchema = zod.object({
    legal_name: zod
      .string({
        required_error: t('auth.errors.username.required'),
      })
      .nullable(),
    legal_form: zod
      .string({
        required_error: t('auth.errors.username.required'),
      })
      .nullable(),
    person_type: zod
      .string({
        required_error: t('auth.errors.username.required'),
      })
      .nullable(),
    website: zod
      .string({
        required_error: t('auth.errors.username.required'),
      })
      .nullable(),
    licence: zod
      .string({
        required_error: t('auth.errors.username.required'),
      })
      .nullable(),
  })

  let updateFormSchema = undefined


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

  const defaultLimit     = ref(20)
  const totalClients     = ref(0)
  const currentReload    = ref(false)

  function useQueryParam() {

    const defaultPage    = 1
    const defaultSearch  = ''
    const defaultFilters = "user__username=&user__first_name=&user__last_name=&person_type="
    const defaultSort    = ''

    const searchTerm = computed({
      get() {
        return route.query.search ? route.query.search : defaultSearch
      },
      set(value) {
        router.push({
          query: {
            search: value === defaultSearch ? undefined : value,
            filter: filtersTerm.value === defaultFilters ? undefined : filtersTerm.value,
            page: page.value === defaultPage ? undefined : page.value,
            sort: sort.value === defaultSort ? undefined : sort.value,
          },
        })
      },
    })

    const filtersTerm = computed({
      get() {
        return route.query.filter
      },
      set(value) {
        const result = convertObjectToFilterString(value)
        router.push({
          query: {
            filter: result === defaultFilters ? undefined : result,
            search: searchTerm.value === defaultSearch ? undefined : searchTerm.value,
            page: page.value === defaultPage ? undefined : page.value,
            sort: sort.value === defaultSort ? undefined : sort.value,
          },
        })
      },
    })

    const sort = computed({
      get() {
        return route.query.sort ? route.query.sort : defaultSort
      },
      set(value) {
        router.push({
          query: {
            sort: value === defaultSort ? undefined : value,
            page: page.value === defaultPage ? undefined : page.value,
            filter: filtersTerm.value === defaultFilters ? undefined : filtersTerm.value,
            search: searchTerm.value === defaultSearch ? undefined : searchTerm.value,
          },
        })
      }
    })

    const page = computed({
      get() {
        return route.query.page ? parseInt(route.query.page) : defaultPage
      },
      set(value) {
        router.push({
          query: {
            page: value === defaultPage ? undefined : value,
            filter: filtersTerm.value === defaultFilters ? undefined : filtersTerm.value,
            search: searchTerm.value === defaultSearch ? undefined : searchTerm.value,
            sort: sort.value === defaultSort ? undefined : sort.value,
          },
        })
      },
    })

    const reload = computed({
      
      get() {
        return currentReload.value
      },
      set(value) {
        currentReload.value = value
      },
    })

    return reactive({
      page,
      searchTerm,
      filtersTerm,
      sort,
      reload,
    })
  }

  const queryParam = useQueryParam()

  let status            = undefined
  let currentStateData  = undefined
  const operatedClient  = ref()

  const fetchClients = async() => {

    const { page, searchTerm, filtersTerm, sort, reload } = queryParam

    if (status) {

      let result = toRaw(currentStateData)
      
      switch (status) {
        case 'delete':
          result = result.filter(deleteCurrentClient, clientToDeleteId)
          break;
        case 'update':
          result.forEach(updateCurrentClient, [clientToUpdateId, operatedClient])
          break;
        case 'create':
          result.unshift(toRaw(operatedClient.value))
          break;
      }

      status = undefined
      return result
    }

    const pageQuery = `page=${page}`
    let sortQuery   = ''
    let searchFilterQuery = ''

    if (searchTerm) {
      searchFilterQuery = `search=${searchTerm}&`
    } else if (filtersTerm) {
      searchFilterQuery = `${filtersTerm}&`
    }

    if (sort) {
      const formattedSort = FormatingOrderingParam(sort)
      sortQuery = `ordering=${formattedSort}&`
    }

    const endpointRoute  = `?${sortQuery}${searchFilterQuery}${pageQuery}`
    const { results, count } = await getClients(endpointRoute)
    
    totalClients.value  = count
    return results
  }

  const showCreateClientPopup       = ref(false)
  const showDeleteClientPopup       = ref(false)
  const showViewClientDetailsPopup  = ref(false)
  const showUpdateClientPopup       = ref(false)
  const showFilterClientsPopup      = ref(false)

  const clientToUpdate   = ref()

  let clientToUpdateId = undefined
  let clientToDeleteId = undefined
  let clientToViewId   = undefined

  async function getUpdateClientDetailsPopup(clientId, stateData) {
    clientToUpdateId            = clientId
    currentStateData            = stateData
    updateFormSchema            = await useUpdateClientSchema(clientId)
    clientToUpdate.value        = await getClientDetails(clientId)
    showUpdateClientPopup.value = true
  }

  function getCreateClientPopup(stateData) {
    currentStateData       = stateData
    showCreateClientPopup.value = true
  }

  function getDeleteClientPopup(clientId, stateData) {
    clientToDeleteId            = clientId
    currentStateData            = stateData
    showDeleteClientPopup.value = true
  }

  function getViewClientDetailsPopup(clientId) {
    clientToViewId                   = clientId
    showViewClientDetailsPopup.value = true
  }

  function reload(operation) {
    status = operation
    queryParam.reload = !currentReload.value
  }

  function handleClientCreationAffect(data) {

    notyf.dismissAll()
    notyf.success("Client Created Successfully!")

    showCreateClientPopup.value = false
    operatedClient.value        = data
    reload('create')
  }

  function handleClientUpdateAffect(data) {

    notyf.dismissAll()
    notyf.success("Client Updated Successfully!")

    showUpdateClientPopup.value = false
    operatedClient.value        = data
    reload('update')
  }

  function handleClientDeleteAffect() {

    notyf.dismissAll()
    notyf.success("Client Deleted Successfully!")

    showDeleteClientPopup.value = false
    reload('delete')
  }

</script>

<template>
  <div>
    <VFlexTableWrapper
      v-model:page="queryParam.page"
      v-model:sort="queryParam.sort"
      :limit="defaultLimit"
      :columns="columns"
      :data="fetchClients"
      :total="totalClients"
    >
      <template #default="wrapperState">
        <VFlexTableToolbar>
          <template #left>
            <VField>
              <VControl icon="feather:search">
                <input
                  v-model="queryParam.searchTerm"
                  type="text"
                  class="input is-rounded"
                  placeholder="Search"
                />
              </VControl>
            </VField>
          </template>

          <template #right>
            <VButtons>
              <VButton @click="showFilterClientsPopup=true" color="primary" icon="feather:settings" outlined> Filters
              </VButton>
              <VButton @click="getCreateClientPopup(wrapperState.data)" color="primary" icon="feather:plus"> Add User
              </VButton>
            </VButtons>
          </template>
        </VFlexTableToolbar>

        <CreateInstanceComponent
          v-if="showCreateClientPopup"
          :validation-schema="createClientValidationSchema"
          :request-function="createNewClient"
          :formSchema="creationFormSchema"
          modal-title="Create New Client"
          @hide-popup="showCreateClientPopup=false"
          @handle-create-instance-affect="handleClientCreationAffect"
        />

        <ViewInstanceComponent
          v-if="showViewClientDetailsPopup"
          :instance-id="clientToViewId"
          :request-function="getClientDetails"
          modal-title="Client Details"
          @hide-popup="showViewClientDetailsPopup=false"
        />

        <UpdateInstanceComponent
          v-if="showUpdateClientPopup"
          :validation-schema="updateClientValidationSchema"
          :request-function="updateClientDetailsRequest"
          :instance-details="clientToUpdate"
          :form-schema="updateFormSchema"
          :instance-id="clientToUpdateId"
          modal-title="Update Client"
          @hide-popup="showUpdateClientPopup=false"
          @handle-update-instance-affect="handleClientUpdateAffect"
        />

        <DeleteInstanceComponent
          v-if="showDeleteClientPopup"
          :request-function="deleteClientRequest"
          :instance-id="clientToDeleteId"
          modal-title="Delete Client"
          @hide-popup="showDeleteClientPopup=false"
          @handle-delete-instance-affect="handleClientDeleteAffect"
        />

        <FilterListComponent
          v-if="showFilterClientsPopup"
          :formSchema="filtersFormSchema"
          modal-title="Filter Clients"
          @hide-popup="showFilterClientsPopup=false"
          @filter-list="(filters) => queryParam.filtersTerm = filters"
        />

        <VFlexTable rounded>
          <template #body>
            <div v-if="wrapperState.loading" class="flex-list-inner">
              <div v-for="key in wrapperState.limit" :key="key" class="flex-table-item">
                <VFlexTableCell>
                  <VPlaceload/>
                </VFlexTableCell>
              </div>
            </div>

            <div v-else-if="wrapperState.total === 0" class="flex-list-inner">
              <VPlaceholderSection
                title="No matches"
                subtitle="There is no clients founds."
                class="my-6"
              >
                <template #image>
                  <img
                    class="light-image"
                    src="/@src/assets/illustrations/placeholders/search-4.svg"
                    alt=""
                  />
                  <img
                    class="dark-image"
                    src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
                    alt=""
                  />
                </template>
              </VPlaceholderSection>
            </div>
          </template>

          <template #body-cell="{ row, column }">
            <template v-if="column.key == 'created_by_id'">
              <VFlexTableCell>
                <span>{{ row.created_by.id }}</span>
              </VFlexTableCell>
            </template>
            <template v-if="column.key == 'username'">
              <VFlexTableCell>
                <span>{{ row.user.username }}</span>
              </VFlexTableCell>
            </template>
            <template v-if="column.key == 'user_id'">
              <VFlexTableCell>
                <span>{{ row.user.id }}</span>
              </VFlexTableCell>
            </template>
            <template v-if="column.key == 'person_type'">
              <VFlexTableCell>
                <span>{{ row.person_type }}</span>
              </VFlexTableCell>
            </template>
            <template v-if="column.key == 'user_ip'">
              <VFlexTableCell>
                <span>{{ row.user.ip }}</span>
              </VFlexTableCell>
            </template>
            <template v-if="column.key == 'actions'">
              <FlexTableDropdown
                @view-detail="getViewClientDetailsPopup(row.user.id)"
                @update-details="getUpdateClientDetailsPopup(row.user.id, wrapperState.data)"
                @delete-client="getDeleteClientPopup(row.user.id, wrapperState.data)"
              />
            </template>
          </template>
        </VFlexTable>

        <VFlexPagination
          v-model:current-page="wrapperState.page"
          :item-per-page="wrapperState.limit"
          :total-items="wrapperState.total"
          :max-links-displayed="5"
          no-router
        />
      </template>
    </VFlexTableWrapper>
  </div>
</template>

<style lang="scss">
  @import '/@src/scss/abstracts/all';
  @import '/@src/scss/components/forms-outer';
  .view-container {
    margin: 20px;
    .view-section {
      .delete-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .content {
          font-family: var(--font-alt);
          font-weight: 600;
          color: var(--dark-text);
        }
      }
      .view-section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--fade-grey-dark-4);
        padding-bottom: 20px;
        margin-bottom: 30px;
        border-color: var(--dark-sidebar-light-12);
        .content {
          font-family: var(--font-alt);
          font-weight: 600;
          color: var(--dark-text);
        }
      }
      .view-section-info {
        font-family: var(--font);
        font-size: .9rem;
        color: var(--light-text)!important;
        font-weight: 400;
        margin-bottom: 15px;
        span:last-child {
          float: right;
        }
      }
      .view-section-info:last-child {
        margin-bottom: 0px;
      }
    }
  }
  .has-top-nav {
    .flex-list-wrapper,
    .list-flex-toolbar {
      max-width: 880px;
      margin-right: auto;
      margin-left: auto;
    }
  }
</style>