<template>
  <data-table :key="componentKey" :v-if="renderComponent"></data-table>
</template>

<script>
import DataTable from "@/components/DataTable.vue";

export default {
  name: "Home",
    components: {
      DataTable,
    },
};
</script>

<style scoped>
</style>