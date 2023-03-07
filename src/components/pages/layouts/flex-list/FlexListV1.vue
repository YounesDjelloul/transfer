<script setup lang="ts">

  import { getClients } from '/@src/utils/api/clients'
  import { convertObjectToFilterString } from '/@src/utils/app/dashboard/filters'
  import { FormatingOrderingParam } from '/@src/utils/app/dashboard/sorts'

  const router = useRouter()
  const route  = useRoute()

  const defaultLimit = ref(20)
  const totalClients = ref(0)
<<<<<<< HEAD
=======
  const load         = ref(false)
>>>>>>> 43a392c5ed08d7e077cebac7106f11a0925a20de

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

  function useQueryParam() {

    const defaultPage    = 1
    const defaultSearch  = ''
    const defaultFilters = "user__username=&user__firstname=&user__lastname=&person_type="
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

<<<<<<< HEAD
=======
    const total = computed({
      
      get() {
        return totalClients.value
      },

      set(value) {
        totalClients.value = value
      },
    })

>>>>>>> 43a392c5ed08d7e077cebac7106f11a0925a20de
    return reactive({
      page,
      searchTerm,
      filtersTerm,
      sort,
<<<<<<< HEAD
=======
      total,
>>>>>>> 43a392c5ed08d7e077cebac7106f11a0925a20de
    })
  }

  const queryParam = useQueryParam()

  const fetchClients = async() => {

<<<<<<< HEAD
    const { page, searchTerm, filtersTerm, sort } = queryParam

    const pageQuery = `page=${page}`
=======
    const { page, searchTerm, filtersTerm, sort, total } = queryParam

    const pageQuery = `page=${page}`

>>>>>>> 43a392c5ed08d7e077cebac7106f11a0925a20de
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

<<<<<<< HEAD
    totalClients.value = count
=======
    queryParam.total = count
>>>>>>> 43a392c5ed08d7e077cebac7106f11a0925a20de
    return results
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

<<<<<<< HEAD
=======
  function handleOperationAffect(operation) {

    const currentTotal = queryParam.total
    queryParam.total = operation === "+" ? currentTotal + 1 : currentTotal - 1
  }

>>>>>>> 43a392c5ed08d7e077cebac7106f11a0925a20de
</script>

<template>
  <div>
    <VFlexTableWrapper
      v-model:page="queryParam.page"
      v-model:sort="queryParam.sort"
      :limit="defaultLimit"
      :columns="columns"
      :data="fetchClients"
<<<<<<< HEAD
      :total="totalClients"
=======
      :total="queryParam.total"
>>>>>>> 43a392c5ed08d7e077cebac7106f11a0925a20de
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
<<<<<<< HEAD
          </template>
          
          <template #right>
            <VButtons>
              <VButton @click="showFilterClientsPopup=true" color="primary" icon="feather:settings" outlined> Filters
              </VButton>
              <VButton @click="showCreateClientPopup=true" color="primary" icon="feather:plus"> Add User
              </VButton>
            </VButtons>
          </template>
=======
          </template>

          <template #right>
            <VButtons>
              <VButton @click="showFilterClientsPopup=true" color="primary" icon="feather:settings" outlined> Filters
              </VButton>
              <VButton @click="showCreateClientPopup=true" color="primary" icon="feather:plus"> Add User
              </VButton>
            </VButtons>
          </template>
>>>>>>> 43a392c5ed08d7e077cebac7106f11a0925a20de
        </VFlexTableToolbar>

        <CreateClientComponent
          v-if="showCreateClientPopup"
          @hide-create-client-popup="showCreateClientPopup=false"
<<<<<<< HEAD
          @load-clients=""
=======
          @load-clients="handleOperationAffect('+')"
>>>>>>> 43a392c5ed08d7e077cebac7106f11a0925a20de
        />

        <UpdateClientComponent
          v-if="showUpdateClientPopup" :clientId="clientToUpdateId" 
          @hide-update-client-details-popup="showUpdateClientPopup=false"
<<<<<<< HEAD
          @load-clients=""
=======
          @load-clients="handleOperationAffect('+')"
>>>>>>> 43a392c5ed08d7e077cebac7106f11a0925a20de
        />

        <DeleteClientComponent
          v-if="showDeleteClientPopup" :clientId="clientToDeleteId"
          @hide-delete-client-popup="showDeleteClientPopup=false"
<<<<<<< HEAD
          @load-clients=""
=======
          @load-clients="handleOperationAffect('-')"
>>>>>>> 43a392c5ed08d7e077cebac7106f11a0925a20de
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
