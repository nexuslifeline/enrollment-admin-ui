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
    <div class="modal-field-container">
      <b-form-group description="To ensure that we will properly linked your account, it is necessary to use your email address as your username.">
        <label class="required">Username</label>
        <b-form-input
          v-model="forms.user.fields.username"
          :state="forms.user.states.userUsername"/>
        <b-form-invalid-feedback>
          {{ forms.user.errors.userUsername }}
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
const userFields = {
  id: null,
  username: null,
};

const userErrorFields = {
  userUsername: null,
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
    const { user } = this.forms
    copyValue(this.$store.state.user, user.fields)
    this.personnelId =this.$store.state.user?.userable.id
  },
  methods: {
    onSave() {
      this.isConfirmBusy = true
      const { user, user: { fields: { id: userId } }} = this.forms

      reset(user)

      this.updateUsername(userId, user.fields).then(({ data }) => {
        this.$store.commit('SET_USER', data);
        this.isShown = false
        this.isConfirmBusy = false
        showNotification(this, 'success', 'Username has been updated.')
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
