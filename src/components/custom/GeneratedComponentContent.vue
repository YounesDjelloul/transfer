<script setup lang="ts">

  const props = defineProps<{
    componentDependencies: object,
    renderLoading: boolean,
    errorToDisplay: string,
  }>()
</script>

<template>
  <div class="page-content-inner">
    <div class="column is-12">
      <VCard radius="small" color="info" v-if="renderLoading && errorToDisplay.length === 0">
        <h3 class="title is-5 mb-2">Wait while we are loading data..</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quibusnam praeteritis? At
          multis se probavit. Quoniam, si dis placet, ab Epicuro loqui discimus. Et ille
          ridens.
        </p>
      </VCard>
      <VCard radius="small" color="warning" v-else-if="!renderLoading && errorToDisplay.length > 0">
        <h3 class="title is-5 mb-2">{{ errorToDisplay }}</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quibusnam praeteritis? At
          multis se probavit. Quoniam, si dis placet, ab Epicuro loqui discimus. Et ille
          ridens.
        </p>
      </VCard>
      <DatatableV1
        v-else
        :componentDependencies="componentDependencies"
      >
      </DatatableV1>
    </div>
  </div>
</template>

<style lang="scss">

  .dataTable-table > thead > tr > th {
    vertical-align: middle;
  }
</style>