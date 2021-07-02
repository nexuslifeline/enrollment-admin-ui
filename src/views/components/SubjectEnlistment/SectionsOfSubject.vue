<template>
  <b-modal
    v-model="show"
    @hidden="$emit('update:show', false)"
    size="xl">
    <template v-slot:modal-header>
      <b> Sections For Subject: {{ subject && subject.description || '' }} </b>
    </template>
    <b-row>
      <b-col md=12>
        <b-table
          small
          hover
          outlined
          show-empty
          :items.sync="tables.sections.items"
          :fields="tables.sections.fields"
          :busy="tables.sections.isBusy"
        >
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon
                name="spinner"
                spin
                class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(schedule)="row">
            <span>
              {{ row.item.schedules[0].personnel.firstName + ' ' + row.item.schedules[0].personnel.lastName }}
            </span>
            <br>
            <span v-for="schedule in row.item.schedules" :key="schedule.id" class="item">
              <small>{{ Days.getEnum(schedule.dayId).abbrev + ' - Time: ' + schedule.startTime + ' - ' + schedule.endTime  }}</small>
            </span>
          </template>
          <template v-slot:cell(action) = "row">
            <b-button
              @click="onSectionSelected(row.item)"
              variant="success">
              <v-icon name="check" />
            </b-button>
          </template>
        </b-table>
        <b-row>
            <b-col md=6>
              Showing {{paginations.section.from}} to {{paginations.section.to}} of {{paginations.section.totalRows}} records.
            </b-col>
            <b-col md=6>
              <b-pagination
                v-model="paginations.section.page"
                :total-rows="paginations.section.totalRows"
                :per-page="paginations.section.perPage"
                size="sm"
                align="end"
                @input="recordDetails(paginations.section)"
              />
            </b-col>
        </b-row>
      </b-col>
    </b-row>
    <template v-slot:modal-footer>
      <b-button @click="$emit('update:show', false)"> Close</b-button>
    </template>
  </b-modal>
</template>

<script>
import { SubjectApi } from '../../../mixins/api';
import Tables from '../../../helpers/tables';
import SelectLevel from '../Dropdowns/SelectLevel'
import SelectCourseLevel from '../Dropdowns/SelectCourseLevel'
import SelectSemester from '../Dropdowns/SelectSemester'
import SelectSection from '../Dropdowns/SelectSection'
import SelectCurriculum from '../Dropdowns/SelectCurriculum'
import { Days } from '../../../helpers/enum'

export default {
  props: {
    show: {
      type: [Boolean],
      default: false
    },
    subject: {
      type: [Object]
    },
    schoolYearId:  {
      type: [Number, String]
    }
  },
  mixins: [ SubjectApi, Tables ],
  data() {
    return {
      Days,
      tables: {
       sections: {
        isBusy: false,
          fields: [
            {
              key: "name",
              label: "SECTION",
              tdClass: "align-middle ",
              thClass: "align-middle",
              thStyle: { width: "15%" }
            },
            {
              key: "level.name",
              label: "LEVEL",
              tdClass: "align-middle ",
              thClass: "align-middle",
              thStyle: { width: "15%" }
            },
            {
              key: "course.name",
              label: "COURSE",
              tdClass: "align-middle ",
              thClass: "align-middle",
              thStyle: { width: "15%" }
            },
            {
              key: "semester.name",
              label: "SEMESTER",
              tdClass: "align-middle ",
              thClass: "align-middle",
              thStyle: {width: "15%"}
            },
            {
              key: "schedule",
              label: "SCHEDULE",
              tdClass: "align-middle",
              thClass: "align-middle",
              thStyle: {width: "AUTO"}
            },
            {
              key: "action",
              label: "",
              tdClass: "align-middle text-center",
              thStyle: {width: "5%"}
            }
          ],
          items: []
        },
      },
      paginations:{
        section: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 8,
        },
      },
      filters: {
        section: {
          criteria: null,
          level: this.level,
          course: this.course,
          semester: this.semester,
          section: this.section
        },
      }
    }
  },
  created() {
    this.loadSections()
  },
  methods: {
    loadSections() {
      this.showModalSection = true
      const { sections } = this.tables
      const { section } = this.paginations
      const schoolYearId = 1

      const params = { paginate: false, perPage: section.perPage, subjectId: this.subject?.id, schoolYearId }
      sections.isBusy = true

      this.getSectionsOfSubject(params, this.subject?.id).then(({ data }) => {
        sections.items = data
        section.totalRows = data.length
        this.recordDetails(section)
        sectionsOfSubjects.isBusy = false
      }).catch((error) => {
        sections.isBusy = false
      })
    },
    onSectionSelected(section) {
      this.$emit('onSectionSelected', section)
      this.$emit('update:show', false)
    }
  }
}
</script>

<style>

</style>