<template>
  <Card title="Co-Department Users">
    <div class="co-department__list">
      <template v-for="item in [1, 2, 3, 4, 5]">
        <Item :data="{ id: item, name: 'Paul Christian Rueda', group: 'System Administrator' }" />
      </template>
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

.co-department__list {
  width: 100%;
  min-height: 250px;
  background-color: $white;
}

</style>
