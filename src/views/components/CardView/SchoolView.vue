<template>
  <div>
    <InlineItem label="Last School">
      {{ data.lastSchoolAttended }}
    </InlineItem>
    <InlineItem label="Level">
      {{ data.lastSchoolLevel && data.lastSchoolLevel.name || 'N/A' }}
    </InlineItem>
    <InlineItem label="Period">
      {{ data.lastSchoolYearFrom }} - {{ data.lastSchoolYearTo }}
    </InlineItem>
  </div>
</template>
<script>

export default {
  props: {
    data: {
      type: [Object]
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

</style>
