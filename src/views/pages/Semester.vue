<template>
  <div class="c-app">
    <div>
      <div class="page-content__title-container">
        <h4 class="page-content__title">Semester Management</h4>
      </div>
      <div>
      <!-- add button and search -->
      <b-row class="mb-3">
        <b-col md=12>
          <b-row>
            <b-col md=4 offset-md="8"> 
              <b-form-input
                v-model="filters.semester.criteria"
                type="text" 
                placeholder="Search" >
              </b-form-input>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <!-- end add button and search -->
      <!-- table -->
      <b-row >
        <b-col md=12>
          <b-table
            hover outlined show-empty
            :fields="tables.semesters.fields"
            :busy="tables.semesters.isBusy"
            :items.sync="tables.semesters.items"
            :current-page="paginations.semester.page"
            :per-page="paginations.semester.perPage"
            :filter="filters.semester.criteria">
            <!-- :filter="filters.semester.criteria> -->
            <template v-slot:table-busy>
              <div class="text-center my-2">
                <v-icon 
                  name="spinner" 
                  spin
                  class="mr-2" />
                <strong>Loading...</strong>
              </div>
            </template>
          </b-table>
          <b-row>
            <b-col md=6>
              Showing {{ paginations.semester.from }} to {{ paginations.semester.to }} of {{ paginations.semester.totalRows }} records.
              </b-col>
            <b-col md=6>
              <b-pagination
                v-model="paginations.semester.page"
                :total-rows="paginations.semester.totalRows"
                :per-page="paginations.semester.perPage"
                size="sm"
                align="end"
                @input="recordDetails(paginations.semester)" />
              </b-col>
            </b-row>
        </b-col>
      </b-row>
      <!-- end table -->
      </div>
    </div>
  </div>
</template>

<script>
import { SemesterApi } from "../../mixins/api"
import Tables from '../../helpers/tables'

export default {
  name: "semester",
  mixins: [ Tables, SemesterApi ],
  data() {
    return {
      tables: {
				semesters: {
          isBusy: false,
					fields: [
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: {width: "30%"}
						},
						{
							key: "description",
							label: "DESCRIPTION",
							tdClass: "align-middle",
							thStyle: {width: "auto"}
						},
          ],
          items:[]
				}
      },
      paginations: {
				semester: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        semester: {
          criteria: null
        }
      }
    }
  },
  created() {
    const { semesters } = this.tables
    const { semester } = this.paginations

    semesters.isBusy = true
    const params = { paginate: false }
    this.getSemesterList(params).then(({ data }) => {
      semesters.items = data
      semester.totalRows = data.length
      this.recordDetails(semester)
      semesters.isBusy = false
    }).catch(error => {
      semesters.isBusy = false
    })

  }
}
</script>
