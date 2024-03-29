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
        <b-form-input
          v-model="forms.user.fields.username"
          :state="forms.user.states.username"
          debounce="500" />
          <b-form-invalid-feedback>
            {{forms.user.errors.username}}
          </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">Password</label>
        <b-form-input type="password"
          v-model="forms.user.fields.password"
          :state="forms.user.states.password"
          debounce="500" />
          <b-form-invalid-feedback>
            {{forms.user.errors.password}}
          </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">Confirm</label>
        <b-form-input type="password"
          v-model="forms.user.fields.passwordConfirmation"
          :state="forms.user.states.passwordConfirmation"
          debounce="500" />
          <b-form-invalid-feedback>
            {{forms.user.errors.passwordConfirmation}}
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
import { copyValue } from '../../../helpers/extractor';
import { validate, reset, showNotification } from '../../../helpers/forms';
import { StudentApi } from '../../../mixins/api';

const userFields = {
  id: null,
  username: null,
  password: null,
  passwordConfirmation: null
}
export default {
  components: {
    FooterAction
  },
   props: {
    previousRoute: {
      type: [Object],
    }
  },
  mixins: [ StudentApi ],
  data() {
    return {
      isConfirmBusy: false,
      isShown: true,
      studentId: null,
      forms: {
        user: {
          fields: { ...userFields },
          states: { ...userFields },
          errors: { ...userFields }
        }
      },
      defaultRoutes: {
        edit: { name: 'Student Edit', params: { ...this.$route.params } }
      }
    }
  },
  created() {
    this.studentId = this.$route.params?.studentId
    if (this.studentId && isNaN(this.studentId)) {
      this.$router.push('/master-files/student')
      return
    }
  },
  methods: {
    onSave() {
      this.isConfirmBusy = true
      const { user } = this.forms
      this.addStudentUser(user.fields, this.studentId).then(({ data }) => {
        this.isConfirmBusy = false
        this.$emit('onAccountCreated', data)
        showNotification(this, 'success', 'User Account has been saved.')
        this.onClose()
      }).catch(error => {
        const errors = error.response.data.errors
        console.log(errors)
        validate(user, errors, this)
        this.isConfirmBusy = false
      })
    },
    onClose() {
      const route = !!Object.keys(this.previousRoute || {}).length
        ? this.previousRoute
        : this.defaultRoutes.edit;
      this.$router.push(route);
    }
  },
};
</script>
<style lang="scss" scoped>

</style>
