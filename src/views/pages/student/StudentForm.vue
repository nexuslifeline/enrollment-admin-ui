<template>
  <CenterContainer>
    <template v-if="!!Object.keys(data).length">
      <BackLink />
      <Personal :data="data" />
      <Account :data="data.user || {}" />
      <Family :data="data.family || {}" />
      <Address :data="data.address || {}" />
      <Education :data="data.education || {}"/>
    </template>
  </CenterContainer>
</template>

<script>
import Personal from '../../components/Student/Personal';
import Account from '../../components/Student/Account';
import Address from '../../components/Student/Address';
import Education from '../../components/Student/Education';
import Family from '../../components/Student/Family';
import { StudentApi } from '../../../mixins/api';

export default {
  components: {
    Personal,
    Account,
    Address,
    Education,
    Family
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
