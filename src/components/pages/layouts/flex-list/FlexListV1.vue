<script setup lang="ts">

  import { toRaw } from 'vue';
  import { z as zod } from 'zod'
  import { useI18n } from 'vue-i18n'
  import { useNotyf } from '/@src/composable/useNotyf'

  import { convertObjectToFilterString } from '/@src/utils/app/CRUD/filters'
  import { FormatingOrderingParam } from '/@src/utils/app/CRUD/sorts'
  import { generateValidationSchema } from '/@src/utils/app/CRUD/helpers'

  const notyf  = useNotyf()
  const { t }  = useI18n()
  const router = useRouter()
  const route  = useRoute()

  const props = defineProps<{
    columns: object,
    filtersFormSchema: object,
    defaultFilters: string,

    fetchInstancesFunction: void,
    createInstanceFormSchemaFunction: void,
    updateInstanceFormSchemaFunction: void,
    updateCurrentInstanceFunction: void,
    deleteCurrentInstanceFunction: void,
    createNewInstanceFunction: void,
    updateInstanceDetailsFunction: void
    getInstanceDetailsFunction: void,
    deleteInstanceFunction: void,
  }>()

  const creationFormSchema             = await props.createInstanceFormSchemaFunction()
  const createInstanceValidationSchema = generateValidationSchema(creationFormSchema, t)

  const defaultLimit    = ref(20)
  const totalInstances  = ref(0)
  const currentReload   = ref(false)

  function useQueryParam() {

    const defaultPage    = 1
    const defaultSearch  = ''
    const defaultFilters = props.defaultFilters
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
  const operatedInstance  = ref()

  const fetchInstances = async() => {

    const { page, searchTerm, filtersTerm, sort, reload } = queryParam

    if (status) {

      let result = toRaw(currentStateData)
      
      switch (status) {
        case 'delete':
          result = result.filter(props.deleteCurrentInstanceFunction, instanceToDeleteId)
          break;
        case 'update':
          result.forEach(props.updateCurrentInstanceFunction, [instanceToUpdateId, operatedInstance])
          break;
        case 'create':
          result.unshift(toRaw(operatedInstance.value))
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
    const { results, count } = await props.fetchInstancesFunction(endpointRoute)

    totalInstances.value  = count
    return results
  }

  const showCreateInstancePopup       = ref(false)
  const showDeleteInstancePopup       = ref(false)
  const showViewInstanceDetailsPopup  = ref(false)
  const showUpdateInstancePopup       = ref(false)
  const showFilterInstancesPopup      = ref(false)

  let instanceToUpdateId = undefined
  let instanceToDeleteId = undefined
  let instanceToViewId   = undefined

  function getUpdateInstanceDetailsPopup(instanceId, stateData) {
    instanceToUpdateId            = instanceId
    currentStateData              = stateData
    showUpdateInstancePopup.value = true
  }

  function getCreateInstancePopup(stateData) {
    currentStateData       = stateData
    showCreateInstancePopup.value = true
  }

  function getDeleteInstancePopup(instanceId, stateData) {
    instanceToDeleteId          = instanceId
    currentStateData            = stateData
    showDeleteInstancePopup.value = true
  }

  function getViewInstanceDetailsPopup(instanceId) {
    instanceToViewId                 = instanceId
    showViewInstanceDetailsPopup.value = true
  }

  function reload(operation) {
    status = operation
    queryParam.reload = !currentReload.value
  }

  function handleInstanceCreationAffect(data) {

    notyf.dismissAll()
    notyf.success("Record Created Successfully!")

    showCreateInstancePopup.value = false
    operatedInstance.value        = data
    reload('create')
  }

  function handleInstanceUpdateAffect(data) {

    notyf.dismissAll()
    notyf.success("Record Updated Successfully!")

    showUpdateInstancePopup.value = false
    operatedInstance.value        = data
    reload('update')
  }

  function handleInstanceDeleteAffect() {

    notyf.dismissAll()
    notyf.success("Record Deleted Successfully!")

    showDeleteInstancePopup.value = false
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
      :data="fetchInstances"
      :total="totalInstances"
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
              <VButton @click="showFilterInstancesPopup=true" color="primary" icon="feather:settings" outlined> Filters
              </VButton>
              <VButton @click="getCreateInstancePopup(wrapperState.data)" color="primary" icon="feather:plus"> Add User
              </VButton>
            </VButtons>
          </template>
        </VFlexTableToolbar>

        <CreateInstanceComponent
          v-if="showCreateInstancePopup"
          :validation-schema="createInstanceValidationSchema"
          :request-function="createNewInstanceFunction"
          :formSchema="creationFormSchema"
          modal-title="Create New Record"
          @hide-popup="showCreateInstancePopup=false"
          @handle-create-instance-affect="handleInstanceCreationAffect"
        />

        <ViewInstanceComponent
          v-if="showViewInstanceDetailsPopup"
          :instance-id="instanceToViewId"
          :request-function="getInstanceDetailsFunction"
          modal-title="Record Details"
          @hide-popup="showViewInstanceDetailsPopup=false"
        />

        <UpdateInstanceComponent
          v-if="showUpdateInstancePopup"
          :request-function="updateInstanceDetailsFunction"
          :form-schema-function="updateInstanceFormSchemaFunction"
          :instance-details-function="getInstanceDetailsFunction"
          :instance-id="instanceToUpdateId"
          modal-title="Update Record"
          @hide-popup="showUpdateInstancePopup=false"
          @handle-update-instance-affect="handleInstanceUpdateAffect"
        />

        <DeleteInstanceComponent
          v-if="showDeleteInstancePopup"
          :request-function="deleteInstanceFunction"
          :instance-id="instanceToDeleteId"
          modal-title="Delete Record"
          @hide-popup="showDeleteInstancePopup=false"
          @handle-delete-instance-affect="handleInstanceDeleteAffect"
        />
        
        <FilterListComponent
          v-if="showFilterInstancesPopup"
          :formSchema="filtersFormSchema"
          modal-title="Filter Records"
          @hide-popup="showFilterInstancesPopup=false"
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
                subtitle="No instances found."
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
            <template v-if="column.key == 'actions'">
              <FlexTableDropdown
                @view-detail="getViewInstanceDetailsPopup(row.id)"
                @update-details="getUpdateInstanceDetailsPopup(row.id, wrapperState.data)"
                @delete-instance="getDeleteInstancePopup(row.id, wrapperState.data)"
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