<template>
  <PageContent 
    title="Terms Setting"
    @refresh="loadTerms()"
    :createButtonVisible="false">
    <template v-slot:filters>
      <v-select
        :options="$options.SchoolCategories.values"
        v-model="filters.term.schoolCategoryId"
        @input="onSchoolCategoryChange()"
        :reduce="(item) => item.id"
        label="name"
        placeholder="School Category"
        class="mt-2"
        :searchable="checkIfAllowedAll() || checkIfSuperUser()"
        :selectable="option =>  checkIfSuperUser() || isAccessibleSchoolCategory(option.id)"
        :clearable="checkIfAllowedAll()"
      />
      <v-select
        v-if="isCourseVisible"
        :options="$options.Semesters.values"
        v-model="filters.term.semesterId"
        :reduce="(item) => item.id"
        @input="loadTerms()"
        label="name"
        placeholder="Semester"
        class="mt-2"
        :clearable="false"
        :searchable="false"
      />
    </template>
    <template v-slot:content>
      <b-overlay :show="isLoading" rounded="sm">
        <div class="no-active-sy-message" v-if="!$store.state.schoolYear">
          <h5>No Active School Year is set.</h5>
        </div>
        <div v-else>
          <div class="title-container">
            <h4>TERMS SETTING - {{ $store.state.schoolYear.name }}</h4>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Alias ipsum ab qui vitae laborum dolorum, accusantium autem quisquam. Aliquid vitae explicabo rerum, esse molestiae rem cumque doloremque dolores! Perferendis, pariatur.</p>
          </div>
          <div class="tabs-container">
            <!-- <SchoolCategoryTabs
                :showAll="false"
                @loadSchoolCategoryId="filters.term.schoolCategoryId = $event, loadTerms()"
                @click="onSchoolCategoryChange"
              /> -->
              <!-- @loadSchoolCategoryId="filters.section.schoolCategoryId = $event, loadSections()"
                @click="filters.section.schoolCategoryId = $event, loadSections()" -->
          </div>
          <div class="table-container">
            <div class="button-container">
              <div class="details__semester-button-container">
                <!-- <div class="semester__container">
                  <label
                    v-if="filters.term.schoolCategoryId === $options.SchoolCategories.SENIOR_HIGH_SCHOOL.id ||
                    filters.term.schoolCategoryId === $options.SchoolCategories.COLLEGE.id">Semester</label>
                  <b-form-select
                    class="semester-select"
                    v-model="filters.term.semesterId"
                    v-if="filters.term.schoolCategoryId === $options.SchoolCategories.SENIOR_HIGH_SCHOOL.id ||
                    filters.term.schoolCategoryId === $options.SchoolCategories.COLLEGE.id"
                    @input="loadTerms()">
                    <template v-slot:first>
                      <b-form-select-option :value="null" disabled>-- Semester --</b-form-select-option>
                    </template>
                    <b-form-select-option
                      v-for="semester in options.semesters"
                      :key="semester.id"
                      :value="semester.id">
                      {{ semester.name }}
                    </b-form-select-option>
                  </b-form-select>
                </div> -->
                <button class="btn btn-outline-primary add-row-button float-right" @click="onAddTerm">
                  <v-icon name="plus-circle" /> ADD TERM
                </button>
              </div>
            </div>
            <b-table
              small hover outlined show-empty
              :fields="tables.terms.fields"
              :busy="tables.terms.isBusy"
              :items="tables.terms.items"
              :current-page="paginations.term.page"
              :per-page="paginations.term.perPage">
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <v-icon
                    name="spinner"
                    spin
                    class="mr-2" />
                  <strong>Loading...</strong>
                </div>
              </template>
              <template v-slot:cell(name)="data">
                <b-form-input v-model="data.item.name"></b-form-input>
              </template>
              <template v-slot:cell(action)="data">
                <b-button variant="outline-danger" @click="onDeletingTerm(data)"><v-icon name="trash" /></b-button>
              </template>
            </b-table>
          </div>
          <div class="footer-container">
            <b-button variant="outline-primary" class="float-right" @click="onSaveChanges"><v-icon
              v-if="isProcessing"
              name="sync"
              spin
              class="mr-2" />SAVE CHANGES</b-button>
          </div>
        </div>
      </b-overlay>
      <b-modal
        v-model="showModalConfirmation"
        :noCloseOnEsc="true"
        :noCloseOnBackdrop="true" >
        <div slot="modal-title">
            Delete Term
        </div>
        Are you sure you want to delete this Term ?
        <div slot="modal-footer">
          <b-button
            :disabled="isProcessing"
            variant="outline-primary"
            class="mr-2 btn-save"
            @click="onDeleteTerm()">
            <v-icon
              v-if="isDeleting"
              name="sync"
              spin
              class="mr-2"/>
            Yes
          </b-button>
          <b-button
            variant="outline-danger"
            class="btn-close"
            @click="showModalConfirmation=false">
            No
          </b-button>
        </div>
      </b-modal>
    </template>
  </PageContent>
  <!-- <div class="terms_main-container">
    
  </div> -->
</template>

<script>
import PageContent from '../../components/PageContainer/PageContent'
import { Semesters, SchoolCategories } from "../../../helpers/enum";
import { TermApi, SchoolYearApi } from '../../../mixins/api';
import { showNotification } from '../../../helpers/forms';
import Access from '../../../mixins/utils/Access';

export default {
  components: {
    PageContent
  },
  mixins: [ TermApi, SchoolYearApi, Access ],
  SchoolCategories,
  Semesters,
  data() {
    return {
      isLoading: false,
      isProcessing: false,
      showModalConfirmation: false,
      isDeleting: false,
      selectedRow: null,
      activeSchoolYear: null,
      tables: {
        terms: {
          isBusy: false,
					fields: [
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: { width: "auto" }
						},
            {
              key: "action",
							label: "",
							tdClass: "align-middle",
							thStyle: { width: "40px"}
            }
          ],
          items: []
        }
      },
      paginations: {
				term: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        term: {
          criteria: null,
          schoolCategoryId: null,
          semesterId: null
        }
      },
    }
  },
  created() {
    // this.getActiveSchoolYear()
    this.filters.term.schoolCategoryId = this.getDefaultSchoolCategory()?.id
    this.loadTerms()
  },
  methods: {
    onAddTerm() {
      const { terms } = this.tables
      terms.items.push({ id: null, name: '' })
    },
    loadTerms() {
      const schoolYearId = this.$store.state.schoolYear.id
      const { schoolCategoryId, semesterId } = this.filters.term
      const { terms } = this.tables
      terms.isBusy = true
      const params = { paginate: false, schoolYearId, schoolCategoryId, semesterId  }
      this.getTermList(params).then(({ data }) => {
        terms.items = data
        terms.isBusy = false
      }).catch(error => {
        terms.isBusy = false
      })
    },
    onSchoolCategoryChange() {
      const { term } = this.filters
      term.semesterId = null
      if (this.isCourseVisible) {
        term.semesterId = Semesters.FIRST_SEM.id
      }

      // term.schoolCategoryId = schoolCategoryId
      this.loadTerms()
    },
    onSaveChanges() {
      const { terms } = this.tables
      const { schoolCategoryId, semesterId } = this.filters.term
      const schoolYearId = this.$store.state.schoolYear.id

      this.isProcessing = true
      if(this.validateRows()) {
        const payLoad = {
          schoolYearId,
          schoolCategoryId,
          semesterId,
          terms: terms.items
        }

        this.addOrUpdateMultipleTerm(payLoad).then(({ data }) => {
          terms.items = data
          showNotification(this, 'success', 'Changes has been saved.')
          this.isProcessing = false
        }).catch(error => {
          this.isProcessing = false
        })

      }
      else {
        showNotification(this, 'danger', 'Please fill up all rows before saving.')
        this.isProcessing = false
      }
    },
    validateRows() {
      //check if rows doesn't have empty or null name property
      const { terms } = this.tables
      const invalidRow = terms.items.find(term => term.name === "")
      if(invalidRow) {
        return false
      }
      else {
        return true;
      }
    },
    onDeletingTerm(row) {
      const { terms } = this.tables
      this.selectedRow= row
      if(row.item.id) {
        this.showModalConfirmation = true
      }
      else{
        terms.items.splice(row.index, 1)
      }
    },
    onDeleteTerm() {
      this.isDeleting = true
      const { terms } = this.tables
      this.deleteTerm(this.selectedRow.item.id).then(({ data }) => {
        terms.items.splice(this.selectedRow.index, 1)
        this.isDeleting = false
        this.showModalConfirmation = false
        showNotification(this, 'primary', 'Term has been deleted.')
      }).catch(error => {
        this.isDeleting = false
        this.showModalConfirmation = false
      })
    },
    // getActiveSchoolYear() {
    //   this.isLoading = true
    //   const params = { paginate: false, isActive: 1 }
    //   this.getSchoolYearList(params).then(({ data }) => {
    //     if (data.length > 0) {
    //       this.activeSchoolYear = data[0]
    //     }
    //     this.isLoading = false
    //   })
    // }
  },
  computed: {
    isCourseVisible() {
      const { schoolCategoryId } = this.filters.term;
      const { SchoolCategories } = this.$options;
      return [
        SchoolCategories.SENIOR_HIGH_SCHOOL.id,
        SchoolCategories.COLLEGE.id,
        SchoolCategories.GRADUATE_SCHOOL.id
      ].includes(schoolCategoryId);
    },
  }
}
</script>

<style lang="scss" scoped>

@import '../../../assets/scss/_shared.scss';

  .terms_main-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .title-container {
      p {
        margin-bottom: 40px;
      }
    }

    .tabs-container {
      margin: 10px 0;
      display: flex;
      flex-direction: column;
    }
  }

  .details__semester-button-container {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    @include for-size(phone-only) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .add-row-button {
    width: 120px;

    @include for-size(phone-only) {
      width: 100%;
    }
  }

  .semester__container {
    display: flex;
    align-items: center;
    flex: 1;
    margin-right: 10px;

    label {
      margin-right: 10px;
    }

   .semester-select {
      width: 200px;
   }

    @include for-size(phone-only) {
      flex-direction: column;
      align-items: flex-start;
      margin-right: 0;
      margin-bottom: 10px;
      width: 100%;

      .semester-select {
        width: 100%;
      }

    }
  }

  .no-active-sy-message {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

</style>