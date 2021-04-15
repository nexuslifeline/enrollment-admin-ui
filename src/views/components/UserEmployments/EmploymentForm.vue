<template>
  <b-modal
    :visible="isShown"
    size="md"
    :title="`${isEditing ? 'Edit' : 'Add'} Employment`"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    @hidden="$emit('update:isShown', false)"
    :centered="true">
    <div class="modal-field-container">
      <b-form-group>
        <label class="required">Position</label>
        <b-form-input
          v-model="form.fields.position"
          :state="form.states.position"/>
        <b-form-invalid-feedback>
          {{ form.errors.position }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">Company Name</label>
        <b-form-input
          v-model="form.fields.company"
          :state="form.states.company"/>
        <b-form-invalid-feedback>
          {{ form.errors.company }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">Address</label>
        <b-form-textarea
          v-model="form.fields.address"
          :state="form.states.address"/>
        <b-form-invalid-feedback>
          {{ form.errors.address }}
        </b-form-invalid-feedback>
      </b-form-group>
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label>Start Month</label>
            <b-form-select v-model="form.fields.startMonth" >
              <b-form-select-option
                v-for="month in $options.Months.values"
                :key="month.id"
                :value="month.id">
                {{ month.name }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label>Start Year</label>
            <b-form-input v-model="form.fields.startYear" />
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label>End Month</label>
            <b-form-select
              v-model="form.fields.endMonth">
              <b-form-select-option
                v-for="month in $options.Months.values"
                :key="month.id"
                :value="month.id">
                {{ month.name }}
              </b-form-select-option>
          </b-form-select>
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label>End Year</label>
            <b-form-input v-model="form.fields.endYear" />
          </b-form-group>
        </InputContainer>
      </InputGroup>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        @onConfirm="onSave"
        @onDelete="$emit('onDelete', data[resourceValueKey])"
        @onCancel="isShown = false"
        confirmText="Save"
        :isConfirmBusy="isConfirmBusy"
        :isDeleteBusy="isDeleteBusy"
        :showDelete="isEditing"
        :showCancel="!isEditing"
      />
    </template>
  </b-modal>
</template>
<script>
import FooterAction from '../../components/ModalFooter/ActionBar';
import { InputGroup, InputContainer } from '../../components/InputGroup';
import { Months } from '../../../helpers/enum'

export default {
  Months,
  components: {
    FooterAction,
    InputGroup,
    InputContainer
  },
  props: {
    isShown: {
      type: [Boolean],
      default: false
    },
    data: {
      type: [Object]
    },
    resourceValueKey: {
      type: [String],
      default: 'id'
    },
    form: {
      type: [Object]
    },
    isConfirmBusy: {
      type: [Boolean],
      default: false
    },
    isDeleteBusy: {
      type: [Boolean],
      default: false
    },
  },
  data() {
    return {
      employment: {},
    }
  },
  computed: {
    isEditing() {
      // if employment.id has anything, the form is in edit mode
      return !!this.employment?.[this.resourceValueKey];
    }
  },
  methods: {
    onSave() {
      if (this.isEditing) {
        this.$emit('onSave', this.data[this.resourceValueKey], this.data);
      } else {
        this.$emit('onCreate', this.data);
      }
    }
  },
  watch: {
    data(nValue, oValue) {
      this.employment = {
        ...nValue
      }
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
