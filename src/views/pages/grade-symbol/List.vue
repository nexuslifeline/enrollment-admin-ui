<template>
  <PageContent
    title="Grade Symbol"
    description="Manage Grade Symbols, description and other details."
    :searchKeyword="filters.gradeSymbol.criteria"
    :pageFrom="paginations.gradeSymbol.from"
    :pageTo="paginations.gradeSymbol.to"
    :pageTotal="paginations.gradeSymbol.totalRows"
    :perPage="paginations.gradeSymbol.perPage"
    :currentPage.sync="paginations.gradeSymbol.page"
    @onPageChange="loadGradeSymbol"
    @onRefresh="loadGradeSymbol"
    :createButtonVisible="isAccessible($options.GradeSymbolPermissions.ADD.id)"
    @create="setCreate">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.gradeSymbol.criteria"
        debounce="500"
        type="text"
        placeholder="Search"
      />
    </template>
    <template v-slot:content>
      <div>
        <b-table
          class="c-table"
          hover
          outlined
          small
          show-empty
          :fields="tables.gradeSymbols.fields"
          :items="tables.gradeSymbols.items"
          :busy="tables.gradeSymbols.isBusy"
          :filter="filters.gradeSymbol.criteria"
          @filtered="onFiltered($event, paginations.gradeSymbol)"
          :current-page="paginations.gradeSymbol.page"
          responsive
        >
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon name="spinner" spin class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(action)="data">
            <b-dropdown
              right
              variant="link"
              toggle-class="text-decoration-none"
              no-caret
              v-if="isAccessible(1)"
              boundary="window"
            >
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                v-if="isAccessible($options.GradeSymbolPermissions.EDIT.id)"
                @click="setUpdate(data.item)"
                :disabled="showModalEntry">
                Edit
              </b-dropdown-item>
              <b-dropdown-item
                v-if="isAccessible($options.GradeSymbolPermissions.DELETE.id)"
                @click="setDelete(data.item)"
                :disabled="showModalConfirmation">
                Delete
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </b-table>

        <GradeSymbolEntry
          v-if="showModalEntry"
          :isShown.sync="showModalEntry"
          :data="selected"
          @onGradeSymbolCreated="onGradeSymbolCreated"
          @onGradeSymbolUpdated="onGradeSymbolUpdated"/>

        <ConfirmationModal
          :isShown.sync="showModalConfirmation"
          title="Delete Grade Symbol"
          @onCancel="showModalConfirmation = false"
          @onYes="onDeleteGradeSymbol"
          :isConfirmBusy="isDeleting">
          <template #modal-body>
            Are you sure you want to delete grade symbol ?
          </template>
        </ConfirmationModal>
      </div>
    </template>
  </PageContent>
  <!-- main container -->
</template>
<script>
import {
  GradeSymbolPermissions
} from '../../../helpers/enum';
import { GradeSymbolApi } from '../../../mixins/api';
import Access from '../../../mixins/utils/Access';
import PageContent from '../../components/PageContainer/PageContent'
import Tables from '../../../helpers/tables';
import GradeSymbolEntry from './Entry'
import { formatNumber, showNotification } from '../../../helpers/forms';
import ConfirmationModal from '../../components/ConfirmationModal'
export default {
  GradeSymbolPermissions,
  components: {
    PageContent,
    GradeSymbolEntry,
    ConfirmationModal
  },
  mixins: [GradeSymbolApi, Access, Tables],
  data() {
    return {
      showModalEntry: false,
      showModalConfirmation: false,
      isDeleting: false,
      selected: null,
      sortBy: 'name',
      sortDesc: true,
      isFilterVisible: true,
      tables: {
        gradeSymbols: {
          isBusy: false,
          fields: [
            {
              key: 'symbol',
              label: 'Symbol',
              tdClass: 'align-middle',
              thStyle: { width: '60%' },
              sortable: true
            },
            {
              key: 'highest',
              label: 'Highest',
              tdClass: 'align-middle',
              thStyle: { width: '20%' },
              sortable: true,
              formatter: (value) => {
                return formatNumber(value);
              },
            },
            {
              key: 'lowest',
              label: 'Lowest',
              tdClass: 'align-middle',
              thStyle: { width: '20%' },
              sortable: true,
              formatter: (value) => {
                return formatNumber(value);
              },
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
        gradeSymbol: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        gradeSymbol: {
          criteria: null,
        },
      },
      options: {
        courses: {
          items: [],
        },
      },
    };
  },
  created() {
    this.loadGradeSymbol();
  },
  methods: {
    loadGradeSymbol() {
      const { gradeSymbols } = this.tables;
      const { gradeSymbol, gradeSymbol: { perPage, page } } = this.paginations;
      const { criteria } = this.filters.gradeSymbol;
      const params = { paginate: false, perPage, page, criteria }

      gradeSymbols.isBusy = true;
      this.getGradeSymbolList(params).then(({ data }) => {
        gradeSymbols.items = data
        gradeSymbols.totalRows = data.length;
        this.paginate(gradeSymbol);
        gradeSymbols.isBusy = false;
      });
    },
    setCreate() {
      this.showModalEntry = true
      this.selected = null
    },
    setUpdate(gradeSymbol) {
      this.selected = gradeSymbol
      this.showModalEntry = true
    },
    setDelete(gradeSymbol){
      this.selected = gradeSymbol
      this.showModalConfirmation = true
    },
    onGradeSymbolCreated(gradeSymbol) {
      const { gradeSymbols } = this.tables
      this.addRow(gradeSymbols, this.paginations.gradeSymbol, gradeSymbol);
    },
    onGradeSymbolUpdated(gradeSymbol) {
      const { gradeSymbols } = this.tables
      this.updateRow(gradeSymbols, gradeSymbol);
    },
    onDeleteGradeSymbol(){
      const { id: gradeSymbolId } = this.selected
      const { gradeSymbols } = this.tables
      this.isDeleting = true

      this.deleteGradeSymbol(gradeSymbolId).then(({ data }) => {
        showNotification(this, 'success', 'Grade Symbol is Deleted')
        this.isDeleting = false
        this.showModalConfirmation = false
        this.deleteRow(gradeSymbols, this.paginations.gradeSymbol, gradeSymbolId);
      }).catch((error) => {
        const errors = error.response.data.errors;
        this.isDeleting = false;
        console.log(errors)
      });
    }
  },
  computed: {
  }
};
</script>
