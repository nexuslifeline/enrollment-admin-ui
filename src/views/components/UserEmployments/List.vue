<template>
  <div>
    <Card
      title="Employment"
      actionLabel="Add Employment"
      @onAddNew="selected = {}, isShown = true"
      showAction>
      <div v-if="items.length > 0" class="employment__list">
        <template v-for="(item, idx) in items">
          <Item :data="item" :key="idx" @onEdit="onEditEmployment" />
        </template>
      </div>
      <div v-else>
        <vText size="s" weight="light">No record(s) found.</vText>
      </div>
    </Card>
    <EmploymentForm
      :isShown.sync="isShown"
      @onSave="onSaveEmployment"
      @onCreate="onCreateEmployment"
      @onDelete="onDeleteEmployment"
      :data="selected"
    />
  </div>
</template>
<script>
import Card from '../Card';
import Item from './Item';
import EmploymentForm from './EmploymentForm';

export default {
  components: {
    Card,
    Item,
    EmploymentForm
  },
  props: {
    personnelId: {
      type: [String, Number],
    }
  },
  data() {
    return {
      isShown: false,
      selected: {},
      items: [
        {
          id: 1,
          position: 'Senior Full Stack Developer',
          company: 'Shore360',
          address: 'San Fernando City, Pampanga',
          startMonth: '10',
          startYear: '2020',
          endMonth: '12',
          endYear: '2022',
        },
        {
          id: 2,
          position: 'Software Engineer',
          company: 'D7 Software Solutions',
          address: 'San Fernando City, Pampanga',
          startMonth: '10',
          startYear: '2020',
          endMonth: '12',
          endYear: '2022',
        },
        {
          id: 3,
          position: 'Full Stack Developer',
          company: 'JDEV Software Solutions',
          address: 'San Fernando City, Pampanga',
          startMonth: '10',
          startYear: '2020',
          endMonth: '12',
          endYear: '2022',
        }
      ]
    }
  },
  created() {
    // load user employments here
  },
  methods: {
    onSaveEmployment(id, data) {
      alert(id)
    },
    onCreateEmployment(data) {
      alert('create Employment')
    },
    onDeleteEmployment(id) {
      this.items = this.items.filter(v => v?.id !== id);
      this.isShown = false;
    },
    onEditEmployment(item) {
      this.selected = { ...item };
      this.isShown = true;
    }
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
