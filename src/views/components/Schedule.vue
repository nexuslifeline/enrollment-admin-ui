<template>
  <b-card style="min-height: 100%">
    <div v-if="isEntry">
      <b-row>
        <b-col md=8>
          <!-- <span class="entry-header">{{course}} - {{schoolYear}} {{ semester ? `/ ${semester}` : ''}}</span> -->
          <!-- <span class="entry-header">{{details}}</span> -->
          <!-- <span class="entry-header">Details here</span> -->
        </b-col>
        <b-col md=4>
          <b-button variant="primary" class="float-right"  @click="addSchedule()">
            <v-icon name="plus-circle" /> ADD NEW ROW
          </b-button>
        </b-col>
      </b-row>
      <hr>
    </div>
    <b-row>
      <b-col md=2>
        <b-tabs content-class="mt-3" pills vertical v-model="dayActiveIndex" >
          <b-tab title="MONDAY" active/>
          <b-tab title="TUESDAY" />
          <b-tab title="WEDNESDAY" />
          <b-tab title="THURSDAY" />
          <b-tab title="FRIDAY" />
          <b-tab title="SATURDAY" />
          <b-tab title="SUNDAY" />
        </b-tabs>
      </b-col>
      <b-col md=10>
        <b-table
          small hover outlined show-empty
          :fields="tables.scheduleItems.fields"
          :busy="tables.scheduleItems.isBusy"
          :items.sync="filterScheduleItems"
        >
          <template v-slot:cell(startTime)="row">
            <b-form-input
              :disabled="!isEntry"
              @blur="checkTime(true, row)"
              v-model="row.item.startTime"
              type="time" />
          </template>
          <template v-slot:cell(endTime)="row">
            <b-form-input
              :disabled="!isEntry"
              @blur="checkTime(false, row)"
              v-model="row.item.endTime"
              type="time" />
          </template>
          <template v-slot:cell(subjectId)="row">
            <b-form-select
              :disabled="!isEntry"
              :state="scheduleStates ? scheduleStates[`subjectId${getTableIndex(row)}`] : null"
              v-model="row.item.subjectId" >
              <template v-slot:first>
                <b-form-select-option :value="null">-- Select Subject --</b-form-select-option>
              </template>
              <b-form-select-option
                v-for="subject in subjects"
                :key="subject.id"
                :value="subject.id">
                {{ subject.name }}
              </b-form-select-option>
              <b-form-select-option
                v-if="row.item.subject && !isEntry"
                :value="row.item.subject.id">
                {{ row.item.subject.name }}
              </b-form-select-option>
            </b-form-select>
            <b-form-invalid-feedback>
              Subject field is required.
            </b-form-invalid-feedback>
          </template>
          <template v-slot:cell(personnelId)="row">
            <b-form-select
              :disabled="!isEntry"
              :state="scheduleStates ? scheduleStates[`personnelId${getTableIndex(row)}`] : null"
              v-model="row.item.personnelId" >
              <template v-slot:first>
                <b-form-select-option :value="null">-- Select Instructor --</b-form-select-option>
              </template>
              <b-form-select-option
                v-for="instructor in options.instructors.items"
                :key="instructor.id"
                :value="instructor.id">
                {{ instructor.name }}
              </b-form-select-option>
              <b-form-select-option
                v-if="row.item.personnel && !isEntry"
                :value="row.item.personnel.id">
                {{ row.item.personnel.name }}
              </b-form-select-option>
            </b-form-select>
            <b-form-invalid-feedback>
              Instructor field is required.
            </b-form-invalid-feedback>
          </template>
          <template v-slot:cell(isLab)="{ item }">
            <b-form-checkbox
              :disabled="!isEntry"
              v-model="item.isLab"/>
          </template>
          <template v-slot:cell(remarks)="{ item }">
            <b-form-input
              :disabled="!isEntry"
              v-model="item.remarks"/>
          </template>
          <template v-slot:cell(action)="row">
            <b-button
              v-if="isEntry"
              @click="removeSchedule(row)"
              size="sm"
              variant="danger">
              <v-icon
                name="trash" />
              </b-button>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-card>
</template>
<script>
import Tables from '../../helpers/tables'
import { CurriculumApi, PersonnelApi } from '../../mixins/api'
import { UserGroups } from '../../helpers/enum'
import { showNotification } from '../../helpers/forms'

