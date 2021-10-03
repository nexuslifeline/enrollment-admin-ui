<template>
  <PageContent title="School Year Management"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadSchoolYear"
    :filterVisible="isFilterVisible"
    @create="onCreate"
    :isBusyCreating="isCreating"
    :createButtonVisible="isAccessible($options.SchoolYearPermissions.ADD.id)">
     <template v-slot:filters>
      <b-form-input
        v-model="filters.schoolYear.criteria"
        debounce="500"
        type="text"
        placeholder="Search"
      />
    </template>
    <template v-slot:content>
      <div>
        <!-- table -->
        <b-row>
          <b-col md="12">
            <b-table
              class="c-table"
              small
              hover
              outlined
              show-empty
              :fields="tables.schoolYears.fields"
              :busy="tables.schoolYears.isBusy"
              :items.sync="tables.schoolYears.items"
              :current-page="paginations.schoolYear.page"
              :per-page="paginations.schoolYear.perPage"
              :filter="filters.schoolYear.criteria"
              responsive
            >
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <v-icon name="spinner" spin class="mr-2" />
                  <strong>Loading...</strong>
                </div>
              </template>
              <template v-slot:cell(name)="row">
                <b-link
                  @click="visitPage(row)"
                  :disabled="
                    !isAccessible($options.SchoolYearPermissions.EDIT.id)
                  "
                  >{{ row.value || 'No SY Name' }}
                </b-link>
              </template>
              <template v-slot:cell(isActive)="row">
                <b-badge :variant="row.item.isActive ? 'success' : 'danger'">
                  {{ row.item.isActive ? 'Active' : 'Inactive' }}
                </b-badge>
              </template>
              <template v-slot:cell(action)="row">
                <b-dropdown
                  v-if="isAccessible([
                      $options.SchoolYearPermissions.EDIT.id,
                      $options.SchoolYearPermissions.DELETE.id,
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
                    v-if="isAccessible($options.SchoolYearPermissions.EDIT.id)"
                    @click="visitPage(row)"
                    :disabled="showModalEntry">
                    Edit & Setup
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="!row.item.isActive && isAccessible($options.SchoolYearPermissions.DELETE.id)"
                    @click="
                      (forms.schoolYear.fields.id = row.item.id),
                        (showModalConfirmation = true)
                    "
                    :disabled="showModalConfirmation">
                    Delete
                  </b-dropdown-item>
                </b-dropdown>
              </template>
            </b-table>
            <b-row>
              <b-col md="6">
                Showing {{ paginations.schoolYear.from }} to
                {{ paginations.schoolYear.to }} of
                {{ paginations.schoolYear.totalRows }} records.
              </b-col>
              <b-col md="6">
                <b-pagination
                  class="c-pagination"
                  v-model="paginations.schoolYear.page"
                  :total-rows="paginations.schoolYear.totalRows"
                  :per-page="paginations.schoolYear.perPage"
                  size="sm"
                  align="end"
                  @input="paginate(paginations.schoolYear)"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <!-- end table -->
      </div>


    <!-- Modal Confirmation -->
    <b-modal
      v-model="showModalConfirmation"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        Delete School Year
      </div>
      Are you sure you want to delete this School Year ?
      <div slot="modal-footer">
        <b-button
          :disabled="forms.schoolYear.isProcessing"
          variant="dark"
          class="mr-2 btn-save"
          @click="onSchoolYearDelete()"
        >
          <v-icon
            v-if="forms.schoolYear.isProcessing"
            name="sync"
            spin
            class="mr-2"
          />
          Yes
        </b-button>
        <b-button
          variant="primary"
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
import { SchoolYearApi } from '../../../mixins/api';
import Tables from '../../../helpers/tables';
import {
  clearFields,
  reset,
  validate,
  showNotification,
} from '../../../helpers/forms';
import { copyValue } from '../../../helpers/extractor';
import { SchoolYearPermissions } from '../../../helpers/enum';
import Access from '../../../mixins/utils/Access';
import Card from '../../components/Card';
import PageContent from "../../components/PageContainer/PageContent";

const schoolYearFields = {
  id: null,
  name: null,
  description: null,
  isActive: null,
  startDate: null,
};

export default {
  name: 'schoolYear',
  mixins: [Tables, SchoolYearApi, Access],
  components: {
    Card,
    PageContent
  },
  SchoolYearPermissions,
  data() {
    return {
      isCreating: false,
      isFilterVisible: true,
      entryMode: 'Add',
      showModalEntry: false,
      showModalConfirmation: false,
      forms: {
        schoolYear: {
          isProcessing: false,
          isLoading: false,
          fields: { ...schoolYearFields },
          states: { ...schoolYearFields },
          errors: { ...schoolYearFields },
        },
      },
      tables: {
        schoolYears: {
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
              key: 'startDate',
              label: 'Start Date',
              tdClass: 'align-middle',
              thStyle: { width: '20%' },
            },
            {
              key: 'isActive',
              label: 'Status',
              tdClass: 'align-middle',
              thStyle: { width: '50px' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thStyle: { width: '45px' },
            },
          ],
          items: [],
        },
      },
      paginations: {
        schoolYear: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        schoolYear: {
          criteria: null,
        },
      },
    };
  },
  created() {
    this.loadSchoolYear();
  },
  methods: {
    loadSchoolYear() {
      const { schoolYears } = this.tables;
      const { schoolYear } = this.paginations;

      schoolYears.isBusy = true;
      const params = { paginate: false };
      this.getSchoolYearList(params)
        .then(({ data }) => {
          schoolYears.items = data;
          schoolYear.totalRows = data.length;
          this.paginate(schoolYear);
          schoolYears.isBusy = false;
        })
        .catch((error) => {
          schoolYears.isBusy = false;
        });
    },
    onCreate() {
      this.isCreating = true
      this.addSchoolYear({ isActive: false }).then(({ data }) => {
        this.$router.push({ name: 'School Year Setup', params: { id: data.id } });
        this.isCreating = false
      });
    },
    onSchoolYearDelete() {
      const {
        schoolYear,
        schoolYear: {
          fields: { id },
        },
      } = this.forms;
      const { schoolYears } = this.tables;
      schoolYear.isProcessing = true;
      this.deleteSchoolYear(id).then(({ data }) => {
        this.deleteRow(schoolYears, this.paginations.schoolYear, id);
        schoolYear.isProcessing = false;
        showNotification(this, 'success', 'School Year deleted successfully.');
        this.showModalConfirmation = false;
      });
    },
    visitPage(row) {
      this.$router.push({ name: 'School Year Setup', params: { id: row.item.id } });
    }
  },
  computed: {
    activeSchoolYearId() {
      return this.$store.state?.schoolYear?.id || 0
    }
  }
};
</script>

