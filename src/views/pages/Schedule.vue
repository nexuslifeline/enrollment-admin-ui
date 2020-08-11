<template>
  <div>
    <div v-show="!showEntry">
      <b-row>
        <b-col md=12>
          <b-card>
            <b-card-body>
              <!-- add button and search -->
              <b-row class="mb-3">
                <b-col md=12>
                  <b-row>
                    <b-col md=8>
                      <b-button variant="outline-primary" 
                        @click="setCreate()">
                        <v-icon name="plus-circle" /> ADD NEW SCHEDULE
                      </b-button>
                    </b-col>
                    <b-col md=4>
                      <b-form-input
                        v-model="filters.schedule.criteria"
                        type="text" 
                        placeholder="Search">
                      </b-form-input>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <b-row>
                <b-col md=12>
                  <b-table
                    small hover outlined show-empty
                    :fields="tables.schedules.fields"
                    :busy="tables.schedules.isBusy"
                    :items="tables.schedules.items"
                    :current-page="paginations.schedule.page"
                    :per-page="paginations.schedule.perPage"
                    :filter="filters.schedule.criteria"
                    @filtered="onFiltered($event, paginations.subject)">
                  </b-table>
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </div>
    <div v-show="showEntry">
      <b-card style="min-height: 100%">
         <b-row>
          <b-col md=12>
            <span class="entry-header">BSIT 1A - SY: 2020 - 2021 / 1ST SEMESTER</span>
          </b-col>
        </b-row>
        <b-row class="mt-5">
          <b-col md=2>
            <b-tabs content-class="mt-3" pills vertical v-model="dayActiveIndex" >
              <b-tab @click="filterScheduleItems()" title="MONDAY" active/> 
              <b-tab @click="filterScheduleItems()" title="TUESDAY" /> 
              <b-tab @click="filterScheduleItems()" title="WEDNESDAY" /> 
              <b-tab @click="filterScheduleItems()" title="THURSDAY" /> 
              <b-tab @click="filterScheduleItems()" title="FRIDAY" /> 
              <b-tab @click="filterScheduleItems()" title="SATURDAY" /> 
              <b-tab @click="filterScheduleItems()" title="SUNDAY" /> 
            </b-tabs>
          </b-col>
          <b-col md=10>
            <b-row class="mb-2">
              <b-col md=12>
                <b-row>
                  <b-col md=12 >
                    <b-button variant="outline-primary" class="float-right"  @click="addNewRow()">
                      <v-icon name="plus-circle" /> ADD NEW ROW
                    </b-button>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row>
              <b-col md=12>
                <b-table
                  small hover outlined show-empty
                  :fields="tables.scheduleItems.fields"
                  :busy="tables.scheduleItems.isBusy"
                  :items="tables.scheduleItems.filteredItems"
                  @filtered="onFiltered($event, paginations.scheduleItem)"
                  :filter="filters.scheduleItem.criteria"
                  :current-page="paginations.scheduleItem.page"
                  :per-page="paginations.scheduleItem.perPage"
                >
                  <template v-slot:cell(startTime)="row">
                    <b-form-input type="time"></b-form-input>
                  </template>
                  <template v-slot:cell(endTime)="row">
                    <b-form-input type="time"></b-form-input>
                  </template>
                  <template v-slot:cell(subject.id)="row">
                    <b-form-select 
                      v-model="row.item.subject.id" >
                      <template v-slot:first>
                        <b-form-select-option :value="null">-- Select Subject --</b-form-select-option>
                      </template>
                      <b-form-select-option 
                        v-for="subject in options.subjects.items" 
                        :key="subject.id" 
                        :value="subject.id">
                        {{ subject.name }}
                      </b-form-select-option>
                    </b-form-select>
                  </template>
                  <template v-slot:cell(personnel.id)="row">
                    <b-form-select 
                      v-model="row.item.personnel.id" >
                      <template v-slot:first>
                        <b-form-select-option :value="null">-- Select Instructor --</b-form-select-option>
                      </template>
                      <b-form-select-option 
                        v-for="personnel in options.personnels.items" 
                        :key="personnel.id" 
                        :value="personnel.id">
                        {{ personnel.name }}
                      </b-form-select-option>
                    </b-form-select>
                  </template>
                  <template v-slot:cell(isLab)="row">
                    <b-form-checkbox></b-form-checkbox>
                  </template>
                  <template v-slot:cell(remarks)="row">
                    <b-form-input></b-form-input>
                  </template>
                </b-table>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </div>
</template>

<script>
import Tables from '../../helpers/tables'

