<template>
  <b-modal
    :visible="isShown"
    size="md"
    :title="`${isEditing ? 'Edit' : 'Add'} Term`"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    @hidden="$emit('update:isShown', false)"
    :centered="true">
    <div class="modal-field-container">
      <b-form-group>
        <label class="required">Name</label>
        <b-form-input />
        <b-form-invalid-feedback>

        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label>Description</label>
        <b-form-textarea />
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

export default {
  components: {
    FooterAction
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
      term: {}
    }
  },
  computed: {
    isEditing() {
      // if term.id has anything, the form is in edit mode
      return !!this.term?.[this.resourceValueKey];
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
      this.term = {
        ...nValue
      }
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
