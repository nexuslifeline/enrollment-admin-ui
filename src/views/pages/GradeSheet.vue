<template>
  <b-row>
    <b-col md="12">
      <div class="section__info">
        {{ section.name }} - {{ subject.name }} {{ subject.description ? `(${subject.description})` : '' }}
      </div>
      <b-table
        class="c-table"
        small
        hover
        outlined
        show-empty
        :fields="tables.students.fields"
        :busy="students.isBusy"
        :items="students.items"
        responsive
      >
        <template v-slot:cell(name)="data">
          <StudentColumn
            :data="{ student: data.item }"
            :callback="{
              loadDetails: () => null,
            }"
          />
        </template>
        <template v-slot:head(gradingPeriods)>
          <div class="cell-term__header">
            <div v-for="gradingPeriod in gradingPeriods" :key="gradingPeriod.id">
              {{ gradingPeriod.name }}
            </div>
          </div>
        </template>
        <template v-slot:cell(gradingPeriods)="{ item }">
          <div class="cell-grading-period" v-if="item.grades">
            
            <vue-autonumeric
              :disabled="item.studentGradeStatusId === $options.StudentGradeStatuses.SUBMITTED.id"
              v-for="gradingPeriod in gradingPeriods"
              v-model="item.grades.find(d => d.id === gradingPeriod.id).pivot.grade"
              :key="gradingPeriod.id"
              class="form-control text-right cell-grading-period-input"
              :options="[
                {
                  minimumValue: 0,
                  maximumValue: 100,
                  modifyValueOnWheel: false,
                  emptyInputBehavior: 0,
                },
              ]"
            />
          </div>
        </template>
        <template v-slot:table-busy>
          <div class="text-center my-2">
            <v-icon name="spinner" spin class="mr-2" />
            <strong>Loading...</strong>
          </div>
        </template>
      </b-table>
    </b-col>
  </b-row>
</template>
<script>
import { StudentColumn } from '../components/ColumnDetails';
import { StudentGradeStatuses } from '../../helpers/enum';
export default {
  name: 'GradeSheet',
  components: {
    StudentColumn
  },
  props: {
    section: {
      default: null,
      type: Object
    },
    subject: {
      default: null,
      type: Object
    },
    students: {
      default: null,
      type: Object
    },
    gradingPeriods: {
      default: null,
      type: Array
    }
  },
  StudentGradeStatuses,
  data() {
    return {
      isProcessing: false,
      isFinalizing: false,
      tables: {
        students: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: '40%' },
            },
            {
              key: 'gradingPeriods',
              label: '',
              tdClass: 'align-middle',
            },
          ],
          items: []
        },
      },
    }
  },
};
</script>
<style lang="scss" scoped>
.cell-grading-period {
  display: flex;
  width: 100%;
  .cell-grading-period-input {
    margin: 0 5px;
  }
}
.cell-term__header {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.btn-save {
  width: 150px;
  margin-right: 5px;
}
.btn-submit {
  width: 200px;
  margin-right: 5px;
}
.section__info {
  font-size: 15pt;
  font-weight: bold;
  margin-bottom: 5px;
}
</style>
