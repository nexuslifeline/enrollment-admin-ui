<template>
  <PageContent
    title="Department Management"
    description="Manage department name, description and other details."
    :searchKeyword="filters.department.criteria"
    :pageFrom="paginations.department.from"
    :pageTo="paginations.department.to"
    :pageTotal="paginations.department.totalRows"
    :perPage="paginations.department.perPage"
    :currentPage.sync="paginations.department.page"
    @onPageChange="loadDepartments"
    @onRefresh="loadDepartments"
    @create="setCreate()"
    :createButtonVisible="isAccessible($options.DepartmentPermissions.ADD.id)">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.department.criteria"
        debounce="500"
        type="text"
        placeholder="Search"
      />
    </template>
    <template v-slot:content>
    <div>
      <!-- add button and search -->
      <!-- <b-row class="mb-3">
        <b-col md="12">
          <b-row>
            <b-col md="8">
              <b-button
                v-if="isAccessible($options.DepartmentPermissions.ADD.id)"
                variant="primary"
                @click="setCreate()"
              >
                <v-icon name="plus-circle" /> ADD NEW DEPARTMENT
              </b-button>
            </b-col>
            <b-col md="4">
              <b-form-input
                v-model="filters.department.criteria"
                type="text"
                placeholder="Search"
              >
              </b-form-input>
            </b-col>
          </b-row>
        </b-col>
      </b-row> -->
      <!-- end add button and search -->
      <!-- table -->
      <b-table
        class="c-table"
        hover
        outlined
        show-empty
        :fields="tables.departments.fields"
        :busy="tables.departments.isBusy"
        :items="tables.departments.items"
        :current-page="paginations.department.page"
        :per-page="paginations.department.perPage"
        :filter="filters.department.criteria"
        @filtered="onFiltered($event, paginations.department)"
        responsive
      >
        <!-- :filter="filters.department.criteria> -->
        <template v-slot:table-busy>
          <div class="text-center my-2">
            <v-icon name="spinner" spin class="mr-2" />
            <strong>Loading...</strong>
          </div>
        </template>
        <template v-slot:cell(name)="{ item, value }">
          <b-link
            @click="setUpdate(item)"
            :disabled="
              !isAccessible($options.DepartmentPermissions.EDIT.id)
            "
            >{{ value }}
          </b-link>
        </template>
        <template v-slot:cell(action)="row">
          <b-dropdown
            v-if="
              isAccessible([
                $options.DepartmentPermissions.EDIT.id,
                $options.DepartmentPermissions.DELETE.id,
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
              v-if="isAccessible($options.DepartmentPermissions.EDIT.id)"
              @click="setUpdate(row.item)"
              :disabled="showModalEntry"
            >
              Edit
            </b-dropdown-item>
            <b-dropdown-item
              v-if="
                isAccessible($options.DepartmentPermissions.DELETE.id)
              "
              @click="
                (forms.department.fields.id = row.item.id),
                  (showModalConfirmation = true)
              "
              :disabled="showModalConfirmation"
            >
              Delete
            </b-dropdown-item>
          </b-dropdown>
        </template>
      </b-table>
      <!-- end table -->
    </div>

    <!-- Modal Entry -->
    <b-modal
      v-model="showModalEntry"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        <!-- modal title -->
        Department - {{ entryMode }}
      </div>
      <!-- modal title -->
      <!-- modal body -->
      <b-overlay :show="forms.department.isLoading" rounded="sm">
        <b-row>
          <b-col md="12">
            <b-form-group>
              <label class="required">Name</label>
              <b-form-input
                ref="name"
                v-model="forms.department.fields.name"
                :state="forms.department.states.name"
              />
              <b-form-invalid-feedback>
                {{ forms.department.errors.name }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <b-form-group>
              <label class="required">Description</label>
              <b-form-textarea
                ref="description"
                v-model="forms.department.fields.description"
                :state="forms.department.states.description"
              />
              <b-form-invalid-feedback>
                {{ forms.department.errors.description }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
      </b-overlay>
      <!-- end modal body -->
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
          :disabled="forms.department.isProcessing"
          variant="primary"
          class="float-right btn-save"
          @click="onDepartmentEntry()"
        >
          <v-icon
            v-if="forms.department.isProcessing"
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
        Delete Department
      </div>
      Are you sure you want to delete this Department ?
      <div slot="modal-footer">
        <b-button
          :disabled="forms.department.isProcessing"
          variant="primary"
          class="mr-2 btn-save"
          @click="onDepartmentDelete()"
        >
          <v-icon
            v-if="forms.department.isProcessing"
            name="sync"
            spin
            class="mr-2"
          />
          Yes
        </b-button>
        <b-button
          variant="dark"
          class=""
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
const departmentFields = {
  id: null,
  name: null,
  description: null,
};

import { DepartmentApi } from '../../mixins/api';
import {
  validate,
  reset,
  clearFields,
  showNotification,
} from '../../helpers/forms';
import { copyValue } from '../../helpers/extractor';
import Tables from '../../helpers/tables';
import { DepartmentPermissions } from '../../helpers/enum';
import Access from '../../mixins/utils/Access';
import Card from '../components/Card';
import PageContent from '../components/PageContainer/PageContent'

export default {
  name: 'department',
  mixins: [DepartmentApi, Tables, Access],
  components: {
    Card,
    PageContent
  },
  DepartmentPermissions,
  data() {
    return {
      isFilterVisible: true,
      showModalEntry: false,
      showModalConfirmation: false,
      entryMode: '',
      forms: {
        department: {
          isProcessing: false,
          isLoading: false,
          fields: { ...departmentFields },
          states: { ...departmentFields },
          errors: { ...departmentFields },
        },
      },
      tables: {
        departments: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
            },
            {
              key: 'description',
              label: 'DESCRIPTION',
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
        },
      },
      paginations: {
        department: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        department: {
          criteria: null,
        },
      },
    };
  },
  created() {
    this.loadDepartments();
  },
  methods: {
    loadDepartments() {
      const { departments } = this.tables;
      const { department } = this.paginations;
      departments.isBusy = true;

      var params = { paginate: false };
      this.getDepartmentList(params).then(({ data }) => {
        departments.items = data;
        department.totalRows = data.length;
        this.paginate(department);
        departments.isBusy = false;
      });
    },
    onDepartmentEntry() {
      const {
        department,
        department: { fields },
      } = this.forms;
      const { departments } = this.tables;
      department.isProcessing = true;
      reset(department);
      if (this.entryMode == 'Add') {
        this.addDepartment(fields)
          .then(({ data }) => {
            this.addRow(departments, this.paginations.department, data);
            department.isProcessing = false;
            showNotification(
              this,
              'success',
              'Department created successfully.'
            );
            this.showModalEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            department.isProcessing = false;
            validate(department, errors, this);
          });
      } else {
        const { fields } = this.forms.department;
        this.updateDepartment(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(departments, data);
            department.isProcessing = false;
            showNotification(
              this,
              'success',
              'Department updated successfully.'
            );
            this.showModalEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            department.isProcessing = false;
            validate(department, errors, this);
          });
      }
    },
    onDepartmentDelete() {
      const {
        department,
        department: {
          fields: { id },
        },
      } = this.forms;
      const { departments } = this.tables;
      department.isProcessing = true;
      this.deleteDepartment(id).then(({ data }) => {
        this.deleteRow(departments, this.paginations.department, id);
        department.isProcessing = false;
        showNotification(this, 'success', 'Department deleted successfully.');
        this.showModalConfirmation = false;
      });
    },
    setUpdate(item) {
      const {
        department,
        department: { fields },
      } = this.forms;
      this.showModalEntry = true;
      department.isLoading = true;
      copyValue(item, fields);
      reset(department);
      this.entryMode = 'Edit';
      department.isLoading = false;
    },
    setCreate() {
      console.log('click')
      const { department } = this.forms;
      this.showModalEntry = true;
      department.isLoading = true;
      reset(department);
      clearFields(department.fields);
      this.entryMode = 'Add';
      department.isLoading = false;
    },
  },
};
</script>
