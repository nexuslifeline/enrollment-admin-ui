<template>
  <div>
   {{ data && data.name }}
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: [Object]
    }
  },
  data() {
    return {
     
    }
  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";
</style>
