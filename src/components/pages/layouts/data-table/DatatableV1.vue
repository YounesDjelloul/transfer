<script setup lang="ts">

  import DataTable from 'datatables.net-vue3';
  import DataTablesCore from 'datatables.net';
   
  DataTable.use(DataTablesCore);

  import {
    formatUserAvatarUrl,
    flattenObj,
    getRowPk,
    deleteCurrentInstance,
    updateCurrentInstance,
  } from '/@src/utils/app/shared/helpers'

  import {
    createNewInstance,
    getInstances,
    updateInstanceDetailsRequest,
    getInstanceDetails,
    deleteInstanceRequest,
    getInstanceSchemas as schemasFunction,
  } from '/@src/utils/api/modelApiCallFunctions'

  const props = defineProps<{
    componentDependencies: object,
  }>()

  const endpointUrl = inject('endpointUrl')
  const table       = ref()

  const data = reactive({
    headings: props.componentDependencies.headings,
    results: undefined
  })

  onMounted(async () => {
    let { results: totalData } = await getInstances(endpointUrl, '?')
    data.results = totalData
  })

  const handleInstances = {
    search: (event) => {
      const current = table.value.dt.search
      current(event.target.value).draw()
    }
  }

  const tableOptions = {
    bLengthChange: false,
    dom: 'tpr',
    pageLength: 20,
  }
</script>

<template>
  <div class="dataTable-wrapper">
    <VFlexTableToolbar class="datatable-toolbar">
      <template #left>
        <VField>
          <VControl icon="feather:search">
            <input
              type="text"
              @keyup="handleInstances.search"
              class="input"
              placeholder="Search"
            />
          </VControl>
        </VField>
      </template>

      <template #right>
        <VButtons>
          <VButton color="primary" icon="feather:settings" outlined>Filters</VButton>
          <VButton color="primary" icon="feather:plus">Create Record</VButton>
        </VButtons>
      </template>
    </VFlexTableToolbar>
    <div class="dataTable-container">
      <DataTable
        :columns="data.headings"
        :data="data.results"
        :options="tableOptions"
        class="dataTable-table table display"
        ref="table"
      >
        <thead>
          <tr>
            <th v-for="head in data.headings">{{ head.display_name }}</th>
          </tr>
        </thead>
      </DataTable>
    </div>
  </div>
</template>

<style lang="scss">
  .is-navbar {
    .datatable-toolbar {
      padding-top: 30px;
    }
  }

  .datatable-toolbar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    &.is-reversed {
      flex-direction: row-reverse;
    }

    .field {
      margin-bottom: 0;

      .control {
        .button {
          color: var(--light-text);

          &:hover,
          &:focus {
            background: var(--primary);
            border-color: var(--primary);
            color: var(--primary--color-invert);
          }
        }
      }
    }

    .buttons {
      margin-left: auto;
      margin-bottom: 0;

      .v-button {
        margin-bottom: 0;
      }
    }
  }

  .is-dark {
    .datatable-toolbar {
      .field {
        .control {
          .button {
            background: var(--dark-sidebar) !important;
            color: var(--light-text);

            &:hover,
            &:focus {
              background: var(--primary) !important;
              border-color: var(--primary) !important;
              color: var(--smoke-white) !important;
            }
          }
        }
      }
    }
  }

  .dataTable-wrapper {
    .dataTable-container {
      background: var(--white);
      border: none !important;
      overflow-x: auto;

      &::-webkit-scrollbar {
        height: 8px !important;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 10px !important;
        background: rgb(0 0 0 / 20%) !important;
      }

      .dataTable-table {
        border: 1px solid var(--fade-grey);
        border-collapse: collapse;
        border-radius: 0.75rem;

        th {
          padding: 16px 20px;
          font-family: var(--font-alt);
          font-size: 0.8rem;
          color: var(--dark-text);
          text-transform: uppercase;
          border: 1px solid var(--fade-grey);
          font-weight: 600;

          &:last-child {
            text-align: right;
          }
        }

        td {
          font-family: var(--font);
          vertical-align: middle;
          padding: 20px;
          border-bottom: 1px solid var(--fade-grey);

          &:last-child {
            text-align: right;
          }

          &.dataTables-empty {
            opacity: 0;
          }
        }

        .light-text {
          color: var(--light-text);
        }

        .flex-media {
          display: flex;
          align-items: center;

          .meta {
            margin-left: 10px;
            line-height: 1.3;

            span {
              display: block;
              font-size: 0.8rem;
              color: var(--light-text);
              font-family: var(--font);

              &:first-child {
                font-family: var(--font-alt);
                color: var(--dark-text);
              }
            }
          }
        }

        .row-action {
          display: flex;
          justify-content: flex-end;
        }

        .checkbox {
          padding: 0;
        }

        .product-photo {
          width: 80px;
          height: 80px;
          object-fit: contain;
        }

        .file-icon {
          width: 46px;
          height: 46px;
          object-fit: contain;
        }

        .drinks-icon {
          display: block;
          max-width: 48px;
          border-radius: var(--radius-rounded);
          border: 1px solid var(--fade-grey);
        }

        .negative-icon,
        .positive-icon {
          svg {
            height: 16px;
            width: 16px;
          }
        }

        .positive-icon {
          .iconify {
            color: var(--success);

            * {
              stroke-width: 4px;
            }
          }
        }

        .negative-icon {
          &.is-danger {
            .iconify {
              color: var(--danger) !important;
            }
          }

          .iconify {
            color: var(--light-text);

            * {
              stroke-width: 4px;
            }
          }
        }
      }
    }
  }

  .is-dark {
    .dataTable-wrapper {
      .dataTable-top {
        .dataTable-dropdown {
          label {
            &::after {
              background: var(--dark-sidebar-light-6) !important;
            }
          }

          select {
            border-color: var(--dark-sidebar-light-12);
            background: var(--dark-sidebar-light-6);
            color: var(--white);
          }
        }

        .dataTable-search {
          &::after {
            background: var(--dark-sidebar-light-6) !important;
          }

          input {
            border-color: var(--dark-sidebar-light-12);
            background: var(--dark-sidebar-light-6);
            color: var(--white);
          }
        }
      }

      .dataTable-container {
        border-color: var(--dark-sidebar-light-12);
        background: var(--dark-sidebar-light-6);

        .dataTable-table {
          border-color: var(--dark-sidebar-light-12);

          th,
          td {
            border-color: var(--dark-sidebar-light-12);
            color: var(--dark-dark-text);
          }

          th {
            .dataTable-sorter {
              &::before {
                border-top-color: var(--dark-dark-text);
              }

              &::after {
                border-bottom-color: var(--dark-dark-text);
              }
            }
          }

          .drinks-icon {
            border-color: var(--dark-sidebar-light-12);
          }
        }
      }
    }
  }
</style>
