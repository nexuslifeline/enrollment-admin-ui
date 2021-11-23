<template>
  <div>
    <Transcript :transcriptId="1" />
    <Breadcrumb :items="breadcrumbs"/>
  </div>
</template>
<script>
import Transcript from '../components/Transcript/Transcript';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb.vue'

export default {
  components: {
    Transcript,
    Breadcrumb
  },
  mixins: [],
  data() {
    return {
      breadcrumbs: [
        {
          text: 'Location',
          path: '/'
        },
        {
          text: 'Midwest',
          path: '/'
        },
        {
          text: 'Indiana',
          path: '/'
        },
        {
          text: 'Indianapolis',
          path: '/'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
