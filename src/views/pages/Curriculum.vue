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
						<h4>Curriculum</h4>
						<p>Lorem ipsum dolor sit amet.</p>
						<b-row class="mb-3">
							<b-col md=6>
								
							</b-col>
							<b-col md=6>
								<b-button class="float-right" variant="outline-primary"><b-icon-plus-circle></b-icon-plus-circle> ADD NEW SUBJECT</b-button>
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
									:fields="tables.subjects.fields">
								</b-table>
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
	name: 'Curriculum',
	mixins: [ SchoolCategoryApi ],
	data() {
		return {
			tables: {
				subjects: {
					fields: [
						{
							key: 'code',
							label: 'CODE',
							tdClass: 'align-middle',
							thStyle: {width: '15%'}
						},
						{
							key: 'name',
							label: 'SUBJECT',
							tdClass: 'align-middle',
							thStyle: {width: '25%'}
						},
						{
							key: 'description',
							label: 'DESCRIPTION',
							tdClass: 'align-middle',
							thStyle: {width: '40%'}
						},
						{
							key: 'units',
							label: 'UNITS',
							tdClass: 'align-middle text-right',
							thClass: 'text-right',
							thStyle: {width: '20%'}
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