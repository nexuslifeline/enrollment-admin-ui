<template>
  <div>
    <AccountSettings />
    <UserEducation :personnelId="personnelId" />
    <UserEmployments :personnelId="personnelId" />
  </div>
</template>

<script>
import UserEmployments from '../components/UserEmployments/List';
import UserEducation from '../components/UserEducation/List';
import AccountSettings from '../components/AccountSettings/List';

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
    }
  },
  created() {

  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/shared.scss';


</style>
