<template>
  <ApprovalView
    @onBack="$router.push(previousRoute)"
    @onApproveRequest="onApproveRequest"
    @onRejectionRequest="onRejectionRequest"
    backTitle="Evaluation">
     <template v-slot:detail>
       <div class="mt-2">
         <b-tabs content-class="mt-3">
          <b-tab title="Personal">
            <AvatarMaker
              :avatarId="userId"
              :size="110"
              :text="studentAvatarText"
              :src="studentPhoto"
              :borderSize="3"
              class="m-auto"
            />
            <StudentView
              v-if="data && data.student && data.academicRecord"
              :data="data.student"
              :studentCategory="data.academicRecord.studentCategory"
            />
          </b-tab>
          <b-tab title="Education">

          </b-tab>
        </b-tabs>
       </div>
    </template>
     <template v-slot:content>
       <div class="approval__content">
        <b-tabs content-class="mt-3">
          <b-tab title="Request">
            <div class="tab__content">
              <button @click="onAcceptTransferCredit" class="action__accept-credit" type="button">
                <BIconPlus scale="1.2" class="mr-1" v-if="!isCreatingTranscript"/>
                <v-icon name="spinner" spin v-if="isCreatingTranscript"></v-icon>
                Accept Transfer Credit
              </button>
              <AcademicView
                v-if="data && data.academicRecord"
                :data="data.academicRecord"
              />
              <SchoolView
                v-if="!!Object.keys(data).length"
                :data="data"
              />
              <div class="p-3">
                <StudentAttachments
                  v-if="!!Object.keys(data).length"
                  :studentId="data.student.id"
                  :owner="data.student"
                />
              </div>
            </div>
          </b-tab>
          <b-tab title="Account History">
            <div class="tab__content">

            </div>
          </b-tab>
          <b-tab title="Academic Record">
            <div class="tab__content">

            </div>
          </b-tab>
        </b-tabs>
       </div>
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
  </ApprovalView>
</template>

<script>
import ApproveEvaluation from '../../components/ApprovalModals/Evaluation';
import RejectEvaluation from '../../components/RejectionModals/Evaluation';
import { AcademicRecordApi, EvaluationApi, TranscriptRecordApi } from '../../../mixins/api';
import { showNotification } from '../../../helpers/forms';
import Transcript from '../../components/Transcript/Transcript'
export default {
  mixins: [EvaluationApi, TranscriptRecordApi, AcademicRecordApi],
  props: {
    previousRoute: {
      type: [Object]
    }
  },
  components: {
    ApproveEvaluation,
    RejectEvaluation,
    Transcript
  },
  data() {
    return {
      data: {},
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
    studentPhoto() {
      const { student } = this.data;
      const path = student?.photo?.hashName || '';
      return path ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${path}` : '';
    },
    studentAvatarText() {
      const { student } = this.data;
      return `${student?.firstName?.charAt(0)}${student?.lastName?.charAt(0)}`;
    },
    userId() {
      const { student } = this.data;
      return student?.user?.id;
    },
    transcriptRecord() {
      return this.data?.academicRecord?.transcriptRecord
    }
  },
  created() {
    this.getEvaluation(this.evaluationId).then(({ data }) => {
      this.data = data;
    });
  },
  methods: {
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
    color: $blue;
    padding: 0;
    position: absolute;
    right: 20px;
    top: 5px;

    &:hover {
      color: $dark-blue;
    }
  }

  .approval__content {
    margin-left: -1px;
    width: 100%;
    position: relative;
  }
</style>