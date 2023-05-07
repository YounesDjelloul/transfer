<script setup lang="ts">

  import { toRaw } from 'vue';
  import { z as zod } from 'zod'
  import { useI18n } from 'vue-i18n'
  import { useNotyf } from '/@src/composable/useNotyf'
  import { useHandleInstance } from '/@src/stores/handleInstance'
  import { useQueryParam } from '/@src/stores/queryParam'
  import { storeToRefs } from 'pinia';
  import {
    convertObjectToFilterString,
    convertSchemaToEmptyFilterString
  } from '/@src/utils/app/CRUD/filters'
  import {
    generateInitialValues,
    formatFieldChoices,
    objectToFormData,
    formatError,
    generateValidationSchema,
    cleanValuesIfPatch,
    formatUserAvatarUrl,
    flattenObj,
  } from '/@src/utils/app/shared/helpers'
  
  import { FormatingOrderingParam } from '/@src/utils/app/CRUD/sorts'

  const props = defineProps<{
    columns: object,

    fetchInstancesFunction: void,
    updateCurrentInstanceFunction: void,
    deleteCurrentInstanceFunction: void,
  }>()

  const baseURL = import.meta.env.VITE_API_BASE_URL

  const handleInstance = useHandleInstance()
  const queryParam     = useQueryParam()

  const defaultLimit = ref(20)

  const fetchInstances = async() => {

    const { page, searchTerm, filtersTerm, sort, reload } = queryParam

    if (handleInstance.status) {

      let result = toRaw(handleInstance.currentStateData)
      
      switch (handleInstance.status) {
        case 'delete':
          result = result.filter(props.deleteCurrentInstanceFunction, handleInstance.instanceToDeleteId)
          break;
        case 'update':
          result.forEach(props.updateCurrentInstanceFunction, [handleInstance.instanceToUpdateId, handleInstance.operatedInstance])
          break;
        case 'create':
          result.unshift(toRaw(handleInstance.operatedInstance))
          break;
      }

      handleInstance.status = undefined
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

    handleInstance.totalInstances = count
    return results
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
      :total="handleInstance.totalInstances"
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
              <VButton @click="handleInstance.showFilterInstancesPopup=true" color="primary" icon="feather:settings" outlined> Filters
              </VButton>
              <VButton @click="handleInstance.getCreateInstancePopup(wrapperState.data)" color="primary" icon="feather:plus"> Create Record
              </VButton>
            </VButtons>
          </template>
        </VFlexTableToolbar>

        <slot
          v-if="handleInstance.showCreateInstancePopup"
          name="createInstanceSlot"
        />

        <slot
          v-if="handleInstance.showViewInstanceDetailsPopup"
          name="viewInstanceSlot"
        />

        <slot
          v-if="handleInstance.showUpdateInstancePopup"
          name="updateInstanceSlot"
        />

        <slot
          v-if="handleInstance.showDeleteInstancePopup"
          name="deleteInstanceSlot"
        />

        <slot
          v-if="handleInstance.showFilterInstancesPopup"
          name="filterInstancesSlot"
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
                @view-detail="handleInstance.getViewInstanceDetailsPopup(row.user.username)"
                @update-details="handleInstance.getUpdateInstanceDetailsPopup(row.user.username, wrapperState.data)"
                @delete-instance="handleInstance.getDeleteInstancePopup(row.user.username, wrapperState.data)"
              />
            </template>

            <template v-if="column.media">
              <VAvatar size="medium" :picture="baseURL + formatUserAvatarUrl(flattenObj(row)[column.id])" />
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