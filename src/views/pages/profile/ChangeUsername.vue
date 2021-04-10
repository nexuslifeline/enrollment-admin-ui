<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Change Username"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    :centered="true"
    @hidden="$router.push({ name: 'Profile' })">
    <div class="field-container">
      <b-form-group description="To ensure that we will properly linked your account its necessary to use your email address as your username.">
        <label class="required">Username</label>
        <b-form-input />
        <b-form-invalid-feedback>

        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        @onConfirm="onSave"
        @onCancel="isShown = false"
        :isConfirmBusy="isConfirmBusy"
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
  data() {
    return {
      isConfirmBusy: false,
      isShown: true
    }
  },
  methods: {
    onSave() {
      alert('save here')
    }
  }
};
</script>
<style lang="scss" scoped>
  .field-container {
    display: flex;
    flex-direction: column;
    max-height: 68vh;
    overflow: auto;
    padding: 20px 30px;
  }
</style>
