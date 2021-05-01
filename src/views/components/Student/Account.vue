<template>
  <Card
    :title="hasAccount ? 'Account Settings' : 'Create User Account'"
    actionLabel="Create Account"
    @onAddNew="onAddNew"
    titleSize="m"
    :showAction="!hasAccount">
    <template v-if="hasAccount">
      <UsernameItem :user="user" />
      <hr />
      <PasswordItem />
    </template>
    <div v-else>
      No account found.
    </div>
    <router-view
      @onAccountCreated="onAccountCreated"
      :user="user"
      :previousRoute="{
        name: 'Student Edit',
        params: { ...$route.params }
      }">
    </router-view>
  </Card>
</template>
<script>
import UsernameItem from './UsernameItem';
import PasswordItem from './PasswordItem';

export default {
  components: {
    UsernameItem,
    PasswordItem
  },
  props: {
    data: {
      type: [Object]
    }
  },
  data() {
    return {
      user: { ...this.data }
    }
  },
  computed: {
    hasAccount() {
      return !!this.user?.username;
    }
  },
  methods: {
    onAddNew() {
      this.$router.push({
        name: 'Create Student Account',
        params: { studentId: this.$route.params.studentId }
      });
    },
    onAccountCreated(user) {
      this.user = user;
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";
</style>
