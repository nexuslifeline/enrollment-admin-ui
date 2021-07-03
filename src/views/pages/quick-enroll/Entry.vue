<template>
  <ApprovalView
    :showOptions="false"
    :showFooter="false"
    @onBack="$router.push(previousRoute)"
    backTitle="Enrollment List">
    <template v-slot:content>
      <div class="quick-enroll__body">
        <div class="quick-enroll__side-panel">
          <StageIndicator
            :stages="stages"
            :activeIndex="stageActiveIndex"
            @selectedItem="onSelectStage"
          />
        </div>
        <div v-if="!!Object.keys(data).length" class="quick-enroll__content-area">
          <template v-if="manualStepId === $options.QuickEnrollSteps.PROFILE_AND_ACCOUNT.id">
            <Personal
              :data="data.student || {}"
              @onCompletionChange="onPersonalCompletion"
              :isReadOnly="isReadOnly"
            />
            <Account
              :isReadOnly="isReadOnly"
              @onCompletionChange="onAccountCompletion"
              :data="data.student.user || {}"
              :currentRoute="{
                name: 'Academic Record Applications Detail',
                params: { ...$route.params }
              }"
              :addAccountRoute="{
                name: 'Academic Record Add Account',
                params: { academicRecordId, studentId: data.student.id }
              }"
              :changeUsernameRoute="{
                name: 'Academic Record Change Username',
                params: { academicRecordId, studentId: data.student.id }
              }"
              :changePasswordRoute="{
                name: 'Academic Record Change Password',
                params: { academicRecordId, studentId: data.student.id }
              }"
            />
          </template>
          <template v-else-if="manualStepId === $options.QuickEnrollSteps.SUBJECT_ENLISTMENT.id">
            <AcademicRecord
              :data="data"
              :showNotes="true"
              :isReadOnly="isReadOnly"
            />
            <Enlistment
              :academicRecordId="data.id"
              :data="data"
              :isReadOnly="isReadOnly"
            />
          </template>
        </div>
      </div>
    </template>
    <template v-if="!isReadOnly" v-slot:footer>
      <div class="approval-view__footer">
        <div class="approval-view__actions">
          <b-button
            v-if="manualStepId !== $options.QuickEnrollSteps.PROFILE_AND_ACCOUNT.id"
            variant="dark"
            class="approval-view__back"
            @click="onActionBack">
            <!-- <v-icon name="spinner" spin /> -->
            Back
          </b-button>
          <b-button
            v-if="!isReadOnly && manualStepId === $options.QuickEnrollSteps.PROFILE_AND_ACCOUNT.id"
            variant="primary"
            class="approval-view__next"
            @click="onActionNext"
            :disabled="!(isPersonalCompleted && isAccountCompleted)">
            <v-icon name="spinner" spin v-if="isBusy" />
            Next
          </b-button>
          <b-button
            v-if="!isReadOnly && manualStepId === $options.QuickEnrollSteps.SUBJECT_ENLISTMENT.id"
            variant="primary"
            class="approval-view__next"
            @click="onSubmitAssessmentRequest">
            <v-icon name="spinner" spin v-if="isBusy" />
            Submit
          </b-button>
        </div>
      </div>
    </template>
  </ApprovalView>
</template>

<script>
import Personal from '../../components/Student/Personal';
import Account from '../../components/Student/Account';
import AcademicRecord from '../../components/AcademicRecord/AcademicRecord';
import Enlistment from '../../components/SubjectEnlistment/Enlistment';
import { AcademicRecordApi } from '../../../mixins/api';
import { QuickEnrollSteps, AcademicRecordStatuses } from '../../../helpers/enum'

