<script setup lang="ts">
  
  const emits = defineEmits<{
    (e: 'triggerUpdate', rowPk): void
  }>()

  const props = defineProps<{
    records: object,
    field: object,
  }>()

</script>

<template>
	<table class="table is-striped is-fullwidth">
    <thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">FullName</th>
        <th scope="col" class="is-end">
          <div class="dark-inverted is-flex is-justify-content-flex-end">Actions</div>
        </th>
      </tr>
    </thead>
    <tbody>
      <div v-if="records.length === 0" class="no-options">No records..</div>
      <tr v-for="row in records">
        <td>{{ row.value }}</td>
        <td>{{ row.display_name }}</td>
        <td class="is-end">
          <div class="is-flex is-justify-content-flex-end">
            <VTag class="update-create-button" color="primary" @click="emits('triggerUpdate', field, row.value)" label="Update" curved outlined />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss">
  
  .update-create-button {
    cursor: pointer;
  }

  .no-options {
    padding: 10px 10px 10px 39px;
    font-weight: bold;
  }

</style>