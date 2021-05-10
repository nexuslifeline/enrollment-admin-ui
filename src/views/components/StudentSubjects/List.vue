<template>
  <div>
    <Card
      title="Student Subjects"
      titleSize="m">
      <template v-slot:header-action>
        <div class="header__action-dropdown">
          <SelectAcademicRecord placeholder="Academic Record" />
        </div>
      </template>
      <div v-if="items.length > 0" class="subjects__list">
        <template v-for="(item, idx) in items">
          <Item :data="item" :key="idx" @onChange="onStatusChange" />
        </template>
      </div>
      <div v-else>
        <vText size="s" weight="light">No record(s) found.</vText>
      </div>
    </Card>
  </div>
</template>
<script>

import Card from '../Card';
import Item from './Item';

export default {
  components: {
    Card,
    Item
  },
  mixins: [],
  props: {
    studentId: {
      type: [String, Number],
    }
  },
  data() {
    return {
      items: [
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ]
    }
  },
  created() {
    // load student here using the property student id provided
  },
  methods: {
    onStatusChange(item) {
      console.log(item)
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.subjects__list {
  width: 100%;
  min-height: 120px;
  background-color: $white;
  margin: -20px 0;
}

.header__action-dropdown {
  min-width: 40%;
}

</style>
