<template>
  <CenterContainer>
    <template v-if="!!Object.keys(data).length">
      <BackLink />
      <b-tabs content-class="mt-4">
        <b-tab title="Profile Information" active>
          <Personal :data="data" />
          <Family :data="data.family || {}" />
          <Address :data="data.address || {}" />
          <Education :data="data.education || {}"/>
        </b-tab>
        <b-tab title="Academic Record">
          <Evaluation
            title="Latest Evaluation"
            v-if="data.latestAcademicRecord && data.latestAcademicRecord.evaluation"
            :data="data.latestAcademicRecord.evaluation"
          />

          <AcademicRecord
            v-if="data.latestAcademicRecord"
            :data="data.latestAcademicRecord"
            :allowChangeStatus="true"
            title="Latest Academic Record"
          />
          <Subjects :studentId="$route.params.studentId" />
        </b-tab>
        <b-tab title="Settings">
          <Account
            :data="data.user || {}"
            :currentRoute="{ name: 'Student Edit', params: { ...$route.params } }"
            :addAccountRoute="{ name: 'Create Student Account', params: { ...$route.params } }"
          />
          <OnboardingSettings :data="data" />
        </b-tab>
      </b-tabs>
      <!-- v-if="!!Object.keys(data.latestAcademicRecord).length" -->
    </template>
  </CenterContainer>
</template>

<script>
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

export default {
  components: {
    Personal,
    Account,
    Address,
    Education,
    Family,
    Subjects,
    OnboardingSettings,
    AcademicRecord,
    Evaluation
  },
  mixins: [ StudentApi ],
  data() {
    return {
      data: {}
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
