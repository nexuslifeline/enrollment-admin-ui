<template>
  <div>
    <InlineItem label="Father">
      {{ data.fatherName || 'No provided details' }}
    </InlineItem>
    <InlineItem label="Occupation">
      {{ data.fatherOccupation || 'No provided details' }}
    </InlineItem>
    <InlineItem label="Phone No">
      {{ data.fatherPhoneNo || 'No provided details' }}
    </InlineItem>
    <InlineItem label="Mobile No">
      {{ data.fatherMobileNo || 'No provided details' }}
    </InlineItem>
    <InlineItem label="Email">
      {{ data.fatherEmail || 'No provided details' }}
    </InlineItem>
    <InlineItem label="Mother">
      {{ data.motherName || 'No provided details' }}
    </InlineItem>
    <InlineItem label="Occupation">
      {{ data.motherOccupation || 'No provided details' }}
    </InlineItem>
    <InlineItem label="Phone No">
      {{ data.motherPhoneNo || 'No provided details' }}
    </InlineItem>
    <InlineItem label="Mobile No">
      {{ data.motherMobileNo || 'No provided details' }}
    </InlineItem>
    <InlineItem label="Email">
      {{ data.motherEmail || 'No provided details' }}
    </InlineItem>
    <InlineItem label="Guardian">
      {{ data.parentGuardianName || 'No provided details' }}
    </InlineItem>
    <InlineItem label="Contact No">
      {{ data.parentGuardianContactNo || 'No provided details' }}
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
