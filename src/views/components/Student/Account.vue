<template>
  <Card
    :title="hasAccount ? 'Account Settings' : 'Create User Account'"
    actionLabel="Create Account"
    @onAddNew="onAddNew"
    titleSize="m"
    :showAction="!hasAccount">
    <template v-if="hasAccount">
      <UsernameItem :username="data ? data.username : ''" :user="data" />
      <hr />
      <PasswordItem />
    </template>
    <router-view
      :user="data"
      :previousRoute="{ name: 'Student Edit', params: { ...$route.params } }">
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
      hasAccount: !!this.data?.username,
      forms: {
        profile: {
          fields: {

          },
          errors: {},
          states: {}
        }
      }
    }
  },
  methods: {
    onSave() {

    },
    onAddNew() {
      this.$router.push({
        name: 'Create Student Account',
        params: { studentId: this.$route.params.studentId }
      });
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";
</style>
