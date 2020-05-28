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
                  <b-col md=8>
                    <b-button  variant="outline-primary"><b-icon-plus-circle></b-icon-plus-circle> ADD NEW SUBJECT</b-button>
                  </b-col>
                  <b-col md=4>
                    <b-form-input
                      type='text' 
                      placeholder='Search'>
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
									responsive small hover outlined show-empty
									:fields="tables.subjects.fields"
                  :busy='tables.subjects.isBusy'
                  :items="tables.subjects.items">
                  <template v-slot:cell(subject)='data'>
                    <small>{{ data.item.code }}</small><br>
                    <span>{{ data.item.name }}</span>
                  </template>
                  <template v-slot:cell(action)='row'>
                    <b-dropdown right variant='link' toggle-class='text-decoration-none' no-caret>
                      <template v-slot:button-content>
                        <b-icon-grip-horizontal></b-icon-grip-horizontal>
                      </template>
                      <b-dropdown-item >Edit</b-dropdown-item>
                      <b-dropdown-item >Delete</b-dropdown-item>
                    </b-dropdown>
                  </template>
								</b-table>
                <b-row>
                  <b-col md=6>
                    Showing {{ paginations.subject.from }} to {{ paginations.subject.to }} of {{ paginations.subject.totalRows }} records.
                    </b-col>
                  <b-col md=6>
                      <b-pagination
                        v-model='paginations.subject.activePage'
                        :total-rows='paginations.subject.totalRows'
                        :per-page='paginations.subject.perPage'
                        size='sm'
                        align='end'
                        @input='loadSubjects()'
                      />
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
import { SubjectApi } from '../../mixins/api'
export default {
	name: 'Subject',
	mixins: [ SubjectApi ],
	data() {
		return {
			tables: {
				subjects: {
          isBusy: false,
					fields: [
						{
							key: 'subject',
							label: 'SUBJECT',
							tdClass: 'align-middle',
							thStyle: {width: '20%'}
						},
						{
							key: 'description',
							label: 'DESCRIPTION',
							tdClass: 'align-middle',
							thStyle: {width: 'auto'}
						},
						{
							key: 'units',
							label: 'UNITS',
							tdClass: 'align-middle text-right',
							thClass: 'text-right',
							thStyle: {width: '15%'}
						},
						{
							key: 'labs',
							label: 'LABS',
							tdClass: 'align-middle text-right',
							thClass: 'text-right',
							thStyle: {width: '15%'}
            },
            {
              key: 'action',
							label: '',
							tdClass: 'align-middle',
							thStyle: { width: '40px'}
            }
          ],
          items:[]
				}
      },
      paginations: {
				subject: {
					from: 0,
					to: 0,
					totalRows: 0,
					activePage: 1,
					perPage: 10,
				}
			},
		}
	},
	created(){
		this.loadSubjects()
	},
	methods: {
		loadSubjects(){
      this.tables.subjects.isBusy = true
			var params = { paginate: true, perPage: this.paginations.subject.perPage, page: this.paginations.subject.activePage }
      this.getSubjectList(params).then(response =>{
        const res = response.data
        this.tables.subjects.items = res.data
        this.paginations.subject.from = res.meta.from
        this.paginations.subject.to = res.meta.to
        this.paginations.subject.totalRows = res.meta.total
        this.paginations.subject.pages = res.meta.lastPage
        this.tables.subjects.isBusy = false
      })
    }
	}
}
</script>