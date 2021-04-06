<template>
  <Card title="Education">
    <div class="education__list">
      
    </div>
  </Card>
</template>
<script>
import Card from '../Card';
import Item from './Item';
export default {
  components: {
    Card,
    Item
  },
  props: {
    departmentId: {
      type: [String, Number],
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.education__list {
  width: 100%;
  min-height: 250px;
  background-color: $white;
}

</style>
