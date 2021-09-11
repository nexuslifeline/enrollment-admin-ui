<template>
  <!-- <div>
    <div>
      {{ data && data.level ? $options.getPropValue(data.level) : 'No Level' }}
    </div>
    <div>
      <span v-if="!!(data && data.course)" class="mr-2">{{ $options.getPropValue(data.course) }}</span>
      <span v-if="!!(data && data.semester)" class="mr-2">{{ $options.getPropValue(data.semester) }}</span>
      <span v-if="!!(showSchoolYear && data && data.schoolYear)" class="mr-2">
        {{  $options.getPropValue(data.schoolYear) }}
      </span>
    </div>
  </div> -->
  <BulletedContent :items="[
      data && data.level ? $options.getPropValue(data.level) : 'No Level',
      $options.getPropValue(data.course),
      $options.getPropValue(data.semester)
    ]"
  />
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