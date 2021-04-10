<template>
  <div>
    <Card
      title="Education"
      actionLabel="Add Education"
      @onAddNew="selected = {}, isShown = true"
      showAction>
      <div v-if="items.length > 0" class="education__list">
        <template v-for="(item, idx) in items">
          <Item :data="item" :key="idx" @onEdit="onEditEducation" />
        </template>
      </div>
      <div v-else>
        <vText size="s" weight="light">No record(s) found.</vText>
      </div>
    </Card>
    <EducationForm
      :isShown.sync="isShown"
      @onSave="onSaveEducation"
      @onCreate="onCreateEducation"
      @onDelete="onDeleteEducation"
      :data="selected"
    />
  </div>
</template>
<script>
import Card from '../Card';
import Item from './Item';
import EducationForm from './EducationForm';
export default {
  components: {
    Card,
    Item,
    EducationForm
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
          school: 'St. Nicolas College of Business and Administration',
          field: 'Bachelor of Science in Information Technology',
          address: 'San Fernando City, Pampanga, PH',
          start: '2016',
          end: '2018',
        },
        {
          id: 2,
          school: 'Cansinal High School (Secondary)',
          field: 'Junior High School',
          address: 'Cansinala, Apalit, Pampanga, PH',
          start: '2016',
          end: '2018',
          societies: 'Boyscout of the Philippines',
        }
      ]
    }
  },
  created() {
    // load user employments here
  },
  methods: {
    onSaveEducation(id, data) {
      alert(id)
    },
    onCreateEducation(data) {
      alert('create education')
    },
    onDeleteEducation(id) {
      this.items = this.items.filter(v => v?.id !== id);
      this.isShown = false;
    },
    onEditEducation(item) {
      this.selected = { ...item };
      this.isShown = true;
    }
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
