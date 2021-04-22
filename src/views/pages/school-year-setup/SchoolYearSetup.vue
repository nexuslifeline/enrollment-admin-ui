<template>
  <div class="application__container">
    <div class="application__pane">
      <div class="application__left-pane">
        <div class="application__group-stage-container">
          <SlideStageIndicator
            :stages="$options.groupStages"
            :activeId="forms.schoolYear.fields.schoolYearStepId"
          />
        </div>
      </div>
      <div class="application__main-pane">
        <div class="application__wizard-form">
          <h4 class="application__form-title">{{heading && heading.subHeader}}</h4>
          <p class="application__form-description">{{heading && heading.description}}</p>
          <div class="application__wizard-form-fields centered" v-if="forms.schoolYear.fields.schoolYearStepId === 1">
            <b-row class="justify-content-md-center">
              <b-col md=6>
                <b-form-group>
                  <label class="required" > Name </label>
                  <b-form-input>

                  </b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row class="mt-2 justify-content-md-center">
               <b-col md=6>
                <b-form-group>
                  <label > Description </label>
                  <b-form-input>

                  </b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row class="mt-2 justify-content-md-center">
              <b-col md=6>
                <b-form-group>
                  <label class="required" > Start Date </label>
                  <b-form-datepicker>

                  </b-form-datepicker>
                </b-form-group>
              </b-col>
            </b-row>
          </div>
          <div class="application__wizard-form-fields" v-if="forms.schoolYear.fields.schoolYearStepId === 2">
            <b-row>
              <b-col md=12>
                <div class="section-table-header float-left">List of Sections for this School Year.</div>
                <b-button class="float-right" variant="outline-primary">Add Section</b-button>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col md="12">
                <b-table
                  class="c-table"
                  small
                  hover
                  outlined
                  show-empty
                  :fields="tables.sections.fields"
                  :busy="tables.sections.isBusy"
                  :items="tables.sections.items"
                >
                  <!-- :current-page="paginations.section.page"
                  :per-page="paginations.section.perPage"
                  :filter="filters.section.criteria"
                  @filtered="onFiltered($event, paginations.section)" -->
                  <template v-slot:table-busy>
                    <div class="text-center my-2">
                      <v-icon name="spinner" spin class="mr-2" />
                      <strong>Loading...</strong>
                    </div>
                  </template>
                  <template v-slot:cell(action)="row">
                    <b-dropdown
                      right
                      variant="link"
                      toggle-class="text-decoration-none"
                      no-caret
                    >
                      <template v-slot:button-content>
                        <v-icon name="ellipsis-v" />
                      </template>
                      <b-dropdown-item @click="loadSchedules(row)">
                        {{ !row.detailsShowing ? 'View' : 'Hide' }} Schedule
                      </b-dropdown-item>
                      <b-dropdown-item
                        v-if="
                          isAccessible(
                            $options.SectionAndSchedulePermissions.EDIT.id
                          )
                        "
                        @click="setUpdate(row, 0)"
                        :disabled="showEntry"
                      >
                        Edit
                      </b-dropdown-item>
                      <b-dropdown-item
                        v-if="
                          isAccessible(
                            $options.SectionAndSchedulePermissions.EDIT.id
                          )
                        "
                        @click="setUpdate(row, 1)"
                        :disabled="showEntry"
                      >
                        Setup Schedule
                      </b-dropdown-item>
                      <b-dropdown-item
                        v-if="
                          isAccessible(
                            $options.SectionAndSchedulePermissions.DELETE.id
                          )
                        "
                        @click="
                          (forms.section.fields.id = row.item.id),
                            (showModalConfirmation = true)
                        "
                        :disabled="showModalConfirmation"
                      >
                        Delete
                      </b-dropdown-item>
                    </b-dropdown>
                  </template>
                  <template v-slot:row-details="{ item }">
                    <b-overlay :show="item.isLoading" rounded="sm">
                      <b-card>
                        <h5 class="text-center">
                          {{ item.name }}<br />
                          <span
                            >{{ item.level.name }} -
                            {{ item.schoolYear.name }}</span
                          ><br />
                          <span v-if="item.course"
                            >{{ item.course.name }} - {{ item.semester.name }}</span
                          >
                        </h5>
                        <br />
                        <ScheduleViewer
                          v-if="item.schedules"
                          :selectedItems="item.schedules"
                          :showExtendedTime="false"
                        />
                      </b-card>
                    </b-overlay>
                  </template>
                  <template v-slot:cell(name)="row">
                    <div>
                      <span
                        class="link"
                        @click="setUpdate(row, 0)"
                        :disabled="
                          showEntry ||
                            isAccessible(
                              $options.SectionAndSchedulePermissions.EDIT.id
                            )
                        "
                        >{{ row.item.name }}</span
                      >
                    </div>
                  </template>
                </b-table>
                <b-row>
                  <b-col md="6">
                    Showing {{ paginations.section.from }} to
                    {{ paginations.section.to }} of
                    {{ paginations.section.totalRows }} records.
                  </b-col>
                  <b-col md="6">
                    <b-pagination
                      class="c-pagination"
                      v-model="paginations.section.page"
                      :total-rows="paginations.section.totalRows"
                      :per-page="paginations.section.perPage"
                      size="sm"
                      align="end"
                      @input="loadSections()"
                    />
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </div>
          <div class="application__wizard-form-fields" v-if="forms.schoolYear.fields.schoolYearStepId === 3">
            <b-row>
              <b-col md=12>
                <b-card>
                  <div class="group">
                    <div class="group__header">School Categories</div>
                    <div
                      class="permission"
                      v-for="schoolCategory in $options.SchoolCategories.values"
                      :key="schoolCategory.id">
                      <div class="permission-left">
                        <div class="permission__name">{{ schoolCategory.name }}</div>
                        <div class="permission__description">{{ schoolCategory.description }}</div>
                      </div>
                      <div class="permission-right">
                        <!-- <Toggle
                          :value="checkIfAllowed(permission.id)"
                          @input="toggledPermission($event, permission.id)" /> -->
                        <Toggle />
                      </div>
                    </div>
                  </div>
                </b-card>
              </b-col>
            </b-row>
          </div>
          <div class="application__action-bar">
            <b-button
              @click="forms.schoolYear.fields.schoolYearStepId--"
              variant="outline-secondary"
              :disabled="forms.schoolYear.fields.schoolYearStepId === 1"
              class="application__back-action">
              Back
            </b-button>
            <b-button
              variant="primary"
              class="application__main-action"
              :disabled="isProcessing"
              @click="onNext()"
              >
              <v-icon
                v-if="isProcessing"
                name="sync"
                class="mr-2"
                spin />
                Next
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SlideStageIndicator from "../../components/SlideStageIndicator";
import { groupStages } from './data/schoolYearStages'
import { SchoolCategories } from '../../../helpers/enum'
import Toggle from '../../components/Form/Toggle'
const schoolYearFields =  {
  id: null,
  name: null,
  schoolYearStepId: 1
}
export default {
  SchoolCategories,
  groupStages,
  components: {
    SlideStageIndicator,
    Toggle
  },
  data() {
    return {
      isProcessing: false,
      forms: {
        schoolYear: {
          fields: { ...schoolYearFields }
        }
      },
      tables: {
        sections: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: '20%' },
            },
            {
              key: 'schoolCategory.name',
              label: 'Category',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'level.name',
              label: 'Level',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'course.description',
              label: 'Course',
              tdClass: 'align-middle',
            },
            {
              key: 'semester.name',
              label: 'Semester',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thStyle: { width: '40px' },
            },
          ],
          items: [],
          filteredItems: [],
        },
      },
      paginations: {
        section: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        section: {
          criteria: null,
          schoolYearId: null,
          semesterId: null,
          semesterItem: null,
          schoolCategoryId: null,
          schoolCategoryItem: null,
          levelId: null,
          levelItem: null,
          courseId: null,
          courseItem: null,
        },
      }
    }
  },
  methods: {
    onNext() {
      console.log('next')
      const { fields } = this.forms.schoolYear
      fields.schoolYearStepId  += 1
    }
  },
  computed: {
    heading() {
      const { fields } = this.forms.schoolYear
      if (fields.schoolYearStepId) {
        const subHeaders = [
          ...this.$options.groupStages[0].children,
          ...this.$options.groupStages[1].children,
          ...this.$options.groupStages[2].children,
        ]
        return subHeaders.find(({ id }) => id === fields.schoolYearStepId)
      }
      return null;
    },
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .application__container {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
  }

  .application__pane {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    //max-width: 1200px;
  }

  .application__left-pane {
    height: 100%;
    flex: 0 1 35%;

    @include for-size(tablet-landscape-down) {
      display: none;
    }
  }

  .application__group-stage-container {
    height: 100%;
    position: fixed;
    top: 0;
    z-index: 1031;
    width: 35%;

    @include for-size(tablet-landscape-down) {
      display: none;
    }
  }

  .application__main-pane {
    flex: 1;
    display: flex;
    flex-direction: row;
    //align-items: center;
    justify-content: center;
  }

  .application__action-bar {
    position: sticky;
    height: 60px;
    background-color: $white;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-top: 1px solid $brand-border-color;
    z-index: 2;
  }

  .application__back-action {
    min-width: 140px;

    @include for-size(phone-only) {
      min-width: 80px;
    }
  }

  .application__main-action {
    margin-left: auto;
    min-width: 160px;

    @include for-size(phone-only) {
      min-width: 80px;
    }
  }

  .application__wizard-form {
    padding: 30px 15px 50px 15px;
    width: 100%;
    max-width: 950px;
    margin: 25px 10px 20px 10px;
    background-color: $white;
    margin-bottom: 100px;

    @include for-size(tablet-portrait-down) {
      margin: 0 0 50px 0;
      border: none;
    }

    @include for-size(desktop-up) {
      padding: 20px 60px 60px 60px;
    }
  }

  .application__form-title {
    font-size: 18px;
  }

  .application__form-description {
    font-size: 14px;
    margin-bottom: 20px;
    color: $gray;
  }

  .application__wizard-form-fields {
    margin-bottom: 20px;
    height: 100%;
  }

  .section-table-header {
    font-size: 14pt;
    display: flex;
    align-items: center;
    height: 100%;
  }


  .group__header {
    font-size: 18pt;
    font-weight: bold;
    padding: 10px 0;
  }
  .permission {
    height: 100%;
    display: flex;
    border-bottom: 1px solid lightgray;
    @include for-size(phone-only) {
      flex-direction: column;
      padding: 20px 20px 0 20px;
    }
  }
  .permission-left {
    min-width: 200px;
    display: flex;
    flex-direction: column;
    padding: 10px;
  }

  .permission-right {
    flex: 1;
    padding: 15px;
    text-align: right;

    @include for-size(phone-only) {
      margin-top: 20px;
    }
  }

  .permission__name {
    font-size: 15pt;
    font-weight: 500;
  }

  .permission__description {
    font-size: 10pt;
    padding-left: 5px;
  }

  .group > div:last-child {
    border: none;
  }


</style>