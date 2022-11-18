<template>
  <sec-detail :is-edit="true" />
</template>

<script>
import SecDetail from './components/SecDetail'

export default {
  name: 'EditForm',
  components: { SecDetail }
}
</script>

