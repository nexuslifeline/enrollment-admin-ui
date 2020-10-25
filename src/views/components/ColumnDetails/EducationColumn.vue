<template>
  <div>
    <div>
      {{ $options.getPropValue(data.level) }}
    </div>
    <div>
      {{ $options.getPropValue(data.course) }}
    </div>
  </div>
</template>

<script>
  import { getPropValue } from '../../../helpers/utils'
  export default {
    getPropValue,
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