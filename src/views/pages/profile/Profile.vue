<template>
  <div>
    <AccountSettings :user="user"/>
    <UserEducation :personnelId="personnelId" />
    <UserEmployments :personnelId="personnelId" />
    <router-view></router-view>
  </div>
</template>

<script>
import UserEmployments from '../../components/UserEmployments/List';
import UserEducation from '../../components/UserEducation/List';
import AccountSettings from '../../components/AccountSettings/List';

export default {
  components: {
    UserEmployments,
    UserEducation,
    AccountSettings
  },
  data() {
    return {

    };
  },
  computed: {
    personnelId() {
      return this.$store.state?.user?.userable?.id;
    },
    user() {
      return this.$store.state?.user
    }
  },
  created() {

  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';


</style>
