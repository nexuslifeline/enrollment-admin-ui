<template>
  <Card title="Users in Department" titleSize="m" noPaddingBody>
    <div class="co-department__list">
      <template v-for="personnel in personnels">
        <Item :data="{ id: personnel.id, name: personnel.name, group: personnel.user.userGroup.name }" />
      </template>
    </div>
    <ItemLoader v-if="isLoadingMore" />
    <ShowMore v-if="!!page.to && !isLoadingMore && page.current !== page.lastPage" @onShowMore="onShowMore" />
  </Card>
</template>
<script>
import { PersonnelApi } from '../../../mixins/api';
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
  mixins: [ PersonnelApi ],
  data() {
    return {
      page: {
        current: 1,
        to: 2, // this is the next page. you can get this in the response data.meta.to,
        lastPage: 1
      },
      isLoadingMore: false,
      personnels: []
    }
  },
  created() {
    const params = { departmentId: this.departmentId, paginate: true, perPage: 5, page: this.page.current }
    this.getPersonnelList(params).then(({ data }) => {
      this.personnels = data.data
      this.page.current = data.meta.currentPage
      this.page.to = data.meta.to
      this.page.lastPage = data.meta.lastPage
    })
  },
  methods: {
    onShowMore() {
      this.isLoadingMore = true;
      const params = { departmentId: this.departmentId, paginate: true, perPage: 5, page: this.page.current + 1 }
      this.getPersonnelList(params).then(({ data }) => {
        this.personnels.push(...data.data)
        this.page.current = data.meta.currentPage
        this.page.to = data.meta.to
        this.page.lastPage = data.meta.lastPage
        this.isLoadingMore = false;
      })
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
