<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Edit Profile"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    :centered="true"
    @hidden="$router.push({ name: 'Profile' })">
    <div class="field-container">
      <b-form-group>
        <label class="required">First Name</label>
        <b-form-input />
        <b-form-invalid-feedback>

        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label>Middle Name</label>
        <b-form-input />
      </b-form-group>
      <b-form-group>
        <label class="required">Last Name</label>
        <b-form-input />
        <b-form-invalid-feedback>

        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">Date of Birth</label>
        <b-form-input type="date" />
        <b-form-invalid-feedback>

        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">Address</label>
        <b-form-textarea />
        <b-form-invalid-feedback>

        </b-form-invalid-feedback>
      </b-form-group>
      <LinkVisibilityToggler linkText="Add Contact info" hideLinkText="Hide Contact info" :hideOnContentShow="false">
        <template>
          <b-form-group>
            <label>Mobile Number</label>
            <b-form-input />
          </b-form-group>
          <b-form-group>
            <label>Phone Number</label>
            <b-form-input />
          </b-form-group>
          <b-form-group>
            <label>Facebook:</label>
            <b-form-input />
          </b-form-group>
          <b-form-group>
            <label>Instagram:</label>
            <b-form-input />
          </b-form-group>
          <b-form-group>
            <label>Twitter:</label>
            <b-form-input />
          </b-form-group>
          <b-form-group>
            <label>Website:</label>
            <b-form-input />
          </b-form-group>
        </template>
      </LinkVisibilityToggler>
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
import LinkVisibilityToggler from '../../components/VisibilityToggler/Link';
export default {
  components: {
    FooterAction,
    LinkVisibilityToggler
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
