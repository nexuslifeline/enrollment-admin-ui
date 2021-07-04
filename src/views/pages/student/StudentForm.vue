<template>
  <CenterContainer>
    <template v-if="!!Object.keys(data).length">
      <BackLink />
      <Personal :data="data" />
      <Account
        :data="data.user || {}"
        :currentRoute="{ name: 'Student Edit', params: { ...$route.params } }"
        :addAccountRoute="{ name: 'Create Student Account', params: { ...$route.params } }"
      />
      <Family :data="data.family || {}" />
      <Address :data="data.address || {}" />
      <Education :data="data.education || {}"/>
      <Subjects :studentId="$route.params.studentId" />
      <OnboardingSettings :data="data" />
      <AcademicRecord
        v-if="!!Object.keys(data.latestAcademicRecord).length"
        :data="data.latestAcademicRecord"
        :allowChangeStatus="true"
        title="Latest Academic Record"
      />
    </template>
  </CenterContainer>
</template>

<script>
import AcademicRecord from '../../components/AcademicRecord/AcademicRecord';
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
    AcademicRecord
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
