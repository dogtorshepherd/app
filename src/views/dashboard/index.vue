<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import teacherDashboard from './teacher'
import studentDashboard from './student'

export default {
  name: 'Dashboard',
  components: { adminDashboard, teacherDashboard, studentDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (this.roles.includes('admin')) {
      this.currentRole = 'adminDashboard'
    } else if (this.roles.includes('teacher')) {
      this.currentRole = 'teacherDashboard'
    } else {
      this.currentRole = 'studentDashboard'
    }
  }
}
</script>

<style>
iframe {
  width: 100%;
  height: 600px;
}
</style>
