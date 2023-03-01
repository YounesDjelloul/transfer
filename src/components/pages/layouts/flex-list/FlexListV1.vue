<script setup lang="ts">

  import { getAllClients } from '/@src/utils/api/clients'

  const router = useRouter()
  const route  = useRoute()

  const defaultLimit   = ref(20)
  const totalClients   = ref()

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

  function useQueryParam() {

    const defaultPage = 1

    const page = computed({

      get() {
        return route.query.page ? parseInt(route.query.page) : defaultPage
      },

      set(value) {
        router.push({
          query: {
            page: value === defaultPage ? undefined : value
          },
        })
      },
    })

    return reactive({
      page,
    })
  }

  const queryParam = useQueryParam()

  const fetchClients = async() => {

    const currentPage = queryParam.page
    const response = await getAllClients(`?page=${currentPage}`)

    totalClients.value = response.count
    return response.results
  }

  const showCreateClientPopup       = ref(false)
  const showDeleteClientPopup       = ref(false)
  const showViewClientDetailsPopup  = ref(false)
  const showUpdateClientPopup       = ref(false)

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
                  v-model="wrapperState.searchInput"
                  type="text"
                  class="input is-rounded"
                  placeholder="Filter..."
                />
              </VControl>
            </VField>
          </template>

          <template #right>
            <VButtons>
              <VButton @click="showCreateClientPopup=true" color="primary" icon="feather:plus" elevated> Add User </VButton>
            </VButtons>
          </template>
        </VFlexTableToolbar>

        <CreateClientComponent
          v-if="showCreateClientPopup"
          @hideCreateClientPopup="showCreateClientPopup=false"
        />

        <UpdateClientComponent
          v-if="showUpdateClientPopup" :clientId="clientToUpdateId" 
          @hideUpdateClientDetailsPopup="showUpdateClientPopup=false"
        />

        <DeleteClientComponent
          v-if="showDeleteClientPopup" :clientId="clientToDeleteId"
          @hideDeleteClientPopup="showDeleteClientPopup=false"
        />

        <ViewClientComponent
          v-if="showViewClientDetailsPopup" :clientId="clientToViewId"
          @hideViewClientPopup="showViewClientDetailsPopup=false"
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
