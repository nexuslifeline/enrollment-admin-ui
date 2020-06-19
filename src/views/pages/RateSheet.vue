<template>
	<div>
    <b-overlay :show="isLoaded" rounded="sm">
      <b-row>
        <b-col md=12>
          <b-card>
            <b-card-body>
              <b-row>
                <b-col md=12>
                  <b-tabs pills>			
                    <b-tab v-for="schoolCategory in options.schoolCategories.values" 
                      :key="schoolCategory.id" 
                      :active="schoolCategoryId == schoolCategory.id"
                      @click="loadLevelsOfSchoolCategoryList(schoolCategory.id)"
                      :title="schoolCategory.name"/>
                  </b-tabs>
                </b-col>
              </b-row>
              <hr>
              <h4>Rate Sheet</h4>
              <p>Details about the Fees of Student within current Academic Year.</p>
              <b-row v-show="options.courses.items.length	> 0">
                <b-col offset-md="2" md=10>
                  <b-alert show>
                    <b-row>
                      <b-col md=3>
                        <b-form-select 
                          v-model="forms.rateSheet.fields.courseId" 
                          @change="loadFeesOfLevel()">
                          <template v-slot:first>
                            <b-form-select-option :value="null" disabled>-- Course --</b-form-select-option>
                          </template>
                          <b-form-select-option 
                            v-for="course in options.courses.items" 
                            :key="course.id" 
                            :value="course.id">
                            {{course.name}}
                          </b-form-select-option>
                        </b-form-select>
                      </b-col>
                      <b-col md=3>
												<b-form-select 
                          v-model="forms.rateSheet.fields.semesterId" 
                          @change="loadFeesOfLevel()">
													<template v-slot:first>
														<b-form-select-option :value="null" disabled>-- Semester --</b-form-select-option>
													</template>
													<b-form-select-option 
                            v-for="semester in options.semesters.values" 
                            :key="semester.id" 
                            :value="semester.id">
														{{ semester.name }}
													</b-form-select-option>
												</b-form-select>
											</b-col>
                    </b-row>
                  </b-alert>
                </b-col>
              </b-row>
              <b-row class="mb-3">
                <b-col md=2>
                </b-col>
                <b-col md=4>
                  <h5>Student Fees - {{ levelName }}</h5>
                </b-col>
                <b-col md=6>
                  <b-button 
                    class="float-right" 
                    variant="outline-primary"
                    @click="showModalFees=true"
                  ><v-icon name="plus-circle" /> ADD NEW ITEM</b-button>
                </b-col>
              </b-row>
              <b-row>
                <b-col md=2>
                  <b-tabs pills vertical v-model="levelIndex">
                    <b-tab v-for="level in options.levels.items" :key="level.id" 
                      @click="loadCoursesOfLevelList(level.id)"
                      :title="level.name"/>
                  </b-tabs>
                </b-col>
                <b-col md=10>
                  <b-table
                    responsive small hover outlined show-empty
                    :items.sync="forms.rateSheet.fields.fees"
                    :fields="tables.rateSheetFees.fields"
                    :busy="tables.rateSheetFees.isBusy">
                    <template v-slot:cell(pivot.amount)="row">
                      <!-- <b-form-input v-model="row.item.pivot.amount" style="text-align: right"/> -->
                      <vue-autonumeric
                        v-model="row.item.pivot.amount"
                        class="form-control text-right" 
                        :options="[{minimumValue: 0, modifyValueOnWheel: false, emptyInputBehavior: 0}]">
                      </vue-autonumeric>
                    </template>
                    <template v-slot:cell(pivot.notes)="row">
                      <b-form-input v-model="row.item.pivot.notes"/>
                    </template>
                    <template v-slot:cell(action)="row">
											<b-button @click="removeFee(row)" size="sm" variant="danger"><v-icon name="trash" /></b-button>
										</template>
                  </b-table>
                  <hr>
                  <b-row>
                    <b-col md=6>
                      <!-- <b-row>
                        <b-col md=7>
                          <h6 class="font-weight-bold pt-1">UPON ENROLLMENT FEE : </h6>
                        </b-col>
                        <b-col md=5>
                          <b-form-input v-model="forms.rateSheet.fields.enrollmentFee"></b-form-input>
                        </b-col>
                      </b-row> -->
                      <b-form-group
                        label="UPON ENROLLMENT FEE"
                        label-for="enrollmentFee"
                        label-cols="5">
                        <vue-autonumeric
                          id="enrollmentFee"
                          v-model="forms.rateSheet.fields.enrollmentFee"
                          class="form-control text-right"
                          style="width: 70%"
                          :options="[{ minimumValue: 0, modifyValueOnWheel: false, emptyInputBehavior: 0 }]">
                        </vue-autonumeric>
                        <!-- <b-form-input id="enrollmentFee" v-model="forms.rateSheet.fields.enrollmentFee"></b-form-input> -->
                      </b-form-group>
                    </b-col>
                    <b-col md=6 >
                      <b-row>
                        <b-col md=9>
                          <h6 class="font-weight-bold pt-1 float-right">TOTAL : </h6>
                        </b-col>
                        <b-col md=3>
                          <h6 class="font-weight-bold pt-1 float-right">{{ totalAmount }}</h6>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>						
            </b-card-body>
            <template v-slot:footer>
              <b-button 
                class="float-right" 
                variant="outline-primary"
                @click="createUpdateRateSheet()"
              >Update</b-button>
            </template>
          </b-card>
        </b-col>
      </b-row>
    </b-overlay>
    <!-- MODAL FEES -->
		<b-modal 
			v-model="showModalFees"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true"
			size="xl">
			<div slot="modal-title"> <!-- modal title -->
					School Fees
			</div> <!-- modal title -->
			<b-row> <!-- modal body -->
				<b-col md=12>
          <b-row class="mb-2">
            <b-col offset-md="8" md="4">
              <b-form-input
                v-model="filters.fee.criteria"
                type="text" 
                placeholder="Search">
              </b-form-input>
            </b-col>
          </b-row>
					<b-table
						small hover outlined show-empty
						:items.sync="tables.fees.items"
						:fields="tables.fees.fields"
            :filter="filters.fee.criteria"
						:busy="tables.fees.isBusy2"
            :current-page="paginations.fee.page"
            :per-page="paginations.fee.perPage"
            @filtered="onFiltered($event, paginations.fee)">
						<template v-slot:cell(action)="row">
							<b-button @click="addFee(row)" size="sm" variant="success"><v-icon name="plus" /></b-button>
						</template>
					</b-table>
          <b-row>
            <b-col md=6>
              Showing {{paginations.fee.from}} to {{paginations.fee.to}} of {{paginations.fee.totalRows}} records.
            </b-col>
            <b-col md=6>
              <b-pagination
                v-model="paginations.fee.page"
                :total-rows="paginations.fee.totalRows"
                :per-page="paginations.fee.perPage"
                size="sm"
                align="end"
                @input="recordDetails(paginations.fee)"
              />
            </b-col>
          </b-row>
				</b-col>
			</b-row> <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button class="float-left" @click="showModalFees=false">Close</b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
	</div> <!-- main container -->