export default {
  mixins: [ Tables, CurriculumApi, PersonnelApi ],
  props: {
    isEntry: Boolean,
    isShown: Boolean,
    details: String,
    scheduleItems: Array,
    scheduleStates: Object,
    subjects: Array
  },
  data() {
    return {
      dayActiveIndex: 0,
      tables: {
        scheduleItems: {
          isBusy: false,
          fields: [
            {
							key: "startTime",
							label: "START TIME",
							tdClass: "align-top",
							thStyle: { width: "12%" },
            },
            {
							key: "endTime",
							label: "END TIME",
							tdClass: "align-top",
							thStyle: { width: "12%" },
            },
            {
							key: "subjectId",
							label: "SUBJECT",
							tdClass: "align-top",
							thStyle: { width: "20%" },
            },
            {
							key: "personnelId",
							label: "INSTRUCTOR",
							tdClass: "align-top",
							thStyle: { width: "20%" },
            },
            {
							key: "isLab",
							label: "IS LAB?",
							tdClass: "align-top text-center",
							thStyle: { width: "5%", minWidth: "75px" },
            },
            {
							key: "remarks",
							label: "REMARKS",
							tdClass: "align-top",
							thStyle: { width: "auto" },
            },
            {
              key: "action",
              label: "",
              tdClass: "align-top",
              thStyle: { width: "45px" }
            }
          ],
          filteredItems: []
        }
      },
      filters: {
        scheduleItem: {
          criteria: null
        }
      },
      options: {
        instructors:{
          items: []
        },
        subjects: {
          items: []
        }
      }
    }
  },
  created(){
    this.loadPersonnel()
  },
  methods: {
    loadPersonnel() {
      const params = { paginate: false, userGroupId: UserGroups.INSTRUCTOR.id }
      const { instructors } = this.options
      this.getPersonnelList(params)
      .then(({ data }) => {
        instructors.items = data
      })
    },
    addSchedule() {
      const filteredScheduleItems = this.filterScheduleItems
      let newStartTime = "07:00"
      let newEndTime = "08:00"
      if (filteredScheduleItems.length > 0) {
        const index = filteredScheduleItems.length - 1
        const {
          startTime,
          endTime,
          subjectId,
          personnelId,
         } = filteredScheduleItems[index]
        if (startTime === null || endTime === null || subjectId === null || personnelId === null) {
          showNotification(this, 'danger', 'Fill up all fields before adding.')
          return
        }
        newStartTime = endTime
        newEndTime = this.computeTimeByHour(endTime, 1)
      }
      this.scheduleItems.push({
        startTime: newStartTime,
        endTime: newEndTime,
        subjectId: null,
        personnelId: null,
        isLab: 0,
        remarks: '',
        dayId: this.dayActiveIndex + 1
      })
    },
    removeSchedule(row) {
      const { item } = row
      const index = this.getTableIndex(row)
      this.scheduleItems.splice(index, 1)
    },
    checkTime(isStart, row) {
      const { item, index } = row
      const scheduleItems = this.filterScheduleItems
      if (isStart) {
        if (row.index !== 0) {
          const lastEndTime = scheduleItems[index - 1].endTime
          if (item.startTime < lastEndTime) {
            item.startTime = lastEndTime
            showNotification(this, 'danger', 'Start time must be later than the last schedule.')
            return
          }
        }
        // if (item.startTime >= item.endTime) {
        //   item.startTime = this.computeTimeByHour(item.endTime, -1)
        //   showNotification(this, 'danger', 'Start time must be earlier than the end time.')
        //   return
        // }
      } else {
        if (item.endTime <= item.startTime) {
          item.endTime = this.computeTimeByHour(item.startTime, 1)
          showNotification(this, 'danger', 'End time must be later than the start time.')
          return
        } else {
          const rows = scheduleItems.length - (row.index + 1)
          if (rows) {
            for (var i = 0; i < rows; i++) {
              const index =  scheduleItems.length - rows + i
              const row = scheduleItems[index]
              if (row.startTime <= item.endTime) {
                const time = scheduleItems[index - 1].endTime
                row.startTime = time
                row.endTime = this.computeTimeByHour(time, 1)
              }
            }
          }
        }
      }
    },
    computeTimeByHour(time, num) {
      const newTime = time.split(':')
      const condition = num < 0 ? [0, 23] : [23, 0]
      const hour = String(Number(newTime[0]) === condition[0] ? condition[1] : Number(newTime[0]) + Number(num))
      const minute = String(newTime[1])
      return `${hour.length === 1 ? `0${hour}` : hour}:${minute.length === 1 ? `0${minute}` : minute}`
    },
    getTableIndex(row) {
      const { item } = row
      const index = this.scheduleItems.findIndex(i =>
        i.startTime === item.startTime &&
        i.endTime === item.endTime &&
        i.subjectId === item.subjectId &&
        i.personnelId === item.personnelId &&
        i.isLab === item.isLab &&
        i.remarks === item.remarks &&
        i.dayId === item.dayId
      )
      return index;
    }
  },
  computed: {
    filterScheduleItems() {
      if (this.scheduleItems) {
        const filterScheduleItems = this.scheduleItems.filter(s => s.dayId === (this.dayActiveIndex + 1))
        return filterScheduleItems
      }
      return []
    }
  },
  watch: {
    isShown(value) {
      if (value) {
        this.dayActiveIndex = 0
      }
    },
    scheduleStates(value) {
      if (value) {
        const key = Object.keys(value)[0]
        const index = key.substring(key.length - 1, key.length)
        this.dayActiveIndex = this.scheduleItems[index].dayId - 1
      }
    }
  }
}
</script>
<style>
  .entry-header {
    font-size: 14pt;
  }
</style>