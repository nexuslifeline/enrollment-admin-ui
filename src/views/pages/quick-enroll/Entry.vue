<template>
  <ApprovalView
    :showOptions="false"
    :showFooter="true"
    @onBack="$router.push(previousRoute)"
    backTitle="Enrollment List"
    @onActionBack="onActionBack"
    @onActionNext="onActionNext">
    <template v-slot:content>
      <div class="quick-enroll__body">
        <div class="quick-enroll__side-panel">
          <StageIndicator
            :stages="stages"
            :activeIndex="selectedIndex"
            @selectedItem="onSelectStage"
          />
        </div>
        <div v-if="!!Object.keys(data).length" class="quick-enroll__content-area">
          <template v-if="selectedIndex === 0">
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
          <template v-else-if="selectedIndex === 1">
            <AcademicRecord :data="data" />
            <Enlistment :academicRecordId="data.id" :data="data"/>
          </template>
          <template v-else-if="selectedIndex === 2">

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

export default {
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
      stages: [
        {
          header: 'Profile and Account',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.'
        },
        {
          header: 'Subject Enlistment',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        }
      ]
    }
  },
  computed: {
    academicRecordId() {
      return this.$route.params.academicRecordId;
    }
  },
  created() {
    this.getAcademicRecord(this.academicRecordId).then(({ data }) => {
      this.data = data;
      console.log('data', data)
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
    onActionNext(){
      alert('next')
    },
    onActionBack(){
      alert('back')
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