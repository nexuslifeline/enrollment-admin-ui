<template>
  <Card title="Last School Attended" titleSize="m" noPaddingBody>
    <ActiveViewItems>
      <ActiveViewItem label="Last School Attended">
        <p>
          {{ data.lastSchoolAttended }}
        </p>
      </ActiveViewItem>
      <ActiveViewItem label="Last School Level">
        <p>
          {{ data.lastSchoolLevel && data.lastSchoolLevel.name || 'N/A' }}
        </p>
      </ActiveViewItem>
      <ActiveViewItem label="Attended Period">
        <p>
          {{ data.lastSchoolYearFrom }} - {{ data.lastSchoolYearTo }}
        </p>
      </ActiveViewItem>
    </ActiveViewItems>
  </Card>
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
