<template>
  <Card title="Education" actionLabel="Add Education" showAction>
    <div class="education__list">
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
          title: 'Bachelor of Science in Information Technology',
          address: 'San Fernando City, Pampanga, PH',
          period: 'Jan 2012 - Mar 2016',
        },
        {
          title: 'Cansinal High School (Secondary)',
          address: 'Cansinala, Apalit, Pampanga, PH',
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

.education__list {
  width: 100%;
  min-height: 120px;
  background-color: $white;
}

</style>
