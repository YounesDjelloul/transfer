<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Clients')

useHead({
  title: 'Lex Algeria - Clients',
})
</script>

<template>
  <div class="page-content-inner">
    <div class="column is-12">
      <FlexListV1 />
    </div>
  </div>
</template>