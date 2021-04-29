<template>
  <CenterContainer :key="compKey">
    <Personal :data="data" />
    <Account :data="data" />
    <Family :data="data" />
    <Address :data="data"/>
    <Education :data="data"/>
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
      data: {
        id: 1,
        userable: {}
      },
      compKey: 1,
      compKey2: 1,
    }
  },
  created() {
    const studentId = this.$route.params?.studentId
    if (studentId && isNaN(studentId)) {
      this.$router.push('/master-files/student')
      return
    }

    this.getStudent(studentId).then(({ data }) => {
      this.data.userable = { ...data }
    })
  }
}
</script>

<style lang="scss" scoped >
  @import "../../../assets/scss/_shared.scss";
</style>
