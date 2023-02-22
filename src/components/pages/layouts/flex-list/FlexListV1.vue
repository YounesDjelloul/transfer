<script setup lang="ts">

  import { useForm } from 'vee-validate'
  import { toFormValidator } from '@vee-validate/zod'
  import { z as zod } from 'zod'
  import { useI18n } from 'vue-i18n'
  import { useNotyf } from '/@src/composable/useNotyf'
  import { useUserSession } from '/@src/stores/userSession'

  import { getAllClients, createNewClient, getClientDetail, deleteClientRequest } from '/@src/utils/api/clients'
  
  const notyf       = useNotyf()
  const { t }       = useI18n()
  const userSession = useUserSession()

  const response = await getAllClients() // Requesting All clients from API
  let clients    = response.results


  /*export interface UserData extends VAvatarProps {
    id: number
    username: string
    position: string
    picture: string
    badge: string
    location: string
    industry: string
    status: string
    contacts: VAvatarProps[]
  }*/

  const showNewClientPopup         = ref(false)
  const showViewClientDetailsPopup = ref(false)
  const showDeleteClientPopup      = ref(false)

  const currentPage           = ref(1)
  const filters               = ref('')
  const isLoading             = ref(false)
  const currentClient         = ref()
  const clientDetailsLoading  = ref(false)
  const clientDeletionLoading = ref(false)
  const clientToDelete        = ref()

  const validationSchema = toFormValidator(
    zod.object({
      person_type: zod
        .string({
          required_error: t('auth.errors.username.required'),
        }),
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
        ip: zod
          .string({
            required_error: t('auth.errors.ip.required'),
          })
      })      
    })
  )

  const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
      person_type: '',
      user: {
        username: '',
        email: '',
        ip: ''
      }
    },
  })

  const createClient = handleSubmit(async (values) => {
    if (!isLoading.value) {
      isLoading.value = true

      try {

        const data = await createNewClient(values)

        notyf.dismissAll()
        notyf.success("Client Created Successfully!")

        clients.push(data)
        filteredData.value = clients
        showNewClientPopup.value = false

      } catch (err) {
        notyf.error(err)

      } finally {
        isLoading.value = false
      }
    }
  })

  async function viewClientDetail(clientId) {

    clientDetailsLoading.value = true
    showViewClientDetailsPopup.value = true

    const response      = await getClientDetail(clientId)
    currentClient.value = response.user
    
    clientDetailsLoading.value = false
  }

  async function deleteClient(clientId?) {

    if (showDeleteClientPopup.value) {
      clientDeletionLoading.value = true

      try {
        const response = await deleteClientRequest(clientToDelete.value)
        notyf.dismissAll()
        notyf.success("Client Created Successfully!")

      } catch (error) {
        notyf.error(error)

      } finally {
        clientDeletionLoading.value = false
        showDeleteClientPopup.value = false
      }
    } else {
      showDeleteClientPopup.value = true
      clientToDelete.value  = clientId
    }
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

  const filteredData = computed(() => {
    if (!filters.value) {
      return clients
    } else {
      const filterRe = new RegExp(filters.value, 'i')
      return clients.filter((item) => {
        return (
          item.creator.match(filterRe) ||
          item.username.match(filterRe) ||
          item.email.match(filterRe) ||
          item.person_type.match(filterRe) ||
          item.ip.match(filterRe)
        )
      })
    }
  })
</script>

<template>
  <div>
    <div class="list-flex-toolbar flex-list-v1">
      <VField>
        <VControl icon="feather:search">
          <input
            class="input custom-text-filter"
            placeholder="Search..."
          />
        </VControl>
      </VField>

      <VButtons>
        <VButton @click="showNewClientPopup=true" color="primary" icon="feather:plus" elevated> Add User </VButton>
      </VButtons>
    </div>

    <VModal
      :open="showDeleteClientPopup"
      title="Deleting Details"
      size="meduim"
      actions="right"
      noscroll
      @close="showDeleteClientPopup = false"
    >
      <template #content>
        <VPlaceload v-if="clientDeletionLoading" />
        <div class="view-container" v-else>
          <div class="view-section">
            <div class="delete-header">
              <h3 class="content">Are you sure you want to delete this client?</h3>
            </div>
          </div>
        </div>
      </template>
      <template #action>
        <VButton :loading="isLoading" type="submit" @click="deleteClient" color="danger" raised>Delete</VButton>
      </template>
    </VModal>

    <VModal
      :open="showViewClientDetailsPopup"
      title="Client Details"
      size="meduim"
      actions="right"
      noscroll
      @close="showViewClientDetailsPopup = false"
    >
      <template #content>
        <VPlaceload v-if="clientDetailsLoading" />
        <div class="view-container" v-else>
          <div class="view-section">
            <div class="view-section-header">
              <h3 class="content">User</h3>
            </div>
            <div class='view-section-info' v-for="(value, detail) in currentClient">
              <span>{{ detail }}</span>
              <span>{{ value }}</span>
            </div>
          </div>
        </div>
      </template>
    </VModal>

    <VModal
      :open="showNewClientPopup"
      title="Create New Client"
      size="meduim"
      actions="right"
      noscroll
      @close="showNewClientPopup = false"
    >
      <template #content>
        <form class="modal-form">
          <VField id="user.username" v-slot="{ field }">
            <VControl icon="feather:user">
              <VInput
                type="text"
                :placeholder="t('auth.placeholder.username')"
                autocomplete="name"
              />
              <p v-if="field?.errors?.value?.length" class="help is-danger">
                {{ field.errors?.value?.join(', ') }}
              </p>
            </VControl>
          </VField>
          <VField id="person_type">
            <VControl class="has-icons-left" icon="feather:globe">
              <VSelect>
                <VOption value="">Select a Type</VOption>
                <VOption value="M">Moral Person</VOption>
                <VOption value="P">Physical Person</VOption>
              </VSelect>
            </VControl>
          </VField>
          <VField id="user.email" v-slot="{ field }">
            <VControl icon="feather:mail">
              <VInput
                type="email"
                :placeholder="t('auth.placeholder.email')"
                autocomplete="email"
              />
              <p v-if="field?.errors?.value?.length" class="help is-danger">
                {{ field.errors?.value?.join(', ') }}
              </p>
            </VControl>
          </VField>
          <VField id="user.ip" v-slot="{ field }">
            <VControl icon="feather:user">
              <VInput
                type="text"
                :placeholder="t('auth.placeholder.ip')"
                autocomplete="name"
              />
              <p v-if="field?.errors?.value?.length" class="help is-danger">
                {{ field.errors?.value?.join(', ') }}
              </p>
            </VControl>
          </VField>
        </form>
      </template>
      <template #action>
        <VButton :loading="isLoading" type="submit" @click="createClient" color="primary" raised>Publish</VButton>
      </template>
    </VModal>

    <div class="page-content-inner">
      <div class="flex-list-wrapper flex-list-v1">
        <!--List Empty Search Placeholder -->
        <VPlaceholderPage
          v-if="!filteredData.length"
          title="We couldn't find any matching results."
          subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria."
          larger
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
        </VPlaceholderPage>

        <VFlexTable
          v-if="filteredData.length"
          :data="filteredData"
          :columns="columns"
          compact
        >
          <template #body>
            <TransitionGroup name="list" tag="div" class="flex-list-inner">
              <!--Table item-->
              <div v-for="client in filteredData" :key="client.user.id" class="flex-table-item">
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
                    @view-detail="viewClientDetail(client.user.id)"
                    @delete-client="deleteClient(client.user.id)"
                  />
                </VFlexTableCell>
              </div>
            </TransitionGroup>
          </template>
        </VFlexTable>

        <!--Table Pagination-->
        <VFlexPagination
          v-if="filteredData.length > 5"
          v-model:current-page="currentPage"
          :item-per-page="10"
          :total-items="873"
          :max-links-displayed="7"
          no-router
        />
      </div>
    </div>
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
