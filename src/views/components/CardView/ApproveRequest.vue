<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Change Curriculum"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    :centered="true">
    <div class="modal-field-container overflow-visible">

    </div>
    <template v-slot:modal-footer>
      <FooterAction
        @onConfirm="$emit('onSave')"
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
