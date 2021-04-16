<template>
  <b-modal
    :visible="isShown"
    size="md"
    :title="`${isEditing ? 'Edit' : 'Add'} Education`"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    @hidden="$emit('update:isShown', false)"
    :centered="true">
    <div class="modal-field-container">
      <b-form-group>
        <label class="required">School</label>
        <b-form-input v-model="form.fields.school"
          :state="form.states.school"/>
        <b-form-invalid-feedback>
          {{ form.errors.school }}
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
      <b-form-group>
        <label>Degree</label>
        <b-form-input v-model="form.fields.degree" />
      </b-form-group>
      <b-form-group>
        <label>Field of Study</label>
        <b-form-input v-model="form.fields.field" />
      </b-form-group>
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label>Start Year</label>
            <b-form-input  v-model="form.fields.start" />
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label>End Year(or Expected)</label>
            <b-form-input v-model="form.fields.end" max="9999"/>
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <b-form-group>
        <label class="required">Societies or Activities</label>
        <b-form-textarea
          v-model="form.fields.societies"
          :state="form.states.societies"/>
        <b-form-invalid-feedback>
          {{ form.errors.societies }}
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        @onConfirm="onSave"
        @onDelete="$emit('onDelete', data[resourceValueKey])"
        @onCancel="isShown = false"
        confirmText="Save"
        :isConfirmBusy="isConfirmBusy"
        :showDelete="isEditing"
        :isDeleteBusy="isDeleteBusy"
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
      education: {}
    }
  },
  computed: {
    isEditing() {
      // if education.id has anything, the form is in edit mode
      return !!this.education?.[this.resourceValueKey];
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
      this.education = {
        ...nValue
      }
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
