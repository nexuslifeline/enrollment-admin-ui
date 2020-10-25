<template>
  <div>
    <div>
      {{ data.email }}
    </div>
    <div>
      {{ data.phoneNo }}
    </div>
    <div>
      {{ data.mobileNo }}
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: [Object]
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
</style>