<template>
  <CenterContainer>
    <template v-if="!!Object.keys(data).length">
      <BackLink :previousRoute="{ name: 'Member List' }" />
      <Personal :data="data" />
      <Account :data="data.user || {}" />
      <Contact :data="data"/>
      <UserEducation :personnelId="$route.params.personnelId"/>
      <UserEmployments :personnelId="$route.params.personnelId"/>
    </template>
  </CenterContainer>
</template>

<script>
import Personal from '../../components/Member/Personal';
import Account from '../../components/Member/Account';
import Contact from '../../components/Member/Contact';
import UserEmployments from '../../components/UserEmployments/List';
import UserEducation from '../../components/UserEducation/List';
import AccountSettings from '../../components/AccountSettings/List';
import { PersonnelApi } from '../../../mixins/api';

export default {
  components: {
    Personal,
    UserEmployments,
    UserEducation,
    AccountSettings,
    Contact,
    Account
  },
  mixins: [PersonnelApi],
  data() {
    return {
      data: {}
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      const { personnelId } = this.$route.params;
      this.getPersonnel(personnelId).then(({ data }) => {
        this.data = data;
      });
    }
  }
}
</script>

<style lang="scss" scoped >
  @import "../../../assets/scss/_shared.scss";
</style>
