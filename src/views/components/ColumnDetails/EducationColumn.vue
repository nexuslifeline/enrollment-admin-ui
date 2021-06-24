<template>
  <div>
    <div>
      {{ data.level ? $options.getPropValue(data.level) : 'No Level' }}
    </div>
    <div>
      <span v-if="!!(data && data.course)">{{ $options.getPropValue(data.course) }}</span>
      &nbsp;
      <span v-if="!!(data && data.semester)">{{ $options.getPropValue(data.semester) }}</span>
      &nbsp;
      <span v-if="!!(showSchoolYear && data && data.schoolYear)">
        {{  $options.getPropValue(data.schoolYear) }}
      </span>
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