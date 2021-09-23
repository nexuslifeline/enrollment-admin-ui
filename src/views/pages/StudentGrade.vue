<template>
  <PageContent
    :title="`Student Grade (${$store.state.schoolYear.name})`"
    filterTitle="Your Subjects"
    :createButtonVisible="false"
    noScrollBody>
    <template v-slot:filters>
      <FolderManager :personnelId="personnelId" @onSectionSelect="onSectionSelect" />
    </template>
    <template v-slot:content>
      <GradeSheet
        :sectionId="sectionId"
        :subjectId="subjectId"
        :section="section" />
    </template>
  </PageContent>
</template>
<script>
export default {
  data() {
    return {
      section: null,
      sectionId: null,
      subjectId: null,
      schoolYearId: null,
      schoolCategoryId: null,
      semesterId: null
    }
  },
  methods: {
    onSectionSelect({ sectionId, subjectId, section }) {
      this.sectionId = sectionId;
      this.subjectId = subjectId;
      this.section = section
    }
  },
  computed: {
    personnelId() {
      return this.$store?.state?.user?.userableId || null
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
