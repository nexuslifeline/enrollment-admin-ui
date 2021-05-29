<template>
  <Card :title="`Users in ${department}`" titleSize="m" noPaddingBody>
    <div v-if="!!personnels.length" class="co-department__list">
      <template v-for="personnel in personnels">
        <template v-if="personnel.user.id === $store.state.user.id">
          <Item
            :key="personnel.id"
            :data="{ ...personnel, name: `${personnel.name} (You)` }"
          />
        </template>
         <Item
            v-else
            :key="personnel.id"
            :data="personnel"
          />
      </template>
    </div>
    <div v-else class="empty-message">
      No users in current department.
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
  computed: {
    department() {
      return this.personnels?.[0]?.department?.name || 'Department';
    }
  },
  created() {
    this.isLoadingMore = true;
    const params = { departmentId: this.departmentId, paginate: true, perPage: 5, page: this.page.current }
    this.getPersonnelList(params).then(({ data }) => {
      this.personnels = data.data
      this.page.current = data.meta.currentPage
      this.page.to = data.meta.to
      this.page.lastPage = data.meta.lastPage
      this.isLoadingMore = false;
    }).catch((error) => {
      this.isLoadingMore = false;
    });
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
  min-height: 160px;
  background-color: $white;
  padding: 18px;
}

.empty-message {
  padding: 20px;
  min-height: 50px;
  display: flex;
  align-items: center;
}

</style>
