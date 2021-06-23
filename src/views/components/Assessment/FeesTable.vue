<template>
  <div>
    <b-table
      hover
      outlined
      small
      responsive
      show-empty
      :fields="tables.studentFees.fields"
      :items="studentFees"
      :busy="tables.studentFees.isBusy"
    >
      <template v-slot:table-busy>
        <div class="text-center my-2">
          <v-icon name="spinner" spin class="mr-2" />
          <strong>Loading...</strong>
        </div>
      </template>
      <template v-slot:cell(pivot.notes)="row">
        <b-form-input
          v-model="row.item.pivot.notes"
          :disabled="!isDisabled"
        />
      </template>
      <template v-slot:cell(pivot.isInitialFee)="row">
        <!-- <b-form-checkbox
          :disabled="!isDisabled"
          value="1"
          unchecked-value="0"
          v-model="row.item.pivot.isInitialFee"
        /> -->
        <Toggle
          @input="row.item.pivot.isInitialFee = $event ? 1 : 0"
          :value="row.item.pivot.isInitialFee"
          :isDisabled="!isDisabled"/>
      </template>
      <template v-slot:cell(pivot.amount)="row">
        <vue-autonumeric
          :disabled="!isDisabled"
          v-model="row.item.pivot.amount"
          class="form-control text-right"
          :options="[
            {
              minimumValue: 0,
              modifyValueOnWheel: false,
              emptyInputBehavior: 0,
            },
          ]"
        >
        </vue-autonumeric>
      </template>
      <template v-slot:cell(action)="row">
        <b-button
          v-if="isDisabled && row.item.id !== $options.Fees.TUITION_FEE.id"
          @click="removeFee(row)"
          size="sm"
          variant="danger"
        >
          <v-icon name="trash" />
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import Toggle from '../Form/Toggle'
import { Fees } from "../../../helpers/enum";
export default {
  Fees,
  props: {
    studentFees: {
      type: [Array],
      default: []
    },
    isDisabled: {
      type: [Boolean],
      default: false
    }
  },
  components: { Toggle },
  data() {
    return  {
      tables: {
        studentFees: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'NAME',
              tdClass: 'align-middle',
              thStyle: { width: '25%' },
            },
            {
              key: 'schoolFeeCategory.name',
              label: 'CATEGORY',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'pivot.notes',
              label: 'NOTES',
              tdClass: 'align-middle',
              thStyle: { width: '25%' },
            },
            {
              key: 'pivot.isInitialFee',
              label: 'INITIAL FEE',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'pivot.amount',
              label: 'AMOUNT',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '20%' },
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
      },
    }
  },
  methods: {
    removeFee(row) {
      const { index } = row
      this.studentFees.splice(index, 1)
    }
  }
}
</script>

<style>

</style>