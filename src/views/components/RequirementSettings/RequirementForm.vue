<template>
  <b-modal
    :visible="isShown"
    size="md"
    :title="`${isEditing ? 'Edit' : 'Add'} Requirement`"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    @hidden="$emit('update:isShown', false)"
    :centered="true">
    <div class="modal-field-container overflow-visible">
      <b-form-group
        label="Document Type"
        labelClass="required"
        :state="states.documentTypeId"
        :invalid-feedback="errors.documentTypeId">
        <SelectDocumentType v-model="data.documentType" label="name" />
      </b-form-group>
      <b-form-group>
        <label>Description</label>
        <b-form-textarea v-model="data.description" />
      </b-form-group>
      <b-form-group
        label="School Category"
        labelClass="required"
        :state="states.schoolCategoryId"
        :invalid-feedback="errors.schoolCategoryId">
        <SelectCategory v-model="data.schoolCategory" />
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
import { SchoolCategories, Semesters } from '../../../helpers/enum.js'
import SelectDocumentType from "../../components/Dropdowns/SelectDocumentType";

export default {
  SchoolCategories,
  Semesters,
  components: {
    FooterAction,
    SelectDocumentType
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
    isConfirmBusy: {
      type: [Boolean],
      default: false
    },
    isDeleteBusy: {
      type: [Boolean],
      default: false
    },
    states: {
      type: [Object]
    },
    errors: {
      type: [Object]
    }
  },
  computed: {
    isEditing() {
      // if requirement.id has anything, the form is in edit mode
      return !!this.data?.[this.resourceValueKey];
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
  }
};
</script>
<style lang="scss" scoped>

</style>
