<template>
  <div>
    <div>
      {{ $options.getPropValue(data.level) }}
    </div>
    <div>
      {{ data.course ? $options.getPropValue(data.course) : '' }} {{ data.semester ? $options.getPropValue(data.semester) : '' }}
    </div>
    <div>
      {{ $options.getPropValue(data.schoolYear) }}
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