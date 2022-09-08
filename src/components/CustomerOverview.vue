<template>
  <el-alert :closable="false" >
    ครูทั้งหมด {{ totalCustomers }} ท่าน
  </el-alert>
</template>

<script>
export default {
  name: "CustomerOverview",
  props: {
    totalCustomers: Number,
    activeCustomers: Number,
  },
  data() {
    return {
      totalIsActive: true,
      activeIsActive: false,
    };
  },
  methods: {
    totalCustomersIsActiveFilter() {
      this.totalIsActive = true;
      this.activeIsActive = false;
      this.$emit("totalCustomersIsActive");
    },
    activeCustomersIsActiveFilter() {
      this.totalIsActive = false;
      this.activeIsActive = true;
      this.$emit("activeCustomerIsActive");
    },
  },
};
</script>

<style scoped>
.filter-card:hover {
  cursor: pointer;
  text-decoration: underline;
}

.bg-active-filter {
  background-color: #e9f1fe;
  color: #074297;
}
</style>