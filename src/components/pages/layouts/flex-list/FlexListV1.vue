<script setup lang="ts">

  import { getAllClients } from '/@src/utils/api/clients'

  const route = useRoute()

  const response = await getAllClients("?page="+1)
  const clients  = ref(response.results)

  const showCreateClientPopup       = ref(false)
  const showDeleteClientPopup       = ref(false)
  const showViewClientDetailsPopup  = ref(false)
  const showUpdateClientPopup       = ref(false)

  const clientsCount = response.count
  const maxLength    = 20
  const filters      = ref('')

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

  const columns = {
    creator: 'Creator',
    username: 'Username',
    email: 'Email',
    person_type: 'Person Type',
    ip: 'IP Address',
    actions: {
      label: 'Actions',
      align: 'end',
    },
  } as const

  const currentPage = computed({
    
    get() {
      return route.query.page ? parseInt(route.query.page) : 1
    },

    async set(value) {
      const response = await getAllClients("?page="+value)
      clients.value  = response.results
    }
  })

</script>

<template>
  <div>
    <VFlexTableWrapper :columns="columns" :data="clients">
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
            <TransitionGroup name="list" tag="div" class="flex-list-inner">
              <!--Table item-->
              <div v-for="client in clients" :key="client.user.id" class="flex-table-item">
                <VFlexTableCell>
                  <span class="light-text">{{ client.created_by.username }}</span>
                </VFlexTableCell>
                <VFlexTableCell>
                  <span class="light-text">{{ client.user.username }}</span>
                </VFlexTableCell>
                <VFlexTableCell>
                  <span class="light-text">{{ client.user.email }}</span>
                </VFlexTableCell>
                <VFlexTableCell>
                  <span class="light-text" v-if="client.person_type === 'M'">
                    Moral Person
                  </span>
                  <span class="light-text" v-if="client.person_type === 'P'">
                    Physical Person
                  </span>
                </VFlexTableCell>
                <VFlexTableCell>
                  <span class="light-text">{{ client.user.ip }}</span>
                </VFlexTableCell>
                <VFlexTableCell :column="{ align: 'end' }">
                  <FlexTableDropdown
                    @view-detail="getViewClientDetailsPopup(client.user.id)"
                    @update-details="getUpdateClientDetailsPopup(client.user.id)"
                    @delete-client="getDeleteClientPopup(client.user.id)"
                  />
                </VFlexTableCell>
              </div>
            </TransitionGroup>
          </template>
        </VFlexTable>

        <VFlexPagination
          v-model:current-page="currentPage"
          :item-per-page="maxLength"
          :total-items="clientsCount"
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
