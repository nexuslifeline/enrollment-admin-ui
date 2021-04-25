<template>
  <CenterContainer>
    <Personal :data="{ id: 1, userable: {} }" />
    <Account />
    <Address />
    <Education />
  </CenterContainer>
</template>

<script>
import Personal from '../../components/Student/Personal';
import Account from '../../components/Student/Account';
import Address from '../../components/Student/Address';
import Education from '../../components/Student/Education';

export default {
  components: {
    Personal,
    Account,
    Address,
    Education
  }
}
</script>

<style lang="scss" scoped >
  @import "../../../assets/scss/_shared.scss";
</style>
