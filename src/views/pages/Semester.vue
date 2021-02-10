<template>
  <div class="c-page-content">
    <Card title="Semester Management">
      <div>
        <!-- add button and search -->
        <b-row class="mb-3">
          <b-col md="12">
            <b-row>
              <b-col md="4" offset-md="8">
                <b-form-input
                  v-model="filters.semester.criteria"
                  type="text"
                  placeholder="Search"
                >
                </b-form-input>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <!-- end add button and search -->
        <!-- table -->
        <b-row>
          <b-col md="12">
            <b-table
              class="c-table"
              hover
              outlined
              show-empty
              :fields="tables.semesters.fields"
              :busy="tables.semesters.isBusy"
              :items.sync="tables.semesters.items"
              :current-page="paginations.semester.page"
              :per-page="paginations.semester.perPage"
              :filter="filters.semester.criteria"
            >
              <!-- :filter="filters.semester.criteria> -->
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <v-icon name="spinner" spin class="mr-2" />
                  <strong>Loading...</strong>
                </div>
              </template>
              <template v-slot:cell(name)="{ item, value }">
                <b-link @click="setAsActiveSemester(item)">{{ value }} </b-link>
              </template>
              <template v-slot:cell(action)="row">
                <!-- need to add user access settings -->
                <b-dropdown
                  right
                  variant="link"
                  toggle-class="text-decoration-none"
                  no-caret
                >
                  <template v-slot:button-content>
                    <v-icon name="ellipsis-v" />
                  </template>
                  <!-- need to add user access settings -->
                  <b-dropdown-item @click="setAsActiveSemester(row.item)">
                    Set as Active Semester
                  </b-dropdown-item>
                </b-dropdown>
              </template>
              <template v-slot:cell(isActive)="row">
                <b-badge :variant="row.item.isActive ? 'success' : 'danger'">
                  {{ row.item.isActive ? 'Active' : 'Inactive' }}
                </b-badge>
              </template>
            </b-table>
            <b-row>
              <b-col md="6">
                Showing {{ paginations.semester.from }} to
                {{ paginations.semester.to }} of
                {{ paginations.semester.totalRows }} records.
              </b-col>
              <b-col md="6">
                <b-pagination
                  class="c-pagination"
                  v-model="paginations.semester.page"
                  :total-rows="paginations.semester.totalRows"
                  :per-page="paginations.semester.perPage"
                  size="sm"
                  align="end"
                  @input="recordDetails(paginations.semester)"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <!-- end table -->
      </div>
    </Card>
    <b-modal
      v-model="showConfirmationModal"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        Set Active Semester
      </div>
      Are you sure you want to set this Semester as active ?
      <div slot="modal-footer">
        <b-button
          :disabled="isProcessing"
          variant="outline-primary"
          class="mr-2 btn-save"
          @click="onSetActiveSemester()"
        >
          <v-icon v-if="isProcessing" name="sync" spin class="mr-2" />
          Yes
        </b-button>
        <b-button
          variant="outline-danger"
          class="btn-close"
          @click="showConfirmationModal = false"
        >
          No
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { SemesterApi } from '../../mixins/api';
import Tables from '../../helpers/tables';
import Card from '../components/Card';
import { copyValue } from '../../helpers/extractor';
import {
  validate,
  reset,
  clearFields,
  showNotification,
} from '../../helpers/forms';

const semesterFields = {
  id: null,
  name: null,
  description: null,
  isActive: null,
};

export default {
  name: 'semester',
  mixins: [Tables, SemesterApi],
  components: {
    Card,
  },
  data() {
    return {
      isProcessing: false,
      showConfirmationModal: false,
      tables: {
        semesters: {
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
              key: 'isActive',
              label: 'Status',
              tdClass: 'align-middle',
              thStyle: { width: '10%' },
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
      forms: {
        semester: {
          fields: { ...semesterFields },
          states: { ...semesterFields },
          errors: { ...semesterFields },
        },
      },
      paginations: {
        semester: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        semester: {
          criteria: null,
        },
      },
    };
  },
  created() {
    this.loadSemester();
  },
  methods: {
    loadSemester() {
      const { semesters } = this.tables;
      const { semester } = this.paginations;

      semesters.isBusy = true;
      const params = { paginate: false };
      this.getSemesterList(params)
        .then(({ data }) => {
          semesters.items = data;
          semester.totalRows = data.length;
          this.recordDetails(semester);
          semesters.isBusy = false;
        })
        .catch((error) => {
          semesters.isBusy = false;
        });
    },
    onSetActiveSemester(row) {
      this.isProcessing = true;
      const { semester } = this.forms;
      const payLoad = {
        ...semester.fields,
        isActive: true,
      };
      this.updateSemester(payLoad, semester.fields.id)
        .then(({ data }) => {
          this.showConfirmationModal = false;
          this.loadSemester();
          showNotification(this, 'success', 'Semeste has been set to active.');
          this.isProcessing = false;
        })
        .catch((error) => {
          const errors = error.response.data.errors;
          this.isProcessing = false;
          validate(semester.fields, errors);
        });
    },
    setAsActiveSemester(item) {
      copyValue(item, this.forms.semester.fields);
      this.showConfirmationModal = true;
    },
  },
};
</script>
