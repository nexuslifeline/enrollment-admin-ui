<template>
  <PageContent
    :title="`Grade Sheet`"
    description="Manage student's raw grade per grading period. Manage grade visibility settings and other subject related settings."
    filterTitle="Your Subjects"
    :createButtonVisible="false"
    :badges="[
      { text: $store.state.schoolYear.name },
      { text: StudentGradeStatuses.getEnum(studentGrade.studentGradeStatusId).name, variant: 'success' },
    ]"
    noScrollBody>
    <template v-slot:extra-buttons>
      <template v-if="[
        StudentGradeStatuses.DRAFT.id,
        StudentGradeStatuses.REQUEST_EDIT_APPROVED.id
      ].includes(studentGrade.studentGradeStatusId)">
        <SplitButton
          text="Publish Grades"
          @click="onPublishGrade"
          :actions="[
            { text: 'Submit for Review', callback: onSubmitForReview },
          ]"
        />
      </template>
      <template v-else-if="studentGrade.studentGradeStatusId === StudentGradeStatuses.PUBLISHED.id">
        <SplitButton
          text="Submit for Review"
          @click="onSubmitForReview"
          :actions="[
            { text: 'Unpublish Grades', callback: onUnpublishGrade },
            { text: 'Request Edit', callback: onRequestEdit },
          ]"
        />
      </template>
      <template v-else-if="studentGrade.studentGradeStatusId === StudentGradeStatuses.SUBMITTED.id">
        <SplitButton
          text="Request Edit"
          @click="onRequestEdit"
          splitVariant="primary"
          :actions="[]"
        />
      </template>
    </template>
    <template v-slot:filters>
      <FolderManager
        :personnelId="personnelId"
        @onSectionSelect="onSectionSelect"
        :activeSectionId="sectionId"
        :activeSubjectId="subjectId"
      />
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
import { StudentGradeStatuses } from '../../helpers/enum';
export default {
  data() {
    return {
      section: null,
      sectionId: null,
      subjectId: null,
      schoolYearId: null,
      schoolCategoryId: null,
      semesterId: null,
      studentGrade: { studentGradeStatusId: 1 },
      StudentGradeStatuses
    }
  },
  methods: {
    onSectionSelect({ sectionId, subjectId, section }) {
      this.sectionId = sectionId;
      this.subjectId = subjectId;
      this.section = section
    },
    loadGradeSheetDetail() {
      // GET /student-grades?sectionId=1&subjectId=1&paginate=false
      // should return 1 array element [0]
    },
    onSubmitForReview() {
      console.log('onSubmitForReview')
      // POST /student-grades/:id/submit
    },
    onPublishGrade() {
      console.log('onPublishGrade')
      // POST /student-grades/:id/publish
    },
    onUnpublishGrade() {
      console.log('onUnpublishGrade')
      // POST /student-grades/:id/unpublish
    },
    onRequestEdit() {
      console.log('onRequestEdit')
      // POST /student-grades/:id/request-edit
    }
  },
  computed: {
    personnelId() {
      return this.$store?.state?.user?.userableId || null
    }
  },
  watch: {
    sectionId: {
      handler() {
        this.loadGradeSheetDetail();
      }
    },
    subjectId: {
      handler() {
        this.loadGradeSheetDetail();
      }
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
