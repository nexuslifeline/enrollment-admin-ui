<template>
  <div>
    <Card
      title="Manage Dropped Subjects"
      titleSize="m">
      <template v-slot:header-action>
        <div class="header__action-dropdown">
          <SelectAcademicRecord
            placeholder="Academic Year"
            :value="selectedAcademicRecord"
            :studentId="studentId"
            label="id"
            @input="onAcademicRecordFilterChange"
            :includeDraftStatus="false"/>
        </div>
      </template>
      <b-overlay :show="isLoading" rounded="sm">
        <div v-if="options.subjects.items.length > 0" class="subjects__list">
          <template v-for="(item, idx) in options.subjects.items">
            <Item :data="item" :key="idx" @onChange="onStatusChange" />
          </template>
        </div>
        <div v-else>
          <vText size="s" weight="light">No record(s) found.</vText>
        </div>
      </b-overlay>
    </Card>
  </div>
</template>
<script>
import { AcademicRecordApi, StudentApi } from '../../../mixins/api';
import { AcademicRecordStatuses } from '../../../helpers/enum'

import Card from '../Card';
import Item from './Item';

export default {
  components: {
    Card,
    Item
  },
  mixins: [ AcademicRecordApi, StudentApi ],
  props: {
    studentId: {
      type: [String, Number],
    },
  },
  data() {
    return {
      AcademicRecordStatuses,
      items: [],
      options: {
        subjects: {
          items: []
        }
      },
      selectedAcademicRecord: null,
      data: {},
      isLoading: true
    }
  },
  created() {
    // load student here using the property student id provided
    this.getStudent(this.studentId).then(({ data }) => {
      this.data = data
      this.selectedAcademicRecord = this.defautlAcademicRecord(data)
      this.loadSubjects()
    })
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

      if(!this.selectedAcademicRecord) {
        this.isLoading = false
        return
      }

      const params = { paginate: false }
      const { id } = this.selectedAcademicRecord
      const { subjects } = this.options
      this.isLoading = true

      this.getAcademicRecordSubjects(id, params).then(({ data }) => {
        subjects.items = data
        this.isLoading = false
        // alert('test')
      })
    },
    defautlAcademicRecord(data){
      const { latestAcademicRecord } = data

      if(latestAcademicRecord && latestAcademicRecord?.academicRecordStatusId === this.AcademicRecordStatuses.DRAFT.id)
      return null

      return latestAcademicRecord
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