</template>
<script>
import { RateSheetApi, SchoolCategoryApi, LevelApi, CourseApi, SchoolFeeApi, SemesterApi } from "../../mixins/api"
import { SchoolCategories, Semesters, UserGroups } from "../../helpers/enum"
import { showNotification } from '../../helpers/forms'
import Tables from '../../helpers/tables'
export default {
	name: "RateSheet",
	mixins: [ RateSheetApi, SchoolCategoryApi, LevelApi, CourseApi, SchoolFeeApi, SemesterApi, Tables ],
	data() {
		return {
      isLoaded: false,
      showModalFees: false,      
      forms: {
        rateSheet: {
          fields: {
            id: null,
            levelId: null,
            courseId: null,
            semesterId: null,
            enrollmentFee: 0,
            fees: []
          }
        }
      },
			tables: {
				rateSheetFees: {
          isBusy: false,
					fields: [
						{
							key: "name",
							label: "NAME",
							tdClass: "align-middle",
							thStyle: {width: "auto"}
						},
						{
							key: "pivot.notes",
							label: "NOTES",
							tdClass: "align-middle",
							thStyle: {width: "40%"}
						},
						{
							key: "pivot.amount",
							label: "AMOUNT",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "30%"}
            },
            {
							key: "action",
							label: "",
							tdClass: "align-middle text-right",
							thClass: "text-right",
							thStyle: {width: "5px"}
						}
          ],
        },
        fees: {
          isBusy: false,
          isBusy2: false,
          fields: [
            {
              key: "name",
              label: "NAME",
              tdClass: "align-middle",
              thStyle: {width: "30%"}
            },
            {
              key: "description",
              label: "Description",
              tdClass: "align-middle",
              thStyle: {width: "40%"}
            },
            {
              key: "action",
              label: "",
              tdClass: "align-middle text-right",
              thClass: "text-right",
              thStyle: {width: "30%"}
            }
          ],
          items: []
        }
      },
      paginations: {
				fee: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        fee: {
          criteria: null
        }
      },
			options: {
				schoolCategories: SchoolCategories,
				levels: {
					items: []
				},
				courses: {
					items: []
				},
				semesters: Semesters
      },
      levelIndex: 0,
      schoolCategoryI: null
		}
	},
	created(){
    //this.loadRateSheetList()
    this.checkRights()
    this.loadFees()
  },
  computed: {
    totalAmount(){
      let total = 0
      this.forms.rateSheet.fields.fees.forEach(fee =>{
        total += Number(fee.pivot.amount)
      })

      return total.toFixed(2)
    },
    levelName() {
      const { fields } = this.forms.rateSheet
      let level = this.options.levels.items.find(i => i.id == fields.levelId)
      if (level) {
        return level.name
      }
    }
  },
	methods: {
		loadLevelsOfSchoolCategoryList(id){
      this.isLoaded = true
      const params = { paginate: false }
      //const { rateSheet } = this.forms
      const { levels, courses } = this.options
      courses.items = []
			this.getLevelsOfSchoolCategoryList(id, params)
				.then(response => {
          const res = response.data
          this.levelIndex = 0
          levels.items = res
          if (res.length > 0) {
            this.loadCoursesOfLevelList(res[0].id)
          } else {
            this.forms.rateSheet.fields.fees = []
          }
          //rateSheet.fields.levelId = res[0].id
          this.isLoaded = false
				})
				.catch(error => {
					console.log(error)
				})
    },
    loadCoursesOfLevelList(levelId){
      this.isLoaded = true
      const { rateSheet } =  this.forms
      const params = { paginate: false, schoolCategoryId: this.forms.rateSheet.fields.schoolCategoryId }
      const { courses, semesters } = this.options
      rateSheet.fields.levelId = levelId
      rateSheet.fields.semesterId = null
      rateSheet.fields.courseId = null
      //const {  }
			this.getCoursesOfLevelList(levelId, params)
				.then(response => {
					const res = response.data
          courses.items = res
          
					if(res.length > 0){
            rateSheet.fields.semesterId = semesters.getEnum(1).id
            rateSheet.fields.courseId = courses.items[0].id
					}
					
          this.loadFeesOfLevel()
					this.isLoaded = false
				})
    },
    loadFeesOfLevel(){
      const { rateSheetFees } = this.tables
      const { rateSheet } = this.forms
      const params = { levelId: rateSheet.fields.levelId, courseId: rateSheet.fields.courseId, semesterId: rateSheet.fields.semesterId  }

      rateSheetFees.isBusy = true
      rateSheet.fields.id = null //clear id of rate sheet field
      rateSheet.fields.fees = []
      
      this.getRateSheetList(params).then(response => {
        const res = response.data
        if(res.data.length > 0)
        {
          rateSheet.fields.id = res.data[0].id
          rateSheet.fields.levelId = res.data[0].levelId
          rateSheet.fields.courseId = res.data[0].courseId
          rateSheet.fields.semesterId = res.data[0].semesterId
          rateSheet.fields.enrollmentFee = res.data[0].enrollmentFee
          rateSheet.fields.fees = res.data[0].fees
        }
        rateSheetFees.isBusy = false
      })
    },
    loadFees(){
      const { fees } = this.tables
      const { fee } = this.paginations
      fees.isBusy2 = true
      const params = { paginate: false }
      this.getSchoolFeeList(params).then(({ data }) => {
        fees.items = data
        fee.totalRows = data.length
        this.recordDetails(fee)
        fees.isBusy2 = false
      })
    },
    loadSemesterList(){
			var params = { paginate: false }
			this.getSemesterList(params)
				.then(response => {
					const res = response.data
					this.options.semesters.items = res
				})
		},
    addFee(row){
      //console.log(row)
      this.forms.rateSheet.fields.fees.push({ 
        id: row.item.id,
        name : row.item.name,
        isIntegrated: row.item.isIntegrated,
        description: row.item.description,
        pivot:{ schoolFeeId: row.item.id, amount: 0.00, notes: "" }
      })
    },
		removeFee(row){
			this.forms.rateSheet.fields.fees.splice(row.index, 1);
		},
    createUpdateRateSheet(){

      const { id, levelId, courseId, semesterId, enrollmentFee } = this.forms.rateSheet.fields
      const data = { levelId: levelId, courseId: courseId, semesterId: semesterId, enrollmentFee: enrollmentFee, fees:[] }
      
      this.forms.rateSheet.fields.fees.forEach(rs => {
        data.fees.push({ rateSheetId: rs.pivot.rateSheetId, schoolFeeId: rs.pivot.schoolFeeId, amount: rs.pivot.amount, notes: rs.pivot.notes })  
      })

      if(id === null){
        this.addRateSheet(data).then(response => {
          const res = response.data
          this.forms.rateSheet.fields.id = res.id
          showNotification(this, 'success', 'Rate Sheet is updated.')
          //console.log(res)
        })
        .catch(error => {
          showNotification(this, 'danger', 'Error in updating rate sheet')
        })
      }
      else{
        this.updateRateSheet(id, data).then(response => {
          const res = response.data
          showNotification(this, 'success', 'Rate Sheet is updated.')
        })
        .catch(error => {
          showNotification(this, 'danger', 'Error in updating rate sheet')
        })
      }
    },
    checkRights(){
			const userGroupId = localStorage.getItem('userGroupId')
			const userGroup = UserGroups.getEnum(Number(userGroupId))
			let result = false
			if (userGroup) {
				// this.filters.student.schoolCategoryId = userGroup.schoolCategoryId
				this.schoolCategoryId = userGroup.schoolCategoryId
      }
      
      if (UserGroups.SUPER_USER.id == userGroup.id) {
				this.schoolCategoryId = SchoolCategories.getEnum(1).id
			}
			this.loadLevelsOfSchoolCategoryList(this.schoolCategoryId)
		}
  },
}
</script>