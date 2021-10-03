<template>
  <div>
    <div class="d-flex justify-content-end">
      <b-button
        @click="isShownFees = true"
        variant="primary">
        <v-icon name="plus-circle" /> New Item
      </b-button>
    </div>

    <b-table
      class="mt-2 c-table"
      details-td-class="table-secondary"
      hover
      outlined
      small
      show-empty
      :fields="tables.billing.fields"
      :items.sync="items"
      :busy="tables.billing.isBusy"
    >
      <template v-slot:cell(action)="row">
        <b-button @click="removeFee(row)" size="sm" variant="danger">
          <v-icon name="trash" />
        </b-button>
      </template>
      <template v-slot:cell(amount)="row">
        <vue-autonumeric
          v-model="row.item.amount"
          class="form-control text-right"
          :options="[
            {
              modifyValueOnWheel: false,
              emptyInputBehavior: 0,
            },
          ]"
        >
        </vue-autonumeric>
      </template>
      <template v-slot:custom-foot>
        <b-tr>
          <b-td colspan="2" class="text-right">
            <span class="font-weight-bold">Total (Other Fees) </span>
          </b-td>
          <b-td class="text-right">
            <span class="font-weight-bold">
              {{ $options.formatNumber(totalOtherFees) }}
            </span>
          </b-td>
          <b-td></b-td>
        </b-tr>
      </template>
    </b-table>

    <b-modal
      v-model="isShownFees"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
      size="xl" >
      <div slot="modal-title">
        School Fees
      </div>
      <b-row>
        <b-col md="12">
          <b-row class="mb-2">
            <b-col offset-md="8" md="4">
              <b-form-input
                v-model="filters.fees.criteria"
                type="text"
                placeholder="Search"
              >
              </b-form-input>
            </b-col>
          </b-row>
          <b-table
            class="c-table"
            small
            hover
            outlined
            show-empty
            :items.sync="tables.fees.items"
            :fields="tables.fees.fields"
            :filter="filters.fees.criteria"
            :busy="tables.fees.isBusy2"
            :current-page="paginations.fees.page"
            :per-page="paginations.fees.perPage"
            @filtered="onFiltered($event, paginations.fee)"
          >
            <template v-slot:cell(action)="row">
              <b-button @click="addFee(row)" :disabled="isAdded(row)" size="sm" variant="primary">
                <v-icon v-if="!isAdded(row)" name="plus" />
                <span v-else>Added</span>
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
              Showing {{ paginations.fees.from }} to {{ paginations.fees.to }} of
              {{ paginations.fees.totalRows }} records.
            </b-col>
            <b-col md="6">
              <b-pagination
                class="c-pagination"
                v-model="paginations.fees.page"
                :total-rows="paginations.fees.totalRows"
                :per-page="paginations.fees.perPage"
                size="sm"
                align="end"
                @input="paginate(paginations.fees)"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <div slot="modal-footer" class="w-100">
        <b-button
          class="float-right"
          variant="dark"
          @click="isShownFees = false"
        >
          Close
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import { showNotification, formatNumber } from '../../../helpers/forms';
  import { SchoolFeeApi } from '../../../mixins/api';
  import Tables from '../../../helpers/tables';

  export default {
    mixins: [SchoolFeeApi, Tables],
    formatNumber,
    props: {
      items: {
        type: [Array]
      }
    },
    data() {
      return {
        isShownFees: false,
        filters: {
          fees: {
            criteria: null,
          },
        },
        paginations: {
          fees: {
            from: 0,
            to: 0,
            totalRows: 0,
            page: 1,
            perPage: 6,
          },
        },
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
                key: 'action',
                label: '',
                tdClass: 'align-middle text-right',
                thClass: 'text-right',
                thStyle: { width: '30%' },
              },
            ],
            items: [],
          },
          billing: {
            isBusy: false,
            items: [],
            fields: [
              {
                key: 'schoolFee.name',
                label: 'FEE NAME',
                tdClass: 'align-middle',
                thStyle: { width: 'auto' },
              },
              {
                key: 'schoolFee.description',
                label: 'DESCRIPTION',
                tdClass: 'align-middle',
                thStyle: { width: '40%' },
              },
              {
                key: 'amount',
                label: 'AMOUNT',
                tdClass: 'align-middle text-right',
                thClass: 'text-right',
                thStyle: { width: 'auto' },
              },
              {
                key: 'action',
                label: '',
                tdClass: 'align-middle text-right',
                thClass: 'text-right',
                thStyle: { width: '5px' },
              },
            ],
          },
        }
      }
    },
    computed: {
      totalOtherFees() {
        return this.items.reduce((total, { amount })  => total += parseFloat(amount || 0), 0);
      }
    },
    created() {
      this.loadFees();
    },
    methods: {
      isAdded(row) {
        return this.items.some(v => v.schoolFeeId === row.item?.id);
      },
      removeFee(row) {
        const items = this.items.filter((v) => v.schoolFeeId !== row.item?.schoolFeeId);
        this.$emit('update:items', items);
      },
      addFee(row) {
        const found = this.items.find((v) => v.schoolFeeId === row.item?.id);

        if (found) {
          showNotification(this, 'danger', (row.item?.name || 'Untitled Fee') + ' is already added.');
          return;
        }

        const items = [...this.items];
        items.push({
          schoolFeeId: row.item.id,
          schoolFee: { name: row.item.name, description: row.item.description },
          amount: 0.0,
        });
        this.$emit('update:items', items);
      },
      loadFees() {
        const { fees } = this.tables;
        const params = { paginate: false };
        fees.isBusy = true;
        this.getSchoolFeeList(params).then(({ data }) => {
          fees.items = data;
          this.paginations.fees.totalRows = data.length;
          this.paginate(fees);
          fees.isBusy = false;
        });
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
</style>