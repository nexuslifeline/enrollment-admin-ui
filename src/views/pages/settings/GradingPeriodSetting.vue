<template>
  <PageContent 
    title="Grading Period Setting"
    @refresh="loadGradingPeriods()"
    :createButtonVisible="false">
    <template v-slot:filters>
      <v-select
        :options="$options.SchoolCategories.values"
        v-model="filters.gradingPeriod.schoolCategoryId"
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
        v-model="filters.gradingPeriod.semesterId"
        :reduce="(item) => item.id"
        @input="loadGradingPeriods()"
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
            <h4>GRADING PERIOD SETTING - {{ $store.state.schoolYear.name }}</h4>
            <p>In this Settings, you can define the segments or period of time for the entire course, program or class. Typically for college these are Prelim, Midterm and Finals.</p>
          </div>
          <div class="tabs-container">
            <!-- <SchoolCategoryTabs
                :showAll="false"
                @loadSchoolCategoryId="filters.gradingPeriod.schoolCategoryId = $event, loadGradingPeriods()"
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
                    v-if="filters.gradingPeriod.schoolCategoryId === $options.SchoolCategories.SENIOR_HIGH_SCHOOL.id ||
                    filters.gradingPeriod.schoolCategoryId === $options.SchoolCategories.COLLEGE.id">Semester</label>
                  <b-form-select
                    class="semester-select"
                    v-model="filters.gradingPeriod.semesterId"
                    v-if="filters.gradingPeriod.schoolCategoryId === $options.SchoolCategories.SENIOR_HIGH_SCHOOL.id ||
                    filters.gradingPeriod.schoolCategoryId === $options.SchoolCategories.COLLEGE.id"
                    @input="loadGradingPeriods()">
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
                <button class="btn btn-outline-primary add-row-button float-right" @click="onAddGradingPeriod">
                  <v-icon name="plus-circle" /> ADD PERIOD
                </button>
              </div>
            </div>
            <b-table
              small hover outlined show-empty
              :fields="tables.gradingPeriods.fields"
              :busy="tables.gradingPeriods.isBusy"
              :items="tables.gradingPeriods.items"
              :current-page="paginations.gradingPeriod.page"
              :per-page="paginations.gradingPeriod.perPage">
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <v-icon
                    name="spinner"
                    spin
                    class="mr-2" />
                  <strong>Loading...</strong>
                </div>
              </template>
              <template v-slot:cell(name)="{ item }">
                <b-form-input v-model="item.name"></b-form-input>
              </template>
              <template v-slot:cell(description)="{ item }">
                <b-form-input v-model="item.description"></b-form-input>
              </template>
              <template v-slot:cell(action)="data">
                <b-button variant="outline-danger" @click="onDeletingGradingPeriod(data)"><v-icon name="trash" /></b-button>
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
            Delete Grading Period
        </div>
        Are you sure you want to delete this Grading Period ?
        <div slot="modal-footer">
          <b-button
            :disabled="isProcessing"
            variant="outline-primary"
            class="mr-2 btn-save"
            @click="onDeleteGradingPeriod()">
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
</template>

<script>
import PageContent from '../../components/PageContainer/PageContent'
import { Semesters, SchoolCategories } from "../../../helpers/enum";
import { GradingPeriodApi, SchoolYearApi } from '../../../mixins/api';
import { showNotification } from '../../../helpers/forms';
import Access from '../../../mixins/utils/Access';

export default {
  components: {
    PageContent
  },
  mixins: [ GradingPeriodApi, SchoolYearApi, Access ],
  SchoolCategories,
  Semesters,
  name: 'Grading Period',
  data() {
    return {
      isLoading: false,
      isProcessing: false,
      showModalConfirmation: false,
      isDeleting: false,
      selectedRow: null,
      activeSchoolYear: null,
      tables: {
        gradingPeriods: {
          isBusy: false,
					fields: [
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: { width: "auto" }
						},
            {
							key: "description",
							label: "Description",
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
				gradingPeriod: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        gradingPeriod: {
          criteria: null,
          schoolCategoryId: null,
          semesterId: null
        }
      },
    }
  },
  created() {
    // this.getActiveSchoolYear()
    this.filters.gradingPeriod.schoolCategoryId = this.getDefaultSchoolCategory()?.id
    this.loadGradingPeriods()
  },
  methods: {
    onAddGradingPeriod() {
      const { gradingPeriods } = this.tables
      gradingPeriods.items.push({ id: null, name: '', description: '' })
    },
    loadGradingPeriods() {
      const schoolYearId = this.$store.state.schoolYear.id
      const { schoolCategoryId, semesterId } = this.filters.gradingPeriod
      const { gradingPeriods } = this.tables
      gradingPeriods.isBusy = true
      const params = { paginate: false, schoolYearId, schoolCategoryId, semesterId  }
      this.getGradingPeriodList(params).then(({ data }) => {
        gradingPeriods.items = data
        gradingPeriods.isBusy = false
      }).catch(error => {
        gradingPeriods.isBusy = false
      })
    },
    onSchoolCategoryChange() {
      const { gradingPeriod } = this.filters
      gradingPeriod.semesterId = null
      if (this.isCourseVisible) {
        gradingPeriod.semesterId = Semesters.FIRST_SEM.id
      }

      // gradingPeriod.schoolCategoryId = schoolCategoryId
      this.loadGradingPeriods()
    },
    onSaveChanges() {
      const { gradingPeriods } = this.tables
      const { schoolCategoryId, semesterId } = this.filters.gradingPeriod
      const schoolYearId = this.$store.state.schoolYear.id

      this.isProcessing = true
      if(this.validateRows()) {
        const payLoad = {
          schoolYearId,
          schoolCategoryId,
          semesterId,
          gradingPeriods: gradingPeriods.items
        }

        this.addOrUpdateMultipleGradingPeriod(payLoad).then(({ data }) => {
          gradingPeriods.items = data
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
      const { gradingPeriods } = this.tables
      const invalidRow = gradingPeriods.items.find(gradingPeriod => gradingPeriod.name === "")
      if(invalidRow) {
        return false
      }
      else {
        return true;
      }
    },
    onDeletingGradingPeriod(row) {
      const { gradingPeriods } = this.tables
      this.selectedRow= row
      if(row.item.id) {
        this.showModalConfirmation = true
      }
      else{
        gradingPeriods.items.splice(row.index, 1)
      }
    },
    onDeleteGradingPeriod() {
      this.isDeleting = true
      const { gradingPeriods } = this.tables
      this.deleteGradingPeriod(this.selectedRow.item.id).then(({ data }) => {
        gradingPeriods.items.splice(this.selectedRow.index, 1)
        this.isDeleting = false
        this.showModalConfirmation = false
        showNotification(this, 'primary', 'Grading Period has been deleted.')
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
      const { schoolCategoryId } = this.filters.gradingPeriod;
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
    width: 150px;

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