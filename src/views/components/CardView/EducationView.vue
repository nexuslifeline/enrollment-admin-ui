<template>
  <div>
    <InlineItem label="College">
      {{ data.collegeDegree || 'No provided details' }}
    </InlineItem>
    <InlineItem label="Honors">
      {{ data.collegeDegreeHonors || 'No provided details' }}
    </InlineItem>
    <InlineItem label="Period">
      <span v-if="data.collegeDegreeYearFrom && data.collegeDegreeYearTo">
        {{ data.collegeDegreeYearFrom || '' }}
        -
        {{ data.collegeDegreeYearTo || '' }}
      </span>
      <span v-else>
        No provided Details
      </span>
    </InlineItem>
    <InlineItem label="High School">
      {{ data.highSchoolCourse || 'No provided details' }}
    </InlineItem>
    <InlineItem label="Honors">
      {{ data.highSchoolCourseHonors || 'No provided details' }}
    </InlineItem>
    <InlineItem label="Period">
      <span v-if="data.highSchoolCourseYearFrom && data.highSchoolCourseYearTo">
        {{ data.highSchoolCourseYearFrom || '' }}
        -
        {{ data.highSchoolCourseYearTo || '' }}
      </span>
      <span v-else>
        No provided details
      </span>
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
  created() {
    console.log(this.data)
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";
</style>
