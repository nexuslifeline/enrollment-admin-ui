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
      <PasswordItem :data="user"/>
    </template>
    <div v-else>
      No account found.
    </div>
    <router-view
      @onAccountCreated="onAccountCreated"
      @onUserUpdated="onUserUpdated"
      :user="user"
      :previousRoute="{
        name: 'Member Edit',
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
        name: 'Create Member Account',
        params: { personneId: this.$route.params.personneId }
      });
    },
    onAccountCreated(user) {
      this.user = user;
    },
    onUserUpdated(user) {
      this.user = user
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";
</style>
