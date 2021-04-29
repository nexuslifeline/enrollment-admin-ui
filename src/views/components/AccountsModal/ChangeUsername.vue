<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Change Username"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    :centered="true"
    @hidden="$router.push(previousRoute)">
    <div class="modal-field-container">
      <b-form-group>
        <label class="required">Username</label>
        <b-form-input
          v-model="forms.user.fields.username"
          :state="forms.user.states.username"/>
        <b-form-invalid-feedback>
          {{ forms.user.errors.username }}
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
import { copyValue } from '../../../helpers/extractor';
import { AuthApi, StudentApi } from '../../../mixins/api';
import { reset, validate, showNotification } from '../../../helpers/forms'

const userFields = {
  id: null,
  username: null,
};


import FooterAction from '../ModalFooter/ActionBar';

export default {
  props: {
    previousRoute: {
      type: Object
    },
  },
  components: {
    FooterAction
  },
  mixins: [ StudentApi, AuthApi ],
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
    const studentId = this.$route.params?.studentId
    if (studentId && isNaN(studentId)) {
      this.$router.push('/master-files/student')
      return
    }
    const { user } = this.forms
    this.getStudent(studentId).then(({ data }) => {
      copyValue(data.user, user.fields)
    })
  },
  methods: {
    onSave() {
      this.isConfirmBusy = true
      const { user, user: { fields: { id: userId } }} = this.forms

      reset(user)

      this.updateUsername(userId, user.fields).then(({ data }) => {
        this.isShown = false
        this.isConfirmBusy = false
        showNotification(this, 'success', 'Username has been updated.')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(user, errors);
        this.isConfirmBusy = false
      });
    }
  },
  watch: {

  }
};
</script>
<style lang="scss" scoped>

</style>
