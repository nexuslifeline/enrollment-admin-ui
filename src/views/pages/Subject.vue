<template>
  <PageContent 
    title="Subject Management"
    description="Manage the subject's code, title, description, units, category and other details."
    :searchKeyword="filters.subject.criteria"
    :pageFrom="paginations.subject.from"
    :pageTo="paginations.subject.to"
    :pageTotal="paginations.subject.totalRows"
    :perPage="paginations.subject.perPage"
    :currentPage.sync="paginations.subject.page"
    @onPageChange="loadSubjects"
    @onRefresh="loadSubjects"
    @create="onCreate()"
    :createButtonVisible="isAccessible($options.SubjectPermissions.ADD.id) && checkIfHasSchoolCategoryAccess()">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.subject.criteria"
        debounce="500"
        type="text"
        placeholder="Search"
        @update="loadSubjects()"
      />

       <SelectCategory
        :value="filters.subject.schoolCategoryItem"
        @input="onStatusFilterChange"
        label="name"
        placeholder="School Category"
        class="mt-2"
      />
    </template>
    <template v-slot:content>
      <div v-if="checkIfHasSchoolCategoryAccess()">
        <b-table
          class="c-table"
          small
          hover
          outlined
          show-empty
          responsive
          :fields="tables.subjects.fields"
          :busy="tables.subjects.isBusy"
          :items="tables.subjects.items"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @sort-changed="onSortChanged"
        >
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon name="spinner" spin class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(name)="{ item, value }">
            <b-link
              @click="setSubjectUpdate(item)"
              :disabled="!isAccessible($options.SubjectPermissions.EDIT.id)"
              >{{ value }}
            </b-link>
          </template>
          <template v-slot:cell(schoolCategory)="{ item: { schoolCategory }}">
            {{ schoolCategory && schoolCategory.name || ''}}
          </template>
          <template v-slot:cell(action)="row">
            <b-dropdown
              v-if="
                isAccessible([
                  $options.SubjectPermissions.EDIT.id,
                  $options.SubjectPermissions.EDIT_PRICE.id,
                  $options.SubjectPermissions.DELETE.id,
                ])
              "
              right
              variant="link"
              toggle-class="text-decoration-none"
              no-caret
              boundary="window"
            >
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="
                  isAccessible([
                    $options.SubjectPermissions.EDIT.id,
                    $options.SubjectPermissions.EDIT_PRICE.id,
                  ])
                "
                @click="setSubjectUpdate(row.item)"
                :disabled="showModalEntry"
              >
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.SubjectPermissions.DELETE.id)"
                @click="
                  (forms.subject.fields.id = row.item.id),
                    (showModalConfirmation = true)
                "
                :disabled="showModalConfirmation"
              >
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </b-table>
        <!-- <div class="d-flex">
          <div>
            Showing {{ paginations.subject.from }} to
            {{ paginations.subject.to }} of
            {{ paginations.subject.totalRows }} records.
          </div>
          <div class="ml-auto">
            <b-pagination
              class="c-pagination"
              v-model="paginations.subject.page"
              :total-rows="paginations.subject.totalRows"
              :per-page="paginations.subject.perPage"
              size="sm"
              align="end"
              @input="loadSubjects()"
            />
          </div>
        </div> -->
      </div>
      <NoAccess v-if="!checkIfHasSchoolCategoryAccess()"/>
      <!-- Modal Entry -->
      <b-modal
        v-model="showModalEntry"
        :noCloseOnEsc="true"
        :noCloseOnBackdrop="true"
      >
        <div slot="modal-title">
          <!-- modal title -->
          Subjects - {{ entryMode }}
        </div>
        <!-- modal title -->
        <!-- modal body -->
        <b-overlay :show="forms.subject.isLoading" rounded="sm">
          <b-row>
            <b-col md="12">
              <b-row>
                <b-col md="12">
                  <b-form-group>
                    <label class="required">Subject Code</label>
                    <b-form-input
                      :disabled="
                        !isAccessible([
                          $options.SubjectPermissions.ADD.id,
                          $options.SubjectPermissions.EDIT.id,
                        ])
                      "
                      ref="name"
                      v-model="forms.subject.fields.name"
                      :state="forms.subject.states.name"
                    />
                    <b-form-invalid-feedback>
                      {{ forms.subject.errors.name }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <b-form-group>
                    <label class="required">Description</label>
                    <b-form-textarea
                      :disabled="
                        !isAccessible([
                          $options.SubjectPermissions.ADD.id,
                          $options.SubjectPermissions.EDIT.id,
                        ])
                      "
                      ref="description"
                      v-model="forms.subject.fields.description"
                      :state="forms.subject.states.description"
                    />
                    <b-form-invalid-feedback>
                      {{ forms.subject.errors.description }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <b-form-group>
                    <label class="required">School Category</label>
                    <b-form-select
                      :disabled="
                        !isAccessible([
                          $options.SubjectPermissions.ADD.id,
                          $options.SubjectPermissions.EDIT.id,
                        ])
                      "
                      v-model="forms.subject.fields.schoolCategoryId"
                      :state="forms.subject.states.schoolCategoryId"
                      @change="loadSubjectPrerequisite()"
                    >
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled
                          >-- School Category --</b-form-select-option
                        >
                      </template>
                      <b-form-select-option
                        v-for="schoolCategory in options.schoolCategories.values"
                        :key="schoolCategory.id"
                        :value="schoolCategory.id"
                      >
                        {{ schoolCategory.name }}
                      </b-form-select-option>
                    </b-form-select>
                    <b-form-invalid-feedback>
                      {{ forms.subject.errors.schoolCategoryId }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="6">
                  <b-form-group label="Lecture Units">
                    <vue-autonumeric
                      @input="computeTotalAmount()"
                      ref="units"
                      :disabled="
                        !isAccessible([
                          $options.SubjectPermissions.ADD.id,
                          $options.SubjectPermissions.EDIT.id,
                        ])
                      "
                      v-model="forms.subject.fields.units"
                      :class="'form-control text-right'"
                      :options="[
                        {
                          decimalPlaces: 0,
                          minimumValue: 0,
                          modifyValueOnWheel: false,
                          emptyInputBehavior: 0,
                        },
                      ]"
                    >
                    </vue-autonumeric>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Amount per Lecture Units">
                    <vue-autonumeric
                      @input="computeTotalAmount()"
                      ref="amountPerUnit"
                      :disabled="
                        !isAccessible($options.SubjectPermissions.EDIT_PRICE.id)
                      "
                      v-model="forms.subject.fields.amountPerUnit"
                      :class="'form-control text-right'"
                      :options="[
                        {
                          minimumValue: 0,
                          modifyValueOnWheel: false,
                          emptyInputBehavior: 0,
                        },
                      ]"
                    >
                    </vue-autonumeric>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="6">
                  <b-form-group label="Lab Units">
                    <vue-autonumeric
                      @input="computeTotalAmount()"
                      ref="labs"
                      :disabled="
                        !isAccessible([
                          $options.SubjectPermissions.ADD.id,
                          $options.SubjectPermissions.EDIT.id,
                        ])
                      "
                      v-model="forms.subject.fields.labs"
                      :class="'form-control text-right'"
                      :options="[
                        {
                          decimalPlaces: 0,
                          minimumValue: 0,
                          modifyValueOnWheel: false,
                          emptyInputBehavior: 0,
                        },
                      ]"
                    >
                    </vue-autonumeric>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Amount per Lab Units">
                    <vue-autonumeric
                      @input="computeTotalAmount()"
                      ref="amountPerLab"
                      :disabled="
                        !isAccessible($options.SubjectPermissions.EDIT_PRICE.id)
                      "
                      v-model="forms.subject.fields.amountPerLab"
                      :class="'form-control text-right'"
                      :options="[
                        {
                          minimumValue: 0,
                          modifyValueOnWheel: false,
                          emptyInputBehavior: 0,
                        },
                      ]"
                    >
                    </vue-autonumeric>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="6">
                  <b-form-group label="Total Units">
                    <vue-autonumeric
                      :disabled="true"
                      ref="totalUnits"
                      v-model="forms.subject.fields.totalUnits"
                      :class="'form-control text-right'"
                      :options="[
                        {
                          decimalPlaces: 0,
                          minimumValue: 0,
                          modifyValueOnWheel: false,
                          emptyInputBehavior: 0,
                        },
                      ]"
                    >
                    </vue-autonumeric>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Total Amount">
                    <vue-autonumeric
                      :disabled="true"
                      ref="totalAmount"
                      v-model="forms.subject.fields.totalAmount"
                      :class="'form-control text-right'"
                      :options="[
                        {
                          minimumValue: 0,
                          modifyValueOnWheel: false,
                          emptyInputBehavior: 0,
                        },
                      ]"
                    >
                    </vue-autonumeric>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-overlay>
        <!-- modal body -->
        <div slot="modal-footer" class="w-100">
          <!-- modal footer buttons -->
          <b-button
            variant="dark"
            class="float-left "
            @click="showModalEntry = false"
          >
            Close
          </b-button>
          <b-button
            :disabled="forms.subject.isProcessing"
            variant="primary"
            class="float-right btn-save"
            @click="onSubjectEntry()"
          >
            <v-icon
              v-if="forms.subject.isProcessing"
              name="sync"
              spin
              class="mr-2"
            />
            Save
          </b-button>
        </div>
        <!-- modal footer buttons -->
      </b-modal>
      <!-- End Modal Entry -->
      <!-- Modal Confirmation -->
      <b-modal
        v-model="showModalConfirmation"
        :noCloseOnEsc="true"
        :noCloseOnBackdrop="true"
      >
        <div slot="modal-title">
          Delete Subject
        </div>
        Are you sure you want to delete this subject?
        <div slot="modal-footer">
          <b-button
            variant="primary"
            class="mr-2 btn-save"
            @click="onSubjectDelete()"
          >
            <v-icon
              v-if="forms.subject.isProcessing"
              name="sync"
              spin
              class="mr-2"
            />
            Yes
          </b-button>
          <b-button
            class=""
            variant="dark"
            @click="showModalConfirmation = false"
          >
            No
          </b-button>
        </div>
      </b-modal>
      <!-- End Modal Confirmation -->
    </template>
  </PageContent>
</template>
<script>
const subjectFields = {
  id: null,
  code: null,
  name: null,
  description: null,
  schoolCategoryId: null,
  departmentId: null,
  units: null,
  amountPerUnit: null,
  labs: null,
  amountPerLab: null,
  totalUnits: null,
  totalAmount: null,
};

import { SubjectApi, DepartmentApi } from '../../mixins/api';
import {
  validate,
  reset,
  clearFields,
  showNotification,
  formatNumber,
} from '../../helpers/forms';
import { copyValue } from '../../helpers/extractor';
import {
  UserGroups,
  SchoolCategories,
  SubjectPermissions,
} from '../../helpers/enum';
// import Select2 from '../components/Select2'
import Tables from '../../helpers/tables';
import Access from '../../mixins/utils/Access';
import Card from '../components/Card';
import PageContent from '../components/PageContainer/PageContent.vue';
import NoAccess from "../components/NoAccess";

export default {
  name: 'Subject',
  components: {
    Card,
    PageContent,
    NoAccess
  },
  mixins: [SubjectApi, DepartmentApi, Tables, Access],
  // components: { Select2 },
  SubjectPermissions,
  data() {
    return {
      isFilterVisible: true,
      showModalEntry: false,
      showModalConfirmation: false,
      entryMode: '',
      sortBy: null,
      sortDesc: null,
      forms: {
        subject: {
          isProcessing: false,
          isLoading: false,
          fields: { ...subjectFields },
          states: { ...subjectFields },
          errors: { ...subjectFields },
        },
      },
      tables: {
        subjects: {
          isBusy: false,
          fields: [
            // {
            // 	key: "code",
            // 	label: "Code",
            // 	tdClass: "align-middle",
            // 	thStyle: {width: "6%"}
            // },
            {
              key: 'name',
              label: 'SUBJECT CODE',
              tdClass: 'align-middle',
              thStyle: { width: '10%' },
              sortable: true,
            },
            {
              key: 'description',
              label: 'DESCRIPTION',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
              sortable: true,
            },
            {
              key: 'schoolCategory',
              label: 'SCHOOL CATEGORY',
              tdClass: 'align-middle',
              thStyle: { width: '20%' },
              sortable: true,
            },
            {
              key: 'units',
              label: 'LEC UNITS',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '7%' },
            },
            {
              key: 'labs',
              label: 'LAB UNITS',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '7%' },
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
        subject: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        subject: {
          criteria: null,
          schoolCategoryId: null,
          schoolCategoryItem: null,
        },
      },
      options: {
        schoolCategories: SchoolCategories,
        departments: {
          items: [],
        },
        subjects: {
          items: [],
        },
      },
      isLoading: false,
    };
  },
  created() {
    const { subject } = this.filters
    if (!this.checkIfSuperUser()) {
      subject.schoolCategoryId =  this.getDefaultSchoolCategory()?.id
      subject.schoolCategoryItem =  this.getDefaultSchoolCategory()
    }
    this.loadSubjects();
    // this.loadDepartments()
  },
  methods: {
    loadSubjects() {
      const { subjects } = this.tables;
      const { criteria, schoolCategoryId } = this.filters.subject;
      const {
        subject,
        subject: { perPage, page },
      } = this.paginations;

      subjects.isBusy = true;

      const params = {
        paginate: true,
        perPage,
        page,
        criteria,
        schoolCategoryId,
        ordering: this.getOrdering(this.sortBy, this.sortDesc)
      };
      this.getSubjectList(params).then(({ data }) => {
        subjects.items = data.data;
        subject.from = data.meta.from;
        subject.to = data.meta.to;
        subject.totalRows = data.meta.total;
        subjects.isBusy = false;
      });
    },
    loadDepartments() {
      let params = { paginate: false };
      const { departments } = this.options;
      this.getDepartmentList(params).then(({ data }) => {
        departments.items = data;
      });
    },
    onSubjectEntry() {
      const {
        subject,
        subject: { fields },
      } = this.forms;
      const { subjects } = this.tables;

      subject.isProcessing = true;
      reset(subject);
      if (this.entryMode == 'Add') {
        this.addSubject(fields)
          .then(({ data }) => {
            this.addRow(subjects, this.paginations.subject, data);
            subject.isProcessing = false;
            showNotification(this, 'success', 'Subject created successfully.');
            this.showModalEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            subject.isProcessing = false;
            validate(subject, errors, this);
          });
      } else {
        const { fields } = this.forms.subject;
        this.updateSubject(fields, fields.id)
          .then(({ data }) => {
            subject.isProcessing = false;
            this.updateRow(subjects, data);
            showNotification(this, 'success', 'Subject updated successfully.');
            this.showModalEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            subject.isProcessing = false;
            validate(subject, errors, this);
          });
      }
    },
    onSubjectDelete() {
      const {
        subject,
        subject: {
          fields: { id },
        },
      } = this.forms;
      const { subjects } = this.tables;
      subject.isProcessing = true;
      this.deleteSubject(id).then(({ data }) => {
        subject.isProcessing = false;
        this.deleteRow(subjects, this.paginations.subject, id);
        showNotification(this, 'success', 'Subject deleted successfully.');
        this.showModalConfirmation = false;
      });
    },
    setSubjectUpdate(item) {
      const {
        subject,
        subject: { fields },
      } = this.forms;
      this.showModalEntry = true;
      subject.isLoading = true;
      copyValue(item, fields);
      reset(subject);
      this.entryMode = 'Edit';
      subject.isLoading = false;
    },
    computeTotalAmount() {
      const { fields } = this.forms.subject;
      fields.totalUnits = fields.units + fields.labs;
      fields.totalAmount =
        fields.units * fields.amountPerUnit + fields.labs * fields.amountPerLab;
    },
    onCreate() {
      const {
        subject,
        subject: { fields },
      } = this.forms;
      this.showModalEntry = true;
      subject.isLoading = true;
      reset(subject);
      clearFields(fields);
      fields.units = 0;
      fields.amountPerUnit = 0;
      fields.labs = 0;
      fields.amountPerLab = 0;
      fields.departmentId = null;
      fields.schoolCategoryId = null;
      // fields.prerequisites = []
      this.entryMode = 'Add';
      subject.isLoading = false;
    },
    checkRights(userType) {
      const userGroupId = localStorage.getItem('userGroupId');
      const userGroup = UserGroups.getEnum(Number(userGroupId));
      let result = true;
      if (userGroup) {
        if (userGroup.userType == userType) {
          result = false;
        }
      }

      if (UserGroups.SUPER_USER.id == userGroup.id) {
        result = false;
      }

      return result;
    },
    loadSubjectPrerequisite() {
      this.isLoading = true;
      const { schoolCategoryId } = this.forms.subject.fields;
      const { subjects } = this.options;
      let params = { paginate: false, schoolCategoryId };
      this.getSubjectList(params).then(({ data }) => {
        subjects.items = data;
        this.isLoading = false;
      });
    },
    filterBySchoolCategory() {
      const { subjects } = this.tables;
      const { subject } = this.paginations;
      const { schoolCategoryId } = this.filters.subject;
      if (schoolCategoryId) {
        subjects.filteredItems = subjects.items.filter(
          (s) => s.schoolCategoryId === schoolCategoryId
        );
      } else {
        subjects.filteredItems = subjects.items;
      }
      this.onFiltered(subjects.filteredItems, subject);
    },
    onStatusFilterChange(item) {
      const { subject } = this.filters;
      subject.schoolCategoryId = item?.id || 0;
      subject.schoolCategoryItem = item;
      this.loadSubjects();
    },
    onSortChanged({ sortBy, sortDesc }) {
      this.sortBy = sortBy;
      this.sortDesc = sortDesc;
      this.loadSubjects();
    },
    getOrdering(sortBy, sortDesc = false) {
      if (!sortBy) return;
      const orderBy = this.mapOrdering(sortBy);
      if (!orderBy) return;
      return `${sortDesc ? '-' : ''}${orderBy}`;
    },
    mapOrdering(sortBy) {
      return ({
        name: 'name',
        description: 'description',
        schoolCategory: 'school_category_name',
      })?.[sortBy] || this.$options.camelToSnakeCase(sortBy);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../assets/scss/shared.scss';

.bottom-space {
  margin-bottom: 0px;

  @include for-size(phone-only) {
    margin-bottom: 15px;
  }
}
</style>
