<template>
  <div>
      <b-row>
      <b-col md=12>
        <b-card>
          <b-card-body>
            <!-- add button and search -->
            <b-row class="mb-3">
              <b-col md=12>
                <b-row>
                  <b-col md=4 offset-md="8"> 
                    <b-form-input
                      v-model="filters.schoolCategory.criteria"
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
									small hover outlined show-empty
									:fields="tables.schoolCategories.fields"
                  :busy="tables.schoolCategories.isBusy"
                  :items.sync="tables.schoolCategories.items"
                  :current-page="paginations.schoolCategory.page"
                  :per-page="paginations.schoolCategory.perPage"
                  :filter="filters.schoolCategory.criteria">
                  <!-- :filter="filters.schoolCategory.criteria> -->
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
                    Showing {{ paginations.schoolCategory.from }} to {{ paginations.schoolCategory.to }} of {{ paginations.schoolCategory.totalRows }} records.
                    </b-col>
                  <b-col md=6>
                    <b-pagination
                      v-model="paginations.schoolCategory.page"
                      :total-rows="paginations.schoolCategory.totalRows"
                      :per-page="paginations.schoolCategory.perPage"
                      size="sm"
                      align="end"
                      @input="recordDetails(paginations.schoolCategory)" />
                    </b-col>
                  </b-row>
              </b-col>
            </b-row>
            <!-- end table -->
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { SchoolCategoryApi } from "../../mixins/api"
import Tables from '../../helpers/tables'

export default {
  name: "schoolCategory",
  mixins: [ Tables, SchoolCategoryApi ],
  data() {
    return {
      tables: {
				schoolCategories: {
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
				schoolCategory: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        schoolCategory: {
          criteria: null
        }
      }
    }
  },
  created() {
    const { schoolCategories } = this.tables
    const { schoolCategory } = this.paginations

    schoolCategories.isBusy = true
    const params = { paginate: false }
    this.getSchoolCategoryList(params).then(({ data }) => {
      schoolCategories.items = data
      schoolCategory.totalRows = data.length
      this.recordDetails(schoolCategory)
      schoolCategories.isBusy = false
    }).catch(error => {
      schoolCategories.isBusy = false
    })

  }
}
</script>