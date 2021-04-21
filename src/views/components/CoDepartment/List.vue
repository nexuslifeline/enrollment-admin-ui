<template>
  <Card title="Users in Department" titleSize="m" noPaddingBody>
    <div class="co-department__list">
      <template v-for="item in [1, 2, 3, 4, 5]">
        <Item :data="{ id: item, name: 'Paul Christian Rueda', group: 'System Administrator' }" />
      </template>
    </div>
    <ItemLoader v-if="isLoadingMore" />
    <ShowMore v-if="!!page.to && !isLoadingMore" @onShowMore="onShowMore" />
  </Card>
</template>
<script>
import Card from '../Card';
import Item from './Item';
import ShowMore from './ShowMore';
import ItemLoader from './ItemLoader';
export default {
  components: {
    Card,
    Item,
    ShowMore,
    ItemLoader
  },
  props: {
    departmentId: {
      type: [String, Number],
    }
  },
  data() {
    return {
      page: {
        current: 1,
        to: 2 // this is the next page. you can get this in the response data.meta.to
      },
      isLoadingMore: false
    }
  },
  created() {
    console.log('load first page here')
  },
  methods: {
    onShowMore() {
      this.isLoadingMore = true;
      alert('load next page here(limit to 5 per_page) and update page.current and page.to.')
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.co-department__list {
  width: 100%;
  min-height: 250px;
  background-color: $white;
  padding: 18px;
}

</style>