export default {
  mixins: [ Tables ],
  data() {
    return {
      showEntry: true,
      dayActiveIndex: 0,
      tables: {
        schedules: {
          isBusy : false,
          fields : [
            {
							key: "schoolYear.name",
							label: "Section",
							tdClass: "align-middle",
							thStyle: { width: "10%" },
						},
            {
							key: "section.name",
							label: "Section",
							tdClass: "align-middle",
							thStyle: { width: "20%" },
						},
          ],
          items: []
        },
        scheduleItems: {
          fields: [
            {
							key: "startTime",
							label: "START TIME",
							tdClass: "align-middle",
							thStyle: { width: "12%" },
            },
            {
							key: "endTime",
							label: "END TIME",
							tdClass: "align-middle",
							thStyle: { width: "12%" },
            },
            {
							key: "subject.id",
							label: "SUBJECT",
							tdClass: "align-middle",
							thStyle: { width: "20%" },
            },
            {
							key: "personnel.id",
							label: "INSTRUCTOR",
							tdClass: "align-middle",
							thStyle: { width: "20%" },
            },
            {
							key: "isLab",
							label: "LEC/LAB",
							tdClass: "align-middle",
							thStyle: { width: "5%" },
            },
            {
							key: "remarks",
							label: "REMARKS",
							tdClass: "align-middle",
							thStyle: { width: "auto" },
						},
          ],
          items: [
            {
              id: null,
              dayId: 1,
              startTime: null,
              endTime: null,
              subject: { id : 2 },
              personnel: { id : 1 },
              isLab: 0,
              remarks: ''
            },
            {
              id: null,
              dayId: 1,
              startTime: null,
              endTime: null,
              subject: { id : 1 },
              personnel: { id : 2 },
              isLab: 0,
              remarks: ''
            },
            {
              id: null,
              dayId: 2,
              startTime: null,
              endTime: null,
              subject: { id : 1 },
              personnel: { id : 2 },
              isLab: 0,
              remarks: ''
            }
          ],
          filteredItems: []
        }
      },
      filters: {
        schedule: {
          criteria: null
        },
        scheduleItem: {
          criteria: null,
          dayId: 0
        }
      },
      paginations: {
				schedule: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
        },
        scheduleItem: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
        },
      },
      options: {
        personnels:{
          items :[
            {
              id: 1,
              name: 'Jose Rizal'
            },
            {
              id: 2,
              name: 'Andres Bonifacio'
            },
            {
              id: 3,
              name: 'Marcelo Del Pilar'
            },
            {
              id: 4,
              name: 'Gregorio Del Pilar'
            },
            {
              id: 5,
              name: 'Juan Luna'
            },
          ],
        }, 
        subjects: {
          items: [
            {
              id: 1,
              name: 'DATASTRUCT 1',
              description: 'DATA STRUCTURE 1'
            },
            {
              id: 2,
              name: 'DATASTRUCT 2',
              description: 'DATA STRUCTURE 2'
            },
            {
              id: 3,
              name: 'COMPROG 1',
              description: 'COMPUTER PROGRAMMING 1'
            },
            {
              id: 4,
              name: 'COMPROG 2',
              description: 'COMPUTER PROGRAMMING 2'
            },
            {
              id: 5,
              name: 'ENG 1',
              description: 'ENGLISH 1'
            },
            {
              id: 6,
              name: 'ENG 2',
              description: 'ENGLISH 2'
            },
          ]
        } 
      }
    }
  },
  created() {
    this.filterScheduleItems()
  },
  methods: {
    setCreate() {
      this.showEntry = true
    },
    addNewRow () {
      console.log('add bnew row')
      const { filteredItems } = this.tables.scheduleItems

      filteredItems.push({
        id: null,
        startTime: null,
        endTime: null,
        subject: { id : null },
        personnel: { id : null },
        isLab: 0,
        remarks: '',
        dayId: this.dayActiveIndex + 1
      })
    },
    filterScheduleItems() {
      const { scheduleItems } = this.tables
      const { scheduleItem } = this.paginations
      //paki check mo nlang filter, linagyan ko next tick, parang kc na ddelay ung pg updatend nagn active index

      this.$nextTick(() => {
        let dayId = this.dayActiveIndex + 1
        scheduleItems.filteredItems = scheduleItems.items.filter(scheduleItem => scheduleItem.dayId === dayId)
      });
        
      this.onFiltered(scheduleItems.filteredItems, scheduleItem)
    }
  }
  
}
</script>

<style>
  .entry-header {
    font-size: 20pt;
  }
</style>