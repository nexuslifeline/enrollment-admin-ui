<template>
  <b-modal
    v-model="show"
    @hidden="$emit('update:show', false)"
    size="xl">
    <template v-slot:modal-header>
      Subject List
    </template>
    <b-row class="mb-3">
      <b-col md=3 offset-md="9">
        <b-form-input
          class="float-right"
          placeholder="Search Here..."
          debounce="500"
          @update="loadSubjects()"
          v-model="filters.subject.criteria">
        </b-form-input>
      </b-col>
    </b-row>
    <b-row class="mb-2">
      <b-col>
        <SelectLevel
          placeholder="Level"
          label="name"
          :value="filters.subject.level"
          @input="onLevelChanged" />
      </b-col>
      <b-col>
        <SelectCourseLevel
          placeholder="Course"
          label="name"
          :value="filters.subject.course"
          :levelId="filters.subject.level && filters.subject.level.id || null"
          @input="onCourseChanged" />
      </b-col>
      <b-col>
        <SelectSemester
          placeholder="Semester"
          label="name"
          :value="filters.subject.semester"
          :levelId="filters.subject.level && filters.subject.level.id || null"
          @input="onSemesterChanged" />
      </b-col>
      <b-col>
        <SelectSection
          placeholder="Section"
          label="name"
          :value="filters.subject.section"
          @input="onSectionChanged" />
      </b-col>
    </b-row>
    <b-row>
      <b-col md=12>
        <b-table
          small
          hover
          outlined
          show-empty
          :items.sync="tables.subjects.items"
          :fields="tables.subjects.fields"
          :busy="tables.subjects.isBusy"
        >
          <template v-slot:cell(name)="row">
            <SubjectColumn :data="row.item"/>
          </template>
          <template v-slot:cell(action)="row">
            <b-button @click="$emit('onAddSubject', { subject: row.item, section: filters.subject.section })" size="sm" variant="success">
              <v-icon name="plus" />
            </b-button>
          </template>
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon name="spinner" spin class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
        </b-table>
          <b-row>
            <b-col md="6">
              Showing {{ paginations.subject.from }} to
              {{ paginations.subject.to }} of
              {{ paginations.subject.totalRows }} records.
            </b-col>
            <b-col md="6">
              <b-pagination
                v-model="paginations.subject.page"
                :total-rows="paginations.subject.totalRows"
                :per-page="paginations.subject.perPage"
                size="sm"
                align="end"
                @input="loadSubjects()"
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
import SubjectColumn from './SubjectColumn'
import SelectLevel from '../Dropdowns/SelectLevel'
import SelectCourseLevel from '../Dropdowns/SelectCourseLevel'
import SelectSemester from '../Dropdowns/SelectSemester'
import SelectSection from '../Dropdowns/SelectSection'
import SelectCurriculum from '../Dropdowns/SelectCurriculum'

export default {
  props: {
    show: {
      type: [Boolean],
      default: false
    },
    level: {
      type: [Object],
      default: null
    },
    course: {
      type: [Object],
      default: null
    },
    semester: {
      type: [Object],
      default: null
    },
    section: {
      type: [Object],
      default: null
    }
  },
  components: { SubjectColumn, SelectLevel, SelectCourseLevel, SelectSemester, SelectCurriculum, SelectSection },
  mixins: [ SubjectApi ],
  data() {
    return {
      tables: {
        subjects: {
          isBusy: false,
          items: [],
          fields: [
            {
              key: 'name',
              label: 'Subject Code',
              tdClass: 'align-middle',
              thStyle: { width: '65%' },
            },
            {
              key: 'units',
              label: 'Lec Units',
              tdClass: 'align-middle text-center',
              thClass: 'align middle text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'labs',
              label: 'Lab Units',
              tdClass: 'align-middle text-center',
              thClass: 'align middle text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'totalUnits',
              label: 'Total Units',
              tdClass: 'align-middle text-center',
              thClass: 'align middle text-center',
              thStyle: { width: '15%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thClass: 'align middle text-center',
              thStyle: { width: '30px' },
            }
          ]
        }
      },
      paginations:{
        subject: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 8,
        },
      },
      filters: {
        subject: {
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
    // const { subject } = this.filters
    // subject.levelId = this.levelId
    // subject.courseId = this.courseId
    // subject.semesterId = this.semesterId
    // subject.sectionId = this.sectionId
    this.loadSubjects()
  },
  methods: {
    loadSubjects() {
      const { subjects } = this.tables;
      const { criteria, level, course, semester, section } = this.filters.subject;
      const { subject, subject: { perPage, page }} = this.paginations;

      subjects.isBusy = true;
      let params = {
        paginate: true,
        perPage,
        page,
        criteria,
        levelId: level?.id,
        courseId: course?.id,
        semesterId: semester?.id,
        sectionId: section?.id
      };

      this.getSubjectList(params).then(({ data }) => {
        subjects.items = data.data;
        subject.from = data.meta.from;
        subject.to = data.meta.to;
        subject.totalRows = data.meta.total;
        subjects.isBusy = false;
      });
    },
    onLevelChanged(level){
      const { subject } = this.filters
      subject.level = level?.id
      subject.course = null
      subject.section = null
      this.loadSubjects()
    },
    onCourseChanged(course){
      const { subject } = this.filters
      subject.course = course
      subject.courseId = course?.id
      this.loadSubjects()
    },
    onSemesterChanged(semester){
      const { subject } = this.filters
      subject.semester = semester
      subject.semesterId = semester?.id
      this.loadSubjects()
    },
    onSectionChanged(section){
      const { subject } = this.filters
      subject.section = section
      subject.sectionId = section?.id
      this.loadSubjects()
    }
  }
}
</script>

<style>

</style>