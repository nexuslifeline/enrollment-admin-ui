<template>
  <PageContent
    title="School Category"
    description="View the list of School Categories compromising the institution."
    :searchKeyword="filters.schoolCategory.criteria"
    :pageFrom="paginations.schoolCategory.from"
    :pageTo="paginations.schoolCategory.to"
    :pageTotal="paginations.schoolCategory.totalRows"
    :perPage="paginations.schoolCategory.perPage"
    :currentPage.sync="paginations.schoolCategory.page"
    @onPageChange="loadSchoolCategories"
    @onRefresh="loadSchoolCategories"
    :createButtonVisible="false">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.schoolCategory.criteria"
        debounce="500"
        type="text"
        placeholder="Search"
      />
    </template>
    <template v-slot:content>
      <div>
        <!-- table -->
        <b-table
          class="c-table"
          hover outlined show-empty
          :fields="tables.schoolCategories.fields"
          :busy="tables.schoolCategories.isBusy"
          :items.sync="tables.schoolCategories.items"
          :current-page="paginations.schoolCategory.page"
          :per-page="paginations.schoolCategory.perPage"
          :filter="filters.schoolCategory.criteria"
          responsive>
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
        <!-- end table -->
      </div>
    </template>
  </PageContent>
</template>

<script>
import { SchoolCategoryApi } from "../../mixins/api"
import Tables from '../../helpers/tables'
import Card from '../components/Card'
import PageContent from "../components/PageContainer/PageContent";

export default {
  name: "schoolCategory",
  mixins: [
    Tables,
    SchoolCategoryApi
  ],
  components: {
    Card,
    PageContent
  },
  data() {
    return {
      isFilterVisible: true,
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
    this.loadSchoolCategories()
  },
  methods:{
    loadSchoolCategories() {
      const { schoolCategories } = this.tables
      const { schoolCategory } = this.paginations

      schoolCategories.isBusy = true
      const params = { paginate: false }
      this.getSchoolCategoryList(params).then(({ data }) => {
        schoolCategories.items = data
        schoolCategory.totalRows = data.length
        this.paginate(schoolCategory)
        schoolCategories.isBusy = false
      }).catch(error => {
        schoolCategories.isBusy = false
      })
    }
  }
}
</script>
