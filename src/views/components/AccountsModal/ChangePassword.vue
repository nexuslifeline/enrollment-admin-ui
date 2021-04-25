<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Change Password"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    :centered="true"
    @hidden="$router.push(previousRoute)">
    <div class="modal-field-container">
      <b-form-group>
        <label class="required">New Password</label>
        <b-form-input type="password" />
        <b-form-invalid-feedback>

        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">Confirm Password</label>
        <b-form-input type="password" />
        <b-form-invalid-feedback>

        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        @onConfirm="onSave"
        confirmText="Update"
        @onCancel="isShown = false"
        :isConfirmBusy="isConfirmBusy"
      />
  </template>
  </b-modal>
</template>
<script>
import FooterAction from '../ModalFooter/ActionBar';

export default {
  props: {
    previousRoute: {
      type: Object
    },
    user: {
      type: Object
    }
  },
  components: {
    FooterAction
  },
  data() {
    return {
      isConfirmBusy: false,
      isShown: true
    }
  },
  created() {

  },
  methods: {
    onSave() {
       alert('PUT users/:id/change-password')
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
