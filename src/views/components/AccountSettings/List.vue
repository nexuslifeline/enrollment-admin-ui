<template>
  <Card title="Account Settings">
    <div class="items__list">
      <EmailRow />
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
    }
  },
  data() {
    return {
      
    }
  },
  created() {
    // load user employments here
  }
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
