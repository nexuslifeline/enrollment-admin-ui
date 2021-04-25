<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Create Account"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    :centered="true"
    @hidden="onClose">
    <div class="modal-field-container">
      <b-form-group>
        <label class="required">Username</label>
        <b-form-input />
        <b-form-invalid-feedback>

        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">Password</label>
        <b-form-input type="password" />
        <b-form-invalid-feedback>

        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">Confirm</label>
        <b-form-input type="password" />
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
import FooterAction from '../ModalFooter/ActionBar';
export default {
  components: {
    FooterAction
  },
  mixins: [],
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

    },
    onClose() {
      this.$router.push({
        name: 'Student Edit',
        params: { studentId: this.$route.params.studentId }
      });
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
