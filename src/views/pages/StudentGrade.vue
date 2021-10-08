<template>
  <PageContent
    :title="`Grade Sheet`"
    description="Manage student's raw grade per grading period. Manage grade visibility settings and other subject related settings."
    filterTitle="Your Subjects"
    :createButtonVisible="false"
    :badges="[
      { text: schoolYearName },
      { text: studentGradeStatusName, variant: 'success' },
    ]"
    noScrollBody
    @onRefresh="loadGradeSheetDetail">
    <template v-slot:extra-buttons>
      <template v-if="[
        StudentGradeStatuses.DRAFT.id,
        StudentGradeStatuses.REQUEST_EDIT_APPROVED.id
      ].includes(studentGrade.studentGradeStatusId)">
        <SplitButton
          text="Publish Grades"
          @click="setPublishGrade"
          :actions="[
            { text: 'Submit for Review', callback: setSubmitForReview },
          ]"
        />
      </template>
      <template v-else-if="studentGrade.studentGradeStatusId === StudentGradeStatuses.PUBLISHED.id">
        <SplitButton
          text="Submit for Review"
          @click="setSubmitForReview"
          :actions="[
            { text: 'Unpublish Grades', callback: setUnpublishGrade },
            { text: 'Request Edit', callback: setRequestEdit },
          ]"
        />
      </template>
      <template v-else-if="studentGrade.studentGradeStatusId === StudentGradeStatuses.SUBMITTED.id">
        <SplitButton
          text="Request Edit"
          @click="setRequestEdit"
          splitVariant="primary"
          :actions="[
            { text: 'Request Edit', callback: setRequestEdit },
          ]"
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
        :section="section"
        :isReadOnly="![
          StudentGradeStatuses.DRAFT.id,
          StudentGradeStatuses.REQUEST_EDIT_APPROVED.id
        ].includes(studentGrade.studentGradeStatusId)" />

        <ConfirmationModal
          :isShown.sync="showPublishGrade"
          title="Publish Grade"
          @onCancel="showPublishGrade=false"
          @onYes="onPublishGrade"
          :isConfirmBusy="isProcessing">
          <template #modal-body>
            Are you sure you want to publish grade ?
          </template>
        </ConfirmationModal>

        <ConfirmationModal
          :isShown.sync="showUnpublishGrade"
          title="Un-Publish Grade"
          @onCancel="showUnpublishGrade=false"
          @onYes="onUnpublishGrade"
          :isConfirmBusy="isProcessing">
          <template #modal-body>
            Are you sure you want to un-publish grade ?
          </template>
        </ConfirmationModal>

        <ConfirmationModal
          :isShown.sync="showSubmitGrade"
          title="Submit Grade for Review"
          @onCancel="showSubmitGrade=false"
          @onYes="onSubmitForReview"
          :isConfirmBusy="isProcessing">
          <template #modal-body>
            Are you sure you want to submit grade ?
          </template>
        </ConfirmationModal>

        <ConfirmationModal
          :isShown.sync="showRequestEdit"
          title="Request Edit"
          @onCancel="showRequestEdit=false"
          @onYes="onRequestEdit"
          :isConfirmBusy="isProcessing">
          <template #modal-body>
            Are you sure you want to request for grade editting ?
          </template>
        </ConfirmationModal>
    </template>
  </PageContent>
</template>
<script>
import { StudentGradeStatuses } from '../../helpers/enum';
import { validate } from '../../helpers/forms';
import { StudentGradeApi } from '../../mixins/api';
import ConfirmationModal from '../components/ConfirmationModal'
import TranscriptRecordVue from './TranscriptRecord.vue';
export default {
  mixins: [StudentGradeApi],
  components: { ConfirmationModal },
  data() {
    return {
      section: null,
      sectionId: null,
      subjectId: null,
      schoolYearId: null,
      schoolCategoryId: null,
      semesterId: null,
      studentGrade: {},
      StudentGradeStatuses,
      showPublishGrade: false,
      showSubmitGrade: false,
      showRequestEdit: false,
      showUnpublishGrade: false,
      isProcessing: false,
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
      const params = { sectionId: this.sectionId, subjectId: this.subjectId, paginate: false}
      this.getStudentGradeList(params).then(({ data }) => {
         this.studentGrade = data[0]
      })
    },
    onSubmitForReview() {
      console.log('onSubmitForReview')
      // POST /student-grades/:id/submit
      const { id: studentGradeId } = this.studentGrade
      this.isProcessing = true
      this.submitStudentGrade(studentGradeId).then(({ data }) => {
        this.studentGrade = data
        this.showSubmitGrade = false
        this.isProcessing = false
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(null, errors, this);
        this.isProcessing = false
      });
    },
    onPublishGrade() {
      console.log('onPublishGrade')
      // POST /student-grades/:id/publish
      const { id: studentGradeId } = this.studentGrade
      this.isProcessing = true
      this.publishStudentGrade(studentGradeId).then(({ data }) => {
        this.studentGrade = data
        this.showPublishGrade = false
        this.isProcessing = false
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(null, errors, this);
        this.isProcessing = false
      });
    },
    onUnpublishGrade() {
      console.log('onUnpublishGrade')
      // POST /student-grades/:id/unpublish
      this.isProcessing = true
      const { id: studentGradeId } = this.studentGrade
      this.unpublishStudentGrade(studentGradeId).then(({ data }) => {
        this.studentGrade = data
        this.showUnpublishGrade = false
        this.isProcessing = false
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(null, errors, this);
        this.isProcessing = false
      });
    },
    onRequestEdit() {
      console.log('onRequestEdit')
      // POST /student-grades/:id/request-edit
      const { id: studentGradeId } = this.studentGrade
      this.isProcessing = true
      this.requestEditStudentGrade(studentGradeId).then(({ data }) => {
        this.studentGrade = data
        this.showRequestEdit = false
        this.isProcessing = false
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(null, errors, this);
        this.isProcessing = false
      });
    },
    setPublishGrade() {
      this.showPublishGrade = true
    },
    setSubmitForReview() {
      this.showSubmitGrade = true
    },
    setRequestEdit() {
      this.showRequestEdit = true
    },
    setUnpublishGrade() {
      this.showUnpublishGrade = true
    }
  },
  computed: {
    personnelId() {
      return this.$store?.state?.user?.userableId || null
    },
    schoolYearName() {
      return this.studentGrade?.section?.schoolYear?.name || 'N/A'
    },
    studentGradeStatusName() {
      if(this.studentGrade?.studentGradeStatusId){
        return this.StudentGradeStatuses.getEnum(this.studentGrade.studentGradeStatusId).name
      }
       return 'N/A'
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
