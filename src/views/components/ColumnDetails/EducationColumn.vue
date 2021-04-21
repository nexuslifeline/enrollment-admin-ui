<template>
  <div>
    <div v-if="!!(data && data.level)">
      {{ $options.getPropValue(data.level) }}
    </div>
    <div>
      <span v-if="!!(data && data.course)">{{ $options.getPropValue(data.course) }}</span>
      &nbsp;
      <span v-if="!!(data && data.semester)">{{ $options.getPropValue(data.semester) }}</span>
    </div>
    <div v-if="!!(showSchoolYear && data && data.schoolYear)">
      {{  $options.getPropValue(data.schoolYear) }}
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
      },
      showSchoolYear: {
        type: [Boolean],
        default: true
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
</style>