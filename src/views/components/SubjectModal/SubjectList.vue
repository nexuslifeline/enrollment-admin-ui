<template>
  <b-modal
    v-model="show"
    @hidden="$emit('update:show', false)"
    no-close-on-backdrop
    no-close-on-esc
    size="xl">
    <template v-slot:modal-header>
      <h5>Subject List</h5>
    </template>
    <div class="search-bar">
        <div class="search-details">

        </div>
       <div class="search-container">
        <b-form-input
          placeholder="Search Here"
          debounce="500"
          v-model="filters.subject.criteria">
        </b-form-input>
       </div>
    </div>
    <b-row class="pb-2 pl-3 pr-3">
      <InputGroup>
        <InputContainer>
          <SelectLevel
            placeholder="Level"
            label="name"
            v-model="filters.subject.level"
          />
        </InputContainer>
        <template v-if="levelId">
          <InputContainer v-if="$options.SchoolCategories.getEnum(schoolCategoryId).hasCourse">
            <SelectCourseLevel
              placeholder="Course"
              label="name"
              v-model="filters.subject.course"
              :levelId="levelId"
            />
          </InputContainer>
          <InputContainer v-if="$options.SchoolCategories.getEnum(schoolCategoryId).hasSemester">
            <SelectSemester
              placeholder="Semester"
              label="name"
              v-model="filters.subject.semester"
              :levelId="levelId"
            />
          </InputContainer>
        </template>
        <InputContainer>
          <SelectSection
            placeholder="Section"
            label="name"
            v-model="filters.subject.section"
            :levelId="levelId"
            :schoolCategoryId="schoolCategoryId"
            :courseId="courseId"
            :schoolYearId="schoolYearId"
          />
        </InputContainer>
      </InputGroup>
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
          class="c-table"
        >
          <template v-slot:cell(name)="row">
            <SubjectColumn :data="row.item"/>
          </template>
          <template v-slot:cell(action)="row">
            <b-button
              @click="$emit('onAddSubject', { subject: row.item, section: filters.subject.section })"
              :disabled="addedItems && addedItems.length > 0 && addedItems.includes(row.item.id)"
              size="sm"
              variant="primary">
              <span v-if="addedItems && addedItems.length > 0 && addedItems.includes(row.item.id)">Added</span>
              <v-icon v-else name="plus" />
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
                class="c-pagination"
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
import { SchoolCategories } from '../../../helpers/enum';

export default {
  SchoolCategories,
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
    },
    addedItems: {
      type: [Array]
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
              label: 'Subject',
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
              thStyle: { width: '40px' },
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
          perPage: 6,
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
    this.loadSubjects()
  },
  watch: {
    'filters.subject.level': function() {
      const { subject } = this.filters;
      subject.course = null
      subject.section = null
    },
    'filters.subject': {
      handler() {
        this.loadSubjects();
      },
      deep: true
    }
  },
  computed: {
    courseId() {
      return this.filters?.subject?.course?.id;
    },
    levelId() {
      return this.filters?.subject?.level?.id;
    },
    schoolCategoryId() {
      return this.filters?.subject?.level?.schoolCategoryId;
    },
    sectionId() {
      return this.filters?.subject?.section?.id;
    },
    semesterId() {
      return this.filters?.subject?.semester?.id;
    },
    schoolYearId() {
      return this.$store.state?.schoolYear?.id;
    }
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
    // onLevelChanged(level){
    //   const { subject } = this.filters
    //   // subject.level = level?.id
    //   subject.course = null
    //   subject.section = null
    //   this.loadSubjects()
    // },
    // onCourseChanged(course){
    //   const { subject } = this.filters
    //   subject.course = course
    //   subject.courseId = course?.id
    //   this.loadSubjects()
    // },
    // onSemesterChanged(semester){
    //   const { subject } = this.filters
    //   subject.semester = semester
    //   subject.semesterId = semester?.id
    //   this.loadSubjects()
    // },
    // onSectionChanged(section){
    //   const { subject } = this.filters

    //   subject.section = section
    //   subject.sectionId = section?.id
    //   this.loadSubjects()
    // }
  }
}
</script>

<style lang="scss" scoped>
  .search-bar {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-bottom: 15px;
  }

  .search-container {
    flex: 1;
  }

  .search-details {
    flex: 1;
  }
</style>