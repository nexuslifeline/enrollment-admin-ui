<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Approve Evaluation"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    @hidden="$emit('update:isShown', false)"
    :centered="true">
    <div class="modal-field-container overflow-visible">
      <label>Notes</label>
      <b-textarea
        rows="7"
      />
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        confirmText="Confirm Approval"
        @onConfirm="onApproveEvaluation"
        @onCancel="$emit('onCancel')"
        :isConfirmBusy="isConfirmBusy"
      />
    </template>
  </b-modal>
</template>
<script>
import FooterAction from '../ModalFooter/ActionBar';
export default {
  props: {
    isShown: {
      type: [Boolean]
    },
    isConfirmBusy: {
      type: [Boolean]
    },
    evaluationId: {
      type: [Number, String]
    }
  },
  components: {
    FooterAction
  },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {
    onApproveEvaluation() {
      console.log('put or patch evaluation here')
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
