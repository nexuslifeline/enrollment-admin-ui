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
        <b-form-input v-model="employment.position" />
        <b-form-invalid-feedback>

        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">Company Name</label>
        <b-form-input v-model="employment.company" />
        <b-form-invalid-feedback>

        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">Address</label>
        <b-form-textarea v-model="employment.address" />
        <b-form-invalid-feedback>

        </b-form-invalid-feedback>
      </b-form-group>
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label>Start Month</label>
            <b-form-select v-model="employment.start" />
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label>Start Year</label>
            <b-form-select v-model="employment.end" />
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label>End Month</label>
            <b-form-select v-model="employment.start" />
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label>End Year</label>
            <b-form-select v-model="employment.end" />
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
        :showDelete="isEditing"
        :showCancel="!isEditing"
      />
    </template>
  </b-modal>
</template>
<script>
import FooterAction from '../../components/ModalFooter/ActionBar';
import { InputGroup, InputContainer } from '../../components/InputGroup';

export default {
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
  },
  data() {
    return {
      isConfirmBusy: false,
      employment: {}
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
