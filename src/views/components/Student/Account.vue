<template>
  <Card
    :title="hasAccount ? 'Account Settings' : 'Create User Account'"
    actionLabel="Create Account"
    @onAddNew="onAddNew"
    titleSize="m"
    :showAction="!hasAccount">
    <template v-if="hasAccount">
      <UsernameItem />
      <hr />
      <PasswordItem />
    </template>
    <router-view
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
    userable: {
      type: [Object]
    }
  },
  data() {
    return {
      hasAccount: true,
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
        name: 'Create Account',
        params: { studentId: this.$route.params.studentId }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";
</style>
