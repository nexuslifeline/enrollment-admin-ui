<template>
  <b-modal
    :visible="isShown"
    size="md"
    :title="title"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    @hidden="$emit('update:isShown', false)"
    :centered="true">
    <div class="modal-field-container overflow-visible">
      <slot name="modal-body"></slot>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        confirmText="Yes"
        @onConfirm="$emit('onYes')"
        @onCancel="$emit('onCancel')"
        :isConfirmBusy="isConfirmBusy"
      />
    </template>
  </b-modal>
</template>
<script>
import FooterAction from './ModalFooter/ActionBar';
export default {
  props: {
    isShown: {
      type: [Boolean]
    },
    isConfirmBusy: {
      type: [Boolean]
    },
    title: {
      type: [String],
      default: 'Post Payment'
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

  }
};
</script>
<style lang="scss" scoped>

</style>
