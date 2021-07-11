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
          :state="forms.user.states.oldPassword"
          type="password"/>
        <b-form-invalid-feedback>
          {{ forms.user.errors.oldPassword }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">New Password</label>
        <b-form-input
          v-model="forms.user.fields.password"
          :state="forms.user.states.password"
          type="password"/>
        <b-form-invalid-feedback>
          {{ forms.user.errors.password }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group description="To ensure that you type your password correctly, you need to repeat your password here.">
        <label class="required">Confirm Password</label>
        <b-form-input
          v-model="forms.user.fields.passwordConfirmation"
          :state="forms.user.states.passwordConfirmation"
          type="password"/>
        <b-form-invalid-feedback>
          {{ forms.user.errors.passwordConfirmation }}
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
  id: null,
  oldPassword: null,
  password: null,
  passwordConfirmation: null,
};

const userErrorFields = {
  userOldPassword: null,
  userPassword: null,
  userPasswordConfirmation: null,
};

import { AuthApi, PersonnelApi } from '../../../mixins/api';
import FooterAction from '../../components/ModalFooter/ActionBar';
import { copyValue } from '../../../helpers/extractor';
import { reset, showNotification, validate } from '../../../helpers/forms';

export default {
  components: {
    FooterAction
  },
  mixins: [ PersonnelApi, AuthApi ],
  data() {
    return {
      isConfirmBusy: false,
      isShown: true,
      forms: {
        user: {
          fields: { ...userFields },
          states: { ...userFields },
          errors: { ...userFields },
        },
      }
    }
  },
  created() {
    const { user } = this.forms
    copyValue(this.$store.state.user, user.fields)
  },
  methods: {
    onSave() {
      this.isConfirmBusy = true
      const { user, user: { fields: { id: userId }} } = this.forms

      reset(user)

      this.updatePassword(userId, user.fields).then(({ data }) => {
        this.$store.commit('SET_USER', data);
        this.isShown = false
        this.isConfirmBusy = false
        showNotification(this, 'success', 'Password has been updated.')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(user, errors, this);
        this.isConfirmBusy = false
      });
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
