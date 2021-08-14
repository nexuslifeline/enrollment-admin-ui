<template>
  <CenterContainer>
    <template v-if="!!Object.keys(data).length">
      <BackLink />
      <b-tabs content-class="mt-4" lazy>
        <b-tab title="Profile Info" active>
          <Personal :data="data" />
          <Family :data="data.family || {}" />
          <Address :data="data.address || {}" />
          <Education :data="data.education || {}"/>
        </b-tab>
        <b-tab v-if="isStudentRecordTabVisible" title="Student Record">
          <template v-if="isAccessible($options.StudentPermissions.EDIT_ACADEMIC_RECORDS.id)">
            <AcademicRecord
              v-if="data.latestAcademicRecord"
              :data="data.latestAcademicRecord"
              :allowChangeStatus="true"
              title="Latest Academic Record"
            />
          </template>
          <template v-if="isAccessible($options.StudentPermissions.EDIT_EVALUATION.id)">
            <Evaluation
              title="Latest Evaluation"
              v-if="data.latestAcademicRecord && data.latestAcademicRecord.evaluation"
              :data="data.latestAcademicRecord.evaluation"
            />
          </template>
        </b-tab>
        <b-tab title="Account" v-if="isAccountTabVisible">
          <template v-if="isAccessible($options.StudentPermissions.UPDATE_STUDENT_ACCOUNT.id)">
            <Account
              :data="data.user || {}"
              :currentRoute="{ name: 'Student Edit', params: { ...$route.params } }"
              :addAccountRoute="{ name: 'Create Student Account', params: { ...$route.params } }"
            />
          </template>
        </b-tab>
        <b-tab v-if="isSettingsTabVisible" title="Settings">
          <template v-if="isAccessible($options.StudentPermissions.MANAGE_DROPPED_SUBJECTS.id)">
            <Subjects :studentId="$route.params.studentId" />
          </template>
          <template v-if="isAccessible($options.StudentPermissions.EDIT_REQUIREMENTS.id)">
            <StudentRequirements :studentId="data.id"/>
          </template>
          <template v-if="isAccessible($options.StudentPermissions.EDIT_ONBOARDING.id)">
            <OnboardingSettings :data="data" />
          </template>
        </b-tab>
      </b-tabs>
      <!-- v-if="!!Object.keys(data.latestAcademicRecord).length" -->
    </template>
  </CenterContainer>
</template>

<script>
import StudentRequirements from '../../components/StudentRequirements/List';
import AcademicRecord from '../../components/AcademicRecord/AcademicRecord';
import Evaluation from '../../components/Evaluation/Evaluation'
import OnboardingSettings from '../../components/OnboardingSettings/Onboarding';
import Personal from '../../components/Student/Personal';
import Account from '../../components/Student/Account';
import Address from '../../components/Student/Address';
import Education from '../../components/Student/Education';
import Family from '../../components/Student/Family';
import Subjects from '../../components/StudentSubjects/List'; // added here for the meantime while testing the component
import { StudentApi } from '../../../mixins/api';
import { StudentPermissions } from '../../../helpers/enum';
import  Access  from '../../../mixins/utils/Access'

export default {
  StudentPermissions,
  components: {
    Personal,
    Account,
    Address,
    Education,
    Family,
    Subjects,
    OnboardingSettings,
    AcademicRecord,
    Evaluation,
    StudentRequirements
  },
  mixins: [Access, StudentApi],
  data() {
    return {
      data: {}
    }
  },
  computed: {
    isAccountTabVisible() {
      return this.isAccessible(this.$options.StudentPermissions.UPDATE_STUDENT_ACCOUNT.id);
    },
    isStudentRecordTabVisible() {
      return this.isAccessible([
        this.$options.StudentPermissions.EDIT_ACADEMIC_RECORDS.id,
        this.$options.StudentPermissions.EDIT_EVALUATION.id
      ]);
    },
    isSettingsTabVisible() {
      return this.isAccessible([
        this.$options.StudentPermissions.MANAGE_DROPPED_SUBJECTS.id,
        this.$options.StudentPermissions.EDIT_REQUIREMENTS.id,
        this.$options.StudentPermissions.EDIT_ONBOARDING.id
      ]);
    }
  },
  methods: {
    loadData() {
      const studentId = this.$route.params?.studentId
      this.getStudent(studentId).then(({ data }) => {
        this.data = { ...data }
      })
    }
  },
  created() {
    const studentId = this.$route.params?.studentId
    if (studentId && isNaN(studentId)) {
      this.$router.push('/master-files/student')
      return
    }
    this.loadData();
  }
}
</script>

<style lang="scss" scoped >
  @import "../../../assets/scss/_shared.scss";
</style>
