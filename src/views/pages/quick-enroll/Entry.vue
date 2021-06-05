<template>
  <ApprovalView
    @onBack="$router.push(previousRoute)"
    backTitle="List">
    <template v-slot:detail>

    </template>
    <template v-slot:content>


    </template>
  </ApprovalView>
</template>

<script>

export default {
  mixins: [],
  props: {
    previousRoute: {
      type: [Object]
    }
  },
  components: {
    StudentSelection
  },
  data() {
    return {
      data: {},
    }
  },
  computed: {

  },
  created() {

  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
</style>