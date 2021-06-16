<template>
  <ApprovalView
    :showOptions="false"
    :showFooter="true"
    @onBack="$router.push(previousRoute)"
    backTitle="Enrollment List"
    @onActionBack="onActionBack"
    @onActionNext="onActionNext"
    :isBackDisabled="manualStepId === $options.QuickEnrollSteps.PROFILE_AND_ACCOUNT.id"
    :isNextBusy="isNextBusy">
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
            />
            <Account
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
            <AcademicRecord :data="data" />
            <Enlistment :academicRecordId="data.id" :data="data"/>
          </template>
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
import { QuickEnrollSteps } from '../../../helpers/enum'

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
      selectedIndex: 0,
      data: {},
      isNextBusy: false,
      stages: [
        {
          header: 'Profile and Account',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.',
          quickEnrollStepId: this.$options.QuickEnrollSteps.PROFILE_AND_ACCOUNT.id
        },
        {
          header: 'Subject Enlistment',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          quickEnrollStepId: this.$options.QuickEnrollSteps.SUBJECT_ENLISTMENT.id
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
    stageActiveIndex(){
      return this.stages.findIndex(s => s.quickEnrollStepId === this.manualStepId)
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
      console.log('personal profile completed', isCompleted);
    },
    onAccountCompletion(isCompleted) {
      console.log('user account completed', isCompleted);
    },
    nextStepId() {
       const { PROFILE_AND_ACCOUNT, SUBJECT_ENLISTMENT } = this.$options.QuickEnrollSteps
       if(this.manualStepId === PROFILE_AND_ACCOUNT.id){
         //if on step 1 next step is enlistment
         return SUBJECT_ENLISTMENT.id
       }

       return PROFILE_AND_ACCOUNT.id
    },
    onActionNext(){
      this.isNextBusy = true
      this.patchAcademicRecord({ manualStepId: this.nextStepId() }, this.academicRecordId).then(({ data }) => {
        this.data.manualStepId = data.manualStepId
        this.isNextBusy = false
      }).catch((error) => {
        const errors = error.response.data.errors;
        this.isNextBusy = false
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
</style>