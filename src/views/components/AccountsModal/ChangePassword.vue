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
        <b-form-input type="password"
          v-model="forms.user.fields.password"
          :state="forms.user.states.password"/>
        <b-form-invalid-feedback>
          {{ forms.user.errors.password }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">Confirm Password</label>
        <b-form-input type="password"
          v-model="forms.user.fields.passwordConfirmation"
          :state="forms.user.states.passwordConfirmation"/>
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
import FooterAction from '../ModalFooter/ActionBar';
import { copyValue } from '../../../helpers/extractor';
import { AuthApi, StudentApi } from '../../../mixins/api';
import { reset, validate, showNotification } from '../../../helpers/forms'

const userFields = {
  id: null,
  password: null,
  passwordConfirmation: null,
};


export default {
  props: {
    previousRoute: {
      type: Object
    },
    // user: {
    //   type: Object
    // }
  },
  mixins: [ StudentApi, AuthApi ],
  components: {
    FooterAction
  },
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
      },
      userId: null
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
      user.fields.id = data.user.id
    })
  },
  methods: {
    onSave() {
      this.isConfirmBusy = true
      const { user, user: { fields: { id: userId } }} = this.forms

      reset(user)

      this.updatePassword(userId, user.fields).then(({ data }) => {
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
