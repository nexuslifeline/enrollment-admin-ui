<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Grade Symbol Entry"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    @hidden="$emit('update:isShown', false)"
    :centered="true">
    <div class="modal-field-container overflow-visible">
      <b-form-group
        label="Symbol"
        labelClass="required"
        :state="forms.gradeSymbol.states.symbol"
        :invalid-feedback="forms.gradeSymbol.errors.symbol">
        <b-form-input
          v-model="forms.gradeSymbol.fields.symbol"
          debounce="500"/>
      </b-form-group>

      <b-form-group
        label="Highest"
        labelClass="required"
        :state="forms.gradeSymbol.states.highest"
        :invalid-feedback="forms.gradeSymbol.errors.highest">
         <vue-autonumeric
            v-model="forms.gradeSymbol.fields.highest"
            class="form-control text-right"
            :options="[{
              maximumValue: 100,
              emptyInputBehavior: 0,
            }]"/>
      </b-form-group>

      <b-form-group
        label="Lowest"
        labelClass="required"
        :state="forms.gradeSymbol.states.lowest"
        :invalid-feedback="forms.gradeSymbol.errors.lowest">
         <vue-autonumeric
            v-model="forms.gradeSymbol.fields.lowest"
            class="form-control text-right"
            :options="[{
              maximumValue: 100,
              emptyInputBehavior: 0,
            }]"/>
      </b-form-group>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        confirmText="Save"
        @onConfirm="entryMode === 'Add' ? onAdd() : onUpdate()"
        @onCancel="$emit('update:isShown', false)"
        :isConfirmBusy="isConfirmBusy"
      />
    </template>
  </b-modal>
</template>
<script>
import { copyValue } from '../../../helpers/extractor';
import { showNotification } from '../../../helpers/forms';
import { GradeSymbolApi } from '../../../mixins/api';
import FooterAction from '../../components/ModalFooter/ActionBar';

const gradeSymbolFields = {
  symbol: null,
  highest: 100,
  lowest: 65
}

const gradeSymbolErrorFields = {
  symbol: null,
  highest: null,
  lowest: null
}

export default {
  props: {
    isShown: {
      type: [Boolean]
    },
    data: {
      type: [Object]
    },
  },
  mixins: [GradeSymbolApi],
  components: {
    FooterAction
  },
  data() {
    return {
      isConfirmBusy: false,
      entryMode: 'Add',
      forms: {
        gradeSymbol: {
          fields: { ...gradeSymbolFields },
          states: { ...gradeSymbolErrorFields },
          errors: { ...gradeSymbolErrorFields }
        }
      }
    }
  },
  created() {
    if(this.data) {
      alert('loaded')
      const { gradeSymbol } = this.forms
      copyValue(this.data, gradeSymbol.fields)
      this.entryMode = 'Edit'
    }
  },
  methods: {
    onAdd() {
      this.isConfirmBusy = true
      const { gradeSymbol, gradeSymbol: { fields } } = this.forms
      this.addGradeSymbol({ ...fields }).then(({ data }) => {
        showNotification(this, 'success', 'Grade Symbol is Added')
        this.isConfirmBusy = false
        this.$emit('onGradeSymbolCreated', data)
        this.$emit('update:isShown', false)
      }).catch((error) => {
        const errors = error.response.data.errors;
        this.isConfirmBusy = false;
        validate(gradeSymbol, errors, this);
      });
    },
    onUpdate() {
      this.isConfirmBusy = true
      const { gradeSymbol, gradeSymbol: { fields } } = this.forms
      const { id: gradeSymbolId } = this.data
      this.updateGradeSymbol({ ...fields }, gradeSymbolId).then(({ data }) => {
        showNotification(this, 'success', 'Grade Symbol is Updated')
        this.isConfirmBusy = false
        this.$emit('onGradeSymbolUpdated', data)
        this.$emit('update:isShown', false)
      }).catch((error) => {
        const errors = error.response.data.errors;
        this.isConfirmBusy = false;
        validate(gradeSymbol, errors, this);
      });
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
