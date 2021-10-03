<template>
  <div>
    {{ curriculumName }}
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
      curriculumName() {
        const { curriculum } = this.data;
        return curriculum?.name || curriculum?.description || curriculum?.notes || 'No Curriculum';
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
</style>