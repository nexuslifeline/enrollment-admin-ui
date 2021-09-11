<template>
  <Panel @onClose="$router.push({ name: 'Evaluation' })" :isBusy="isLoading" showNotes>
    <template v-slot:header>
      <b-badge
        v-if="$options.EvaluationStatuses.APPROVED.academicRecordStatuses.includes(academicRecordStatusId)"
        variant="success"
        class="ml-2">
        Approved
      </b-badge>
      <b-badge
        v-else-if="$options.EvaluationStatuses.REJECTED.academicRecordStatuses.includes(academicRecordStatusId)"
        variant="danger"
        class="ml-2">
        Rejected
      </b-badge>
      <b-badge
        v-else
        variant="warning"
        class="ml-2">
        Pending
      </b-badge>
    </template>
    <template v-slot:actions>
      <b-dropdown
        right
        variant="link"
        toggle-class="text-decoration-none"
        no-caret
        boundary="window">
        <template v-slot:button-content>
          <BIconThreeDots />
        </template>
        <b-dropdown-item
          @click="onAcceptTransferCredit"
          v-if="isAccessible($options.EvaluationPermissions.ACCEPT_CREDITS.id) && showOptions">
          Accept Transfer Credit
        </b-dropdown-item>
        <b-dropdown-item @click="onApproveRequest" >
          Approve Request
        </b-dropdown-item>
        <b-dropdown-item @click="onRejectionRequest">
          Reject Request
        </b-dropdown-item>
      </b-dropdown>
    </template>
    <template v-slot:content>
      <SlidePanelNotes>
        Please review the details provided by the student.
        If something is wrong you can override the details 
        <b-link :to="{ name: 'Student Edit', params: { studentId: student && student.id } }">here</b-link> 
        or you can just <b>Reject</b> this request to notify the student.
      </SlidePanelNotes>

      <div class="group__content">
        <template v-if="student">
          <h4 class="content-title">Student Profile</h4>
          <StudentView
            v-if="student"
            :data="student"
            :studentCategory="data.academicRecord.studentCategory"
          />
        </template>
        <template v-if="student && student.education">
          <LinkVisibilityToggler
            linkText="View Educational Background"
            hideLinkText="Hide Educational Background"
            :hideOnContentShow="false"
            noMargin>
            <h4 class="content-title mt-3">Educational Background</h4>
              <EducationView
                :data="student.education"
              />
          </LinkVisibilityToggler>
        </template>
        <template v-if="student && student.family">
          <LinkVisibilityToggler
            linkText="View Family Background"
            hideLinkText="Hide Family Background"
            :hideOnContentShow="false"
            noMargin>
            <h4 class="content-title mt-3">Family Background</h4>
              <FamilyView
                :data="student.family"
              />
          </LinkVisibilityToggler>
        </template>
      </div>
      <SlidePanelNotes>
        If <b>Curriculum</b> is blank in the <b>Evaluation Request</b> the student has no record yet in the Database so you need to set it manually
        <span class="text-muted">(this will be automatically populated in the next enrollment)</span>.
      </SlidePanelNotes>
      <div class="group__content">
        <h4 class="content-title">Evaluation Request</h4>
        <AcademicView
          v-if="data"
          :data.sync="data.academicRecord"
          :isEditable="isAccessible($options.EvaluationPermissions.APPROVAL.id)"
        />
        <button
          v-if="isAccessible($options.EvaluationPermissions.ACCEPT_CREDITS.id) && showOptions"
          @click="onAcceptTransferCredit" class="action__accept-credit" type="button">
          <BIconPlus scale="1.2" class="mr-1" v-if="!isCreatingTranscript"/>
          <v-icon name="spinner" spin v-if="isCreatingTranscript"></v-icon>
          Accept Transfer Credit
        </button>
        <h4 class="content-title">Last School Attended</h4>
        <SchoolView
          v-if="!!Object.keys(data).length"
          :data.sync="data"
        />
        <StudentAttachments
          v-if="!!Object.keys(data).length && !!Object.keys(data.academicRecord).length"
          :studentId="data.academicRecord.student.id"
          :owner="data.student"
        />
      </div>

      <template>
        <ApproveEvaluation
          :isShown.sync="isApprovalShown"
          :evaluationId="evaluationId"
          @onApproved="onEvaluationUpdated"
          @onCancel="isApprovalShown = false"
        />
        <RejectEvaluation
          :isShown.sync="isRejectionShown"
          :evaluationId="evaluationId"
          @onRejected="onEvaluationUpdated"
          @onCancel="isRejectionShown = false"
        />

        <b-modal
          size="xl"
          v-if="showCreditGrades"
          v-model="showCreditGrades"
          hide-footer
          title="Accept Transfer Credit">
          <Transcript :transcriptId="data.academicRecord.transcriptRecordId"/>
        </b-modal>
      </template>
    </template>
    <template v-slot:bottom>
      <b-button
        v-if="isAccessible($options.EvaluationPermissions.APPROVAL.id)"
        @click="onApproveRequest" variant="primary"
        :disabled="$options.EvaluationStatuses.APPROVED.academicRecordStatuses.includes(academicRecordStatusId)">
        Approve
      </b-button>
      <b-button
        v-if="isAccessible($options.EvaluationPermissions.DISAPPROVAL.id)"
        :disabled="$options.EvaluationStatuses.APPROVED.academicRecordStatuses.includes(academicRecordStatusId)"
        @click="onRejectionRequest" variant="dark" class="ml-2">
        Reject
      </b-button>
    </template>
  </Panel>
</template>

<script>
import Panel from '../../components/SlidePanel/Panel';
import ApproveEvaluation from '../../components/ApprovalModals/Evaluation';
import RejectEvaluation from '../../components/RejectionModals/Evaluation';
import { AcademicRecordApi, EvaluationApi, TranscriptRecordApi } from '../../../mixins/api';
import Access from '../../../mixins/utils/Access';
import { showNotification } from '../../../helpers/forms';
import Transcript from '../../components/Transcript/Transcript'
import { EvaluationStatuses, EvaluationPermissions } from "../../../helpers/enum";

export default {
  EvaluationStatuses,
  EvaluationPermissions,
  mixins: [Access, EvaluationApi, TranscriptRecordApi, AcademicRecordApi],
  props: {
    previousRoute: {
      type: [Object]
    }
  },
  components: {
    ApproveEvaluation,
    RejectEvaluation,
    Transcript,
    Panel
  },
  data() {
    return {
      data: {},
      isLoading: false,
      isApprovalShown: false,
      isRejectionShown: false,
      isCreatingTranscript: false,
      showCreditGrades: false
    }
  },
  computed: {
    evaluationId() {
      return this.$route.params.evaluationId;
    },
    academicRecord() {
      return this.data?.academicRecord
    },
    academicRecordStatusId() {
      return this.data?.academicRecord?.academicRecordStatusId;
    },
    studentPhoto() {
      const path = this.student?.photo?.hashName || '';
      return path ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${path}` : '';
    },
    studentAvatarText() {
      return this.student && `${this.student?.firstName?.charAt(0)}${this.student?.lastName?.charAt(0)}` || '';
    },
    userId() {
      return this.student && this.student?.user?.id || 0;
    },
    transcriptRecord() {
      return this.data?.academicRecord?.transcriptRecord
    },
    showOptions() {
      if(!this.academicRecord)
      return false //avoid flicker

      return this.academicRecord && this.$options.EvaluationStatuses.PENDING.academicRecordStatuses.includes(this.academicRecord.academicRecordStatusId)
    },
    student() {
      return this.data?.academicRecord?.student
    }
  },
  created() {
    this.loadEvaluation();
  },
  methods: {
    loadEvaluation() {
      this.isLoading = true;
      this.getEvaluation(this.evaluationId).then(({ data }) => {
        this.data = data;
        this.isLoading = false;
      }).catch((error) => {
        this.isLoading = false;
      });
    },
    onApproveRequest() {
      const { curriculumId } = this.transcriptRecord
      if(!curriculumId) {
        showNotification(this,'danger', 'Curriculum is required before approving evaluation request.')
        return
      }

      this.isApprovalShown = true;
    },
    onRejectionRequest() {
      this.isRejectionShown = true;
    },
    onAcceptTransferCredit() {
      const { curriculumId } = this.transcriptRecord
      if(!curriculumId) {
        showNotification(this,'danger', 'Curriculum is required before accepting credited grades.')
        return
      }

      this.showCreditGrades = true
    },
    onEvaluationUpdated() {
      this.$router.push(this.previousRoute)
      this.$emit('onEvaluationUpdated')
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .tab__content {
    display: flex;
    flex-direction: column;
    margin: 30px 0;
    padding: 0;
  }

  .action__accept-credit {
    border: 0;
    outline: none;
    background: none;
    margin: 10px 0  25px 0;
    color: $blue;
    padding: 0;

    &:hover {
      color: $dark-blue;
    }
  }

  .approval__content {
    margin-left: -1px;
    width: 100%;
    position: relative;
  }

  .group__content {
    padding: 15px 25px;
  }

  .action__accept-credit {
    border: 0;
    outline: none;
    background: none;
    color: $blue;
    padding: 0;

    &:hover {
      color: $dark-blue;
    }
  }
</style>