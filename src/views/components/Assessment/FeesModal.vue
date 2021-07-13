<template>
  <b-modal
    :visible="isShown"
    size="xl"
    title="School Fees"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    @hidden="$emit('update:isShown', false)"
    :centered="true">
    <div class="modal-field-container overflow-visible">
      <b-row class="mb-2">
        <b-col offset-md="8" md="4">
          <b-form-input
            v-model="filters.fee.criteria"
            type="text"
            placeholder="Search" />
        </b-col>
      </b-row>
       <b-table
          small
          hover
          outlined
          show-empty
          :items.sync="tables.fees.items"
          :fields="tables.fees.fields"
          :filter="filters.fee.criteria"
          :busy="tables.fees.isBusy2"
          :current-page="paginations.fee.page"
          :per-page="paginations.fee.perPage"
          @filtered="onFiltered($event, paginations.fee)"
        >
          <template v-slot:cell(action)="row">
            <b-button v-if="!isAdded(row)" @click="$emit('onAddFee', row)" size="sm" variant="primary">
              <v-icon name="plus" />
            </b-button>
            <b-button v-else disabled size="sm" variant="primary"> Added
            </b-button>
          </template>
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon name="spinner" spin class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
        </b-table>
        <b-row>
          <b-col md="6">
            Showing {{ paginations.fee.from }} to {{ paginations.fee.to }} of
            {{ paginations.fee.totalRows }} records.
          </b-col>
          <b-col md="6">
            <b-pagination
              v-model="paginations.fee.page"
              :total-rows="paginations.fee.totalRows"
              :per-page="paginations.fee.perPage"
              size="sm"
              align="end"
              @input="paginate(paginations.fee)"
            />
          </b-col>
        </b-row>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        :showConfirm="false"
        @onCancel="$emit('update:isShown', false)"
      />
    </template>
  </b-modal>
</template>

<script>
import { SchoolFeeApi } from '../../../mixins/api';
import FooterAction from '../ModalFooter/ActionBar';
import Table from '../../../helpers/tables'
export default {
  props: {
    isShown: {
      type: [Boolean]
    },
    studentFees: {
      type: [Array],
      default: []
    }
  },
  components: { FooterAction },
  mixins: [ SchoolFeeApi, Table ],
  data() {
    return {
      tables: {
        fees: {
          fields: [
            {
              key: 'name',
              label: 'NAME',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
            },
            {
              key: 'description',
              label: 'Description',
              tdClass: 'align-middle',
              thStyle: { width: '40%' },
            },
            {
              key: 'schoolFeeCategory.name',
              label: 'Category',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '150px' },
            },
          ],
          items: [],
        },
      },
      paginations: {
        fee: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 6,
        },
      },
      filters: {
        fee: {
          criteria: null,
        },
      },
    }
  },
  created() {
    this.loadFees()
  },
  methods: {
    loadFees() {
      const { fees } = this.tables;
      const { fee } = this.paginations;
      const params = { paginate: false };
      fees.isBusy = true;
      this.getSchoolFeeList(params).then(({ data }) => {
        fees.items = data;
        fee.totalRows = data.length;
        this.paginate(fee);
        fees.isBusy = false;
      });
    },
    isAdded(row) {
      return this.studentFees.some(v => v.id === row.item?.id);
    },
  }
}
</script>

<style>

</style>