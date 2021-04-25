<template>
  <Card title="Account Settings" titleSize="m" :key="key">
    <div class="items__list">
      <EmailRow :username="user.username" :userGroup="user.userGroup.name"/>
      <hr />
      <PasswordRow />
    </div>
  </Card>
</template>
<script>
import Card from '../Card';
import EmailRow from './EmailRow';
import PasswordRow from './PasswordRow';

export default {
  components: {
    Card,
    EmailRow,
    PasswordRow
  },
  props: {
    personnelId: {
      type: [String, Number],
    },
    user: {
      type: [Object]
    }
  },
  data() {
    return {
      key: 1,
    }
  },
  computed: {

  },
  created() {
    // load user employments here
  },
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.items__list {
  width: 100%;
  min-height: 120px;
  background-color: $white;
}

</style>
