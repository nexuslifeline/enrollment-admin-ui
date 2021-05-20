<template>
  <div>
    <Card
      title="Student Subjects"
      titleSize="m">
      <template v-slot:header-action>
        <div class="header__action-dropdown">
          <SelectAcademicRecord
            placeholder="Academic Year"
            :value="selectedAcademicRecord"
            :studentId="studentId"
            label="id"
            @input="onAcademicRecordFilterChange"/>
        </div>
      </template>
      <div v-if="options.subjects.items.length > 0" class="subjects__list">
        <template v-for="(item, idx) in options.subjects.items">
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
import { AcademicRecordApi } from '../../../mixins/api';

import Card from '../Card';
import Item from './Item';

export default {
  components: {
    Card,
    Item
  },
  mixins: [ AcademicRecordApi ],
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
      ],
      options: {
        subjects: {
          items: []
        }
      },
      selectedAcademicRecord: null
    }
  },
  created() {
    // load student here using the property student id provided
  },
  methods: {
    onAcademicRecordFilterChange(item) {
      this.selectedAcademicRecord = item;
      if(item) {
        this.loadSubjects()
      }
    },
    onStatusChange(item){
      const { id: academicRecordId } = this.selectedAcademicRecord
      const { data: { id: subjectId }, checked } = item
      const payLoad = { isDropped: checked }
      this.updateAcademicRecordSubject(academicRecordId, subjectId, payLoad).then(({ data }) => {
        console.log(data)
      })
    },
    loadSubjects() {
      const params = { paginate: false }
      const { id } = this.selectedAcademicRecord
      const { subjects } = this.options
      this.getAcademicRecordSubjects(id, params).then(({ data }) => {
        subjects.items = data
      })
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