export default {
  QuickEnrollSteps,
  mixins: [AcademicRecordApi],
  props: {
    previousRoute: {
      type: [Object]
    }
  },
  components: {
    Personal,
    Account,
    AcademicRecord,
    Enlistment
  },
  data() {
    return {
      AcademicRecordStatuses,
      selectedIndex: 0,
      isPersonalCompleted: false,
      isAccountCompleted: false,
      data: {},
      isBusy: false,
      stages: [
        {
          header: 'Profile and Account',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.',
          id: this.$options.QuickEnrollSteps.PROFILE_AND_ACCOUNT.id
        },
        {
          header: 'Subject Enlistment',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          id: this.$options.QuickEnrollSteps.SUBJECT_ENLISTMENT.id
        }
      ]
    }
  },
  computed: {
    academicRecordId() {
      return this.$route.params.academicRecordId;
    },
    manualStepId() {
      return this.data?.manualStepId
    },
    stageActiveIndex() {
      return this.stages.findIndex(s => s.id === this.manualStepId)
    },
    isReadOnly() {
      return [
        AcademicRecordStatuses.ENLISTMENT_APPROVED.id,
        AcademicRecordStatuses.ASSESSMENT_APPROVED.id,
        AcademicRecordStatuses.PAYMENT_SUBMITTED.id,
        AcademicRecordStatuses.ENROLLED.id,
        AcademicRecordStatuses.CLOSED.id,
      ].includes(this.data?.academicRecordStatusId);
    }
  },
  created() {
    this.getAcademicRecord(this.academicRecordId).then(({ data }) => {
      this.data = data;
    });
  },
  methods: {
    onSelectStage(idx) {
      this.selectedIndex = idx;
    },
    onPersonalCompletion(isCompleted) {
      this.isPersonalCompleted = isCompleted;
    },
    onAccountCompletion(isCompleted) {
      this.isAccountCompleted = isCompleted;
    },
    // nextStepId() {
    //    const { PROFILE_AND_ACCOUNT, SUBJECT_ENLISTMENT } = this.$options.QuickEnrollSteps
    //    if(this.manualStepId === PROFILE_AND_ACCOUNT.id){
    //      //if on step 1 next step is enlistment
    //      return SUBJECT_ENLISTMENT.id
    //    }

    //    return PROFILE_AND_ACCOUNT.id
    // },
    onActionNext(){
      this.isBusy = true
      const manualStepId = this.$options.QuickEnrollSteps.SUBJECT_ENLISTMENT.id;
      this.patchAcademicRecord({ manualStepId }, this.academicRecordId).then(({ data }) => {
        this.data.manualStepId = data.manualStepId
        this.isBusy = false
      }).catch((error) => {
        const errors = error.response.data.errors;
        this.isBusy = false
        console.log(errors)
      });
    },
    onSubmitAssessmentRequest() {
      this.isBusy = true
      this.requestAssessment(this.academicRecordId).then(({ data }) => {
        this.data.manualStepId = data.manualStepId
        this.isBusy = false
        this.$emit('onAssessmentRequested')
        this.$router.push(this.previousRoute)
      }).catch((error) => {
        const errors = error.response.data.errors;
        this.isBusy = false
        console.log(errors)
      });
    },
    onActionBack(){
      this.data.manualStepId -= 1
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

   .approval__content {
    margin: 0;
    width: 100%;
    position: relative;
  }

  .quick-enroll__body {
    display: flex;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    flex: 1;
  }

  .quick-enroll__side-panel {
    width: 300px;
    //border-right: 1px solid $light-gray-10;
    padding: 30px;

    @include for-size(phone-only) {
      display: none;
    }
  }

  .quick-enroll__content-area {
    padding: 30px;
    flex: 1;
  }

  .approval-view__footer {
    width: 100%;
    height: 60px;
  }

  .approval-view__next {
    margin-left: auto;
    min-width: 130px;
  }

  .approval-view__back {
    min-width: 110px;
  }

  .approval-view__actions {
    position: fixed;
    width: 100%;
    bottom: 0;
    height: 60px;
    background-color: $white;
    border-top: 1px solid $brand-border-color;
    display: flex;
    align-items: center;
    padding: 10px;
  }
</style>