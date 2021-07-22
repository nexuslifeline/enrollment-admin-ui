<template>
  <div>
    <InlineItem label="Last School">
      {{ lastSchoolLevel }}
    </InlineItem>
    <InlineItem label="Level">
      {{ lastSchoolLevel }}
    </InlineItem>
    <InlineItem label="Period">
      {{ lastSchoolPeriod }}
    </InlineItem>
  </div>
</template>
<script>

export default {
  props: {
    data: {
      type: [Object]
    }
  },
  computed: {
    lastSchoolLevel() {
      return this.data?.lastSchoolAttended || 'No provided details';
    },
    lastSchoolLevel() {
      return this.data?.lastSchoolLevel?.name || 'No provided details';
    },
    lastSchoolPeriod() {
      return this.data?.lastSchoolYearFrom && this.data?.lastSchoolYearTo
        ? `${this.data.lastSchoolYearFrom} - ${this.data.lastSchoolYearTo}`
        : '';
    }
  },
  created() {
    console.log('created', this.data)
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

</style>
