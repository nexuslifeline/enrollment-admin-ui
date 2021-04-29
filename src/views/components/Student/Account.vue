<template>
  <Card
    :title="hasAccount ? 'Account Settings' : 'Create User Account'"
    actionLabel="Create Account"
    @onAddNew="onAddNew"
    titleSize="m"
    :showAction="!hasAccount">
    <template v-if="hasAccount">
      <UsernameItem :username="userable.user ? userable.user.username : ''" :user="data.userable.user"/>
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
    data: {
      type: [Object]
    }
  },
  data() {
    return {
      hasAccount: false,
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
  computed: {
    // hasAccount() {
    //   console.log(this.userable)
    //   return !!this.userable?.user
    // },
    userable() {
      const { userable } = this.data;
      return userable
    },
  },
  watch: {
    'data.userable' : function(val) {
      this.hasAccount = !!this.data.userable?.user
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";
</style>
