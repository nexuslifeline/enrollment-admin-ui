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
      ].includes(studentGradeStatusId)">
        <SplitButton
          text="Publish Grades"
          @click="isShownPublish = true"
          :actions="[
            { text: 'Submit for Review', callback: () => isShownSubmit = true },
          ]"
        />
      </template>
      <template v-else-if="studentGradeStatusId === StudentGradeStatuses.PUBLISHED.id">
        <SplitButton
          text="Submit for Review"
          @click="setSubmitForReview"
          :actions="[
            { text: 'Unpublish Grades', callback: () => isShownUnpublish = true },
            { text: 'Request Edit', callback: () => isShownRequest = true },
          ]"
        />
      </template>
      <template v-else-if="studentGradeStatusId === StudentGradeStatuses.SUBMITTED.id">
        <SplitButton
          text="Request Edit"
          @click="setRequestEdit"
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
        :section="section"
        :isReadOnly="![
          StudentGradeStatuses.DRAFT.id,
          StudentGradeStatuses.REQUEST_EDIT_APPROVED.id
        ].includes(studentGradeStatusId)" />

        <ConfirmationModal
          :isShown.sync="isShownPublish"
          title="Publish Grade"
          @onCancel="isShownPublish = false"
          @onYes="onPublishGrade"
          :isConfirmBusy="isProcessing">
          <template #modal-body>
            Are you sure you want to publish grade ?
          </template>
        </ConfirmationModal>

        <ConfirmationModal
          :isShown.sync="isShownUnpublish"
          title="Un-Publish Grade"
          @onCancel="isShownUnpublish = false"
          @onYes="onUnpublishGrade"
          :isConfirmBusy="isProcessing">
          <template #modal-body>
            Are you sure you want to un-publish grade ?
          </template>
        </ConfirmationModal>

        <ConfirmationModal
          :isShown.sync="isShownSubmit"
          title="Submit Grade for Review"
          @onCancel="isShownSubmit = false"
          @onYes="onSubmitForReview"
          :isConfirmBusy="isProcessing">
          <template #modal-body>
            Are you sure you want to submit grade ?
          </template>
        </ConfirmationModal>

        <ConfirmationModal
          :isShown.sync="isShownRequest"
          title="Request Edit"
          @onCancel="isShownRequest = false"
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
import debounce from 'lodash/debounce';
import { StudentGradeStatuses } from '../../helpers/enum';
import { validate } from '../../helpers/forms';
import { StudentGradeApi } from '../../mixins/api';
import ConfirmationModal from '../components/ConfirmationModal'

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
      isShownPublish: false,
      isShownSubmit: false,
      isShownRequest: false,
      isShownUnpublish: false,
      isProcessing: false,
    }
  },
  methods: {
    onSectionSelect({ sectionId, subjectId, section }) {
      this.sectionId = sectionId;
      this.subjectId = subjectId;
      this.section = section
    },
    loadGradeSheetDetail: debounce(function () {
      const params = { sectionId: this.sectionId, subjectId: this.subjectId, paginate: false }
      this.getStudentGradeList(params).then(({ data }) => {
         this.studentGrade = data?.[0] || {};
      }).catch((error) => {
        console.warn(error);
      });
    }, 250),
    onSubmitForReview() {
      // POST /student-grades/:id/submit
      const { id: studentGradeId } = this.studentGrade
      this.isProcessing = true
      this.submitStudentGrade(studentGradeId).then(({ data }) => {
        this.studentGrade = data
        this.isShownSubmit = false
        this.isProcessing = false
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(null, errors, this);
        this.isProcessing = false
      });
    },
    onPublishGrade() {
      // POST /student-grades/:id/publish
      const { id: studentGradeId } = this.studentGrade
      this.isProcessing = true
      this.publishStudentGrade(studentGradeId).then(({ data }) => {
        this.studentGrade = data
        this.isShownPublish = false
        this.isProcessing = false
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(null, errors, this);
        this.isProcessing = false
      });
    },
    onUnpublishGrade() {
      // POST /student-grades/:id/unpublish
      this.isProcessing = true
      const { id: studentGradeId } = this.studentGrade
      this.unpublishStudentGrade(studentGradeId).then(({ data }) => {
        this.studentGrade = data
        this.isShownUnpublish = false
        this.isProcessing = false
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(null, errors, this);
        this.isProcessing = false
      });
    },
    onRequestEdit() {
      // POST /student-grades/:id/request-edit
      const { id: studentGradeId } = this.studentGrade
      this.isProcessing = true
      this.requestEditStudentGrade(studentGradeId).then(({ data }) => {
        this.studentGrade = data
        this.isShownRequest = false
        this.isProcessing = false
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(null, errors, this);
        this.isProcessing = false
      });
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
      return this.StudentGradeStatuses.getEnum(this.studentGradeStatusId).name
    },
    studentGradeStatusId() {
      return this.studentGrade?.studentGradeStatusId || this.StudentGradeStatuses.DRAFT.id;
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
