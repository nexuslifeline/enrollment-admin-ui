<template>
  <Card title="Employment" actionLabel="Add Employment" showAction>
    <div class="employment__list">
      <template v-for="(item, idx) in items">
        <Item :data="item" :key="idx" />
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
    personnelId: {
      type: [String, Number],
    }
  },
  data() {
    return {
      items: [
        {
          title: 'Senior Full Stack Developer',
          address: 'Shore360',
          period: 'Jan 2012 - Mar 2016',
        },
        {
          title: 'Software Engineer',
          address: 'D7 Software Solutions',
          period: 'Jan 2012 - Mar 2016',
        },
        {
          title: 'Full Stack Developer',
          address: 'JDEV Software Solutions',
          period: 'Jan 2012 - Mar 2016',
        }
      ]
    }
  },
  created() {
    // load user employments here
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.employment__list {
  width: 100%;
  min-height: 120px;
  background-color: $white;
}

</style>
