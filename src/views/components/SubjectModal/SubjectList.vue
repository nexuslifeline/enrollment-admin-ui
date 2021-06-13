<template>
  <b-modal
    v-model="show"
    @hidden="$emit('update:show', false)"
    size="xl">
    <template v-slot:modal-header>
      Subject List
    </template>
    <b-row class="mb-4">
      <b-col>
        <SelectLevel
          placeholder="Level"
          label="name" />
      </b-col>
      <b-col>
        <SelectCourse
          placeholder="Course"
          label="name" />
      </b-col>
      <b-col>
        <SelectSemester
          placeholder="Semester"
          label="name" />
      </b-col>
      <b-col>
        <SelectSection
          placeholder="Section"
          label="name" />
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
            <b-button @click="$emit('onAddSubject', row.item)" size="sm" variant="success">
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
import SelectCourse from '../Dropdowns/SelectCourse'
import SelectSemester from '../Dropdowns/SelectSemester'
import SelectSection from '../Dropdowns/SelectSection'
import SelectCurriculum from '../Dropdowns/SelectCurriculum'

export default {
  props: {
    show: {
      type: [Boolean],
      default: false
    }
  },
  components: { SubjectColumn, SelectLevel, SelectCourse, SelectSemester, SelectCurriculum, SelectSection },
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
        },
      }
    }
  },
  created() {
    this.loadSubjects()
  },
  methods: {
    loadSubjects() {
      const { subjects } = this.tables;
      const { criteria } = this.filters.subject;
      const { subject, subject: { perPage, page }} = this.paginations;

      subjects.isBusy = true;
      let params = {
        paginate: true,
        perPage,
        page,
        criteria
      };

      this.getSubjectList(params).then(({ data }) => {
        subjects.items = data.data;
        subject.from = data.meta.from;
        subject.to = data.meta.to;
        subject.totalRows = data.meta.total;
        subjects.isBusy = false;
      });
    }
  }
}
</script>

<style>

</style>