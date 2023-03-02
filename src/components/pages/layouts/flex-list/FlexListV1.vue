<script setup lang="ts">

  import { getClients } from '/@src/utils/api/clients'

  const router = useRouter()
  const route  = useRoute()

  const defaultLimit = ref(20)
  const totalClients = ref()

  const columns = {
    created_by: {
      label: 'Created By',
      format: (value) => value.username,
    },
    /*user: {
      label: 'Username',
      format: (value) => value.username,
    },*/
    user: {
      label: 'Email',
      cellClass: 'Email',
      format: (value) => value.email,
    },
    person_type: 'Person Type',
    /*user: {
      label: 'Ip',
      cellClass: 'Ip',
      format: (value) => value.ip,
    },*/
    actions: {
      label: 'Actions',
      align: 'end',
    },
  } as const

  function convertObjectToFilterString(obj) {

    let result = '?'

    for (const key in obj) {
      result += `${key}=${obj[key]}&`
    }

    return result.slice(0, -1)
  }

  function useQueryParam() {

    const defaultPage    = 1
    const defaultSearch  = ''
    const defaultFilters = "?user__username=&user__firstname=&user__lastname=&person_type="
    let loading          = false

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
          },
        })
      },
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
          },
        })
      },
    })

    return reactive({
      page,
      searchTerm,
      filtersTerm,
    })
  }

  const queryParam = useQueryParam()

  const fetchClients = async() => {

    const filtersTerm = queryParam.filtersTerm
    const searchTerm  = queryParam.searchTerm
    const currentPage = queryParam.page

    if (searchTerm) {
      
      const response = await getClients(`?search=${searchTerm}`)

      totalClients.value = response.count
      return response.results  
    }

    if (filtersTerm) {

      const response    = await getClients(filtersTerm)

      totalClients.value = response.count
      return response.results
    }

    const response = await getClients(`?page=${currentPage}`)

    totalClients.value = response.count
    return response.results
  }

  const showCreateClientPopup       = ref(false)
  const showDeleteClientPopup       = ref(false)
  const showViewClientDetailsPopup  = ref(false)
  const showUpdateClientPopup       = ref(false)
  const showFilterClientsPopup      = ref(false)

  const clientToUpdateId = ref()
  const clientToDeleteId = ref()
  const clientToViewId   = ref()

  async function getUpdateClientDetailsPopup(clientId) {

    clientToUpdateId.value      = clientId
    showUpdateClientPopup.value = true
  }

  async function getDeleteClientPopup(clientId) {

    clientToDeleteId.value      = clientId
    showDeleteClientPopup.value = true
  }

  async function getViewClientDetailsPopup(clientId) {

    clientToViewId.value             = clientId
    showViewClientDetailsPopup.value = true
  }

</script>

<template>
  <div>
    <VFlexTableWrapper 
      v-model:page="queryParam.page"
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
              <VButton @click="showCreateClientPopup=true" color="primary" icon="feather:plus"> Add User
              </VButton>
            </VButtons>
          </template>
        </VFlexTableToolbar>

        <CreateClientComponent
          v-if="showCreateClientPopup"
          @hide-create-client-popup="showCreateClientPopup=false"
          @load-clients=""
        />

        <UpdateClientComponent
          v-if="showUpdateClientPopup" :clientId="clientToUpdateId" 
          @hide-update-client-details-popup="showUpdateClientPopup=false"
        />

        <DeleteClientComponent
          v-if="showDeleteClientPopup" :clientId="clientToDeleteId"
          @hide-delete-client-popup="showDeleteClientPopup=false"
        />

        <ViewClientComponent
          v-if="showViewClientDetailsPopup" :clientId="clientToViewId"
          @hide-view-client-popup="showViewClientDetailsPopup=false"
        />

        <FilterClientsComponent
          v-if="showFilterClientsPopup"
          @hide-filter-clients-popup="showFilterClientsPopup=false"
          @filter-clients="(filters) => queryParam.filtersTerm = filters"
        />

        <div>{{ wrapperState.filterInput }}</div>

        <VFlexTable rounded>
          <template #body>
            <div v-if="wrapperState.loading" class="flex-list-inner">
              <div v-for="key in wrapperState.limit" :key="key" class="flex-table-item">
                <VFlexTableCell>
                  <VPlaceload/>
                </VFlexTableCell>
              </div>
            </div>
          </template>

          <template #body-cell="{ row, column }">
            <template v-if="column.key == 'actions'">
              <FlexTableDropdown
                @view-detail="getViewClientDetailsPopup(row.user.id)"
                @update-details="getUpdateClientDetailsPopup(row.user.id)"
                @delete-client="getDeleteClientPopup(row.user.id)"
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
