<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Update Password"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    :centered="true"
    @hidden="$router.push({ name: 'Profile' })">
    <div class="modal-field-container">
       <b-form-group>
        <label class="required">Old Password</label>
        <b-form-input
          v-model="forms.user.fields.oldPassword"
          :state="forms.user.states.userOldPassword"
          type="password"/>
        <b-form-invalid-feedback>
          {{ forms.user.errors.userOldPassword }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">New Password</label>
        <b-form-input
          v-model="forms.user.fields.password"
          :state="forms.user.states.userPassword"
          type="password"/>
        <b-form-invalid-feedback>
          {{ forms.user.errors.userPassword }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group description="To ensure that you type your password correctly, you need to repeat your password here.">
        <label class="required">Confirm Password</label>
        <b-form-input
          v-model="forms.user.fields.passwordConfirmation"
          :state="forms.user.states.userPasswordConfirmation"
          type="password"/>
        <b-form-invalid-feedback>
          {{ forms.user.errors.userPasswordConfirmation }}
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

const userFields = {
  oldPassword: null,
  password: null,
  passwordConfirmation: null,
};

const userErrorFields = {
  userOldPassword: null,
  userPassword: null,
  userPasswordConfirmation: null,
};

import { PersonnelApi } from '../../../mixins/api';
import FooterAction from '../../components/ModalFooter/ActionBar';
import { copyValue } from '../../../helpers/extractor';
import { reset, showNotification, validate } from '../../../helpers/forms';

export default {
  components: {
    FooterAction
  },
  mixins: [ PersonnelApi ],
  data() {
    return {
      isConfirmBusy: false,
      isShown: true,
      personnelId: null,
      forms: {
        user: {
          fields: { ...userFields },
          states: { ...userErrorFields },
          errors: { ...userErrorFields },
        },
      }
    }
  },
  created() {
    this.personnelId =this.$store.state.user?.userable.id
  },
  methods: {
    onSave() {
      this.isConfirmBusy = true
      const { user, user: { fields: { oldPassword, password, passwordConfirmation } }} = this.forms

      reset(user)

      const data = { user: { oldPassword, password, passwordConfirmation }, id: this.personnelId };
      this.updatePersonnel(data, this.personnelId).then(({ data }) => {
        copyValue(data.user, user.fields)
        this.isShown = false
        this.isConfirmBusy = false
        showNotification(this, 'success', 'Password has been updated.')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(user, errors);
        this.isConfirmBusy = false
      });
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
