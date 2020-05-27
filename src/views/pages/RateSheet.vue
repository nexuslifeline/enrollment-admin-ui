<template>
	<div>
    <b-row>
      <b-col md=12>
				<b-card>
					<b-card-body>
						<b-row>
							<b-col md=12>
								<b-tabs pills> 						
									<b-tab v-for='schoolCategory in options.schoolCategories.items' :key='schoolCategory.id' 
										@click='loadLevelsOfSchoolCategoryList(schoolCategory.id)' 
										:title='schoolCategory.name'/>
								</b-tabs>
							</b-col>
						</b-row>
						<hr>
						<h4>Rate Sheet</h4>
						<p>Lorem ipsum dolor sit amet.</p>
						<b-row class="mb-3">
							<b-col md=2>
							</b-col>
							<b-col md=4>
								<h5>Student Fees - </h5>
							</b-col>
							<b-col md=6>
								<b-button class="float-right" variant="outline-primary"><b-icon-plus-circle></b-icon-plus-circle> ADD NEW ITEM</b-button>
							</b-col>
						</b-row>
						<b-row>
							<b-col md=2>
								<b-tabs pills vertical>
									<b-tab v-for='level in options.levels.items' :key='level.id' 
										:title='level.name'/>
								</b-tabs>
							</b-col>
							<b-col md=10>
								<b-table
									responsive small hover outlined show-empty
									:fields="tables.fees.fields">
								</b-table>
								<hr>
								<b-row>
									<b-col md=6>
										<b-row>
											<b-col md=5>
												<h5 class="font-weight-bold pt-1">UPON ENROLLMENT FEE : </h5>
											</b-col>
											<b-col md=5>
												<b-form-input></b-form-input>
											</b-col>
										</b-row>
									</b-col>
									<b-col md=6>
										<b-row>
											<b-col md=9>
												<h5 class="font-weight-bold pt-1 float-right">TOTAL : </h5>
											</b-col>
											<b-col md=3>
												<h5 class="font-weight-bold pt-1 float-right">18,000.00</h5>
											</b-col>
										</b-row>
									</b-col>
								</b-row>
							</b-col>
						</b-row>						
					</b-card-body>
					<template v-slot:footer>
						<b-button class="float-right" variant="outline-primary">Update</b-button>
					</template>
				</b-card>
      </b-col>
    </b-row>
	</div> <!-- main container -->
</template>
<script>
import { SchoolCategoryApi } from '../../mixins/api'
export default {
	name: 'RateSheet',
	mixins: [ SchoolCategoryApi ],
	data() {
		return {
			tables: {
				fees: {
					fields: [
						{
							key: 'name',
							label: 'NAME',
							tdClass: 'align-middle',
							thStyle: {width: '30%'}
						},
						{
							key: 'notes',
							label: 'NOTES',
							tdClass: 'align-middle',
							thStyle: {width: '40%'}
						},
						{
							key: 'amount',
							label: 'AMOUNT',
							tdClass: 'align-middle text-right',
							thClass: 'text-right',
							thStyle: {width: '30%'}
						}
					]
				}
			},
			options: {
				schoolCategories: {
					items: []
				},
				levels: {
					items: []
				},
			}
		}
	},
	created(){
		this.loadSchoolCategoryList()
	},
	methods: {
		loadSchoolCategoryList(){
			var params = { paginate: false }
			this.getSchoolCategoryList(params)
				.then(response => {
					const res = response.data
					this.options.schoolCategories.items = res
					this.loadLevelsOfSchoolCategoryList(res[0].id)
				})
				.catch(error => {
					console.log(error)
				})
		},
		loadLevelsOfSchoolCategoryList(id){
			var params = { paginate: false }
			this.getLevelsOfSchoolCategoryList(id, params)
				.then(response => {
					const res = response.data
					this.options.levels.items = res
					//load fees for the first level
				})
				.catch(error => {
					console.log(error)
				})
		},
	}
}
</script>