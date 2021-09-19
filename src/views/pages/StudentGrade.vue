<template>
  <PageContent
    :title="`Student Grade (${$store.state.schoolYear.name})`"
    filterTitle="Your Subjects"
    :createButtonVisible="false"
    noScrollBody>
    <template v-slot:filters>
      <FolderManager :personnelId="1" @onSectionSelect="onSectionSelect" />
    </template>
    <template v-slot:content>
      <GradeSheet :sectionId="sectionId" :subjectId="subjectId" />
    </template>
  </PageContent>
</template>
<script>
export default {
  data() {
    return {
      sectionId: null,
      subjectId: null
    }
  },
  methods: {
    onSectionSelect({ sectionId, subjectId }) {
      this.sectionId = sectionId;
      this.subjectId = subjectId;
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
