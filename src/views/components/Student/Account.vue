<template>
  <Card
    :title="hasAccount ? 'Manage Student Account' : 'Create User Account'"
    actionLabel="Create Account"
    @onAddNew="onAddNew"
    titleSize="m"
    :isCompleted="hasAccount"
    :showAction="!hasAccount && !isReadOnly">
    <template v-if="hasAccount">
      <UsernameItem
        :user="user"
        :route="changeUsernameRoute || defaultRoutes.changeUsername"
        :isReadOnly="isReadOnly"
      />
      <hr />
      <PasswordItem
        :route="changePasswordRoute || defaultRoutes.changePassword"
        :isReadOnly="isReadOnly"
        :data="user"
      />
    </template>
    <div v-else>
      No account found.
    </div>
    <router-view
      @onAccountCreated="onAccountCreated"
      @onUserUpdated="onUserUpdated"
      :user="user"
      :previousRoute="currentRoute"
    />
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
    },
    addAccountRoute: {
      type: [Object],
    },
    currentRoute: {
      type: [Object],
    },
    changeUsernameRoute: {
      type: [Object],
    },
    changePasswordRoute: {
      type: [Object],
    },
    isReadOnly: {
      type: [Boolean],
      default: false
    }
  },
  data() {
    return {
      user: { ...this.data },
      defaultRoutes: {
        changeUsername: {
          name: 'Change Student Username',
          params: { ...this.$route.params }
        },
        changePassword: {
          name: 'Change Student Password',
          params: { ...this.$route.params }
        }
      }
    }
  },
  computed: {
    hasAccount() {
      return !!this.user?.username;
    }
  },
  created() {
    this.registerObservers();
  },
  methods: {
    registerObservers() {
      this.$watch('user', this.checkCompletion, { deep: true, immediate: true });
    },
    checkCompletion() {
      this.$emit('onCompletionChange', this.hasAccount);
    },
    onAddNew() {
      this.$router.push(this.addAccountRoute);
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
