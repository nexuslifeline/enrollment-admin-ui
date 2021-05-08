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
          <label class="required"
            :state="forms.user.states.userGroupId">User Group</label>
          <v-select
            label="name"
            placeholder="User Group"
            :options="options.userGroups.items"
            v-model="forms.user.fields.userGroup"
            :class="{ 'is-invalid' : !!forms.user.errors.userGroupId }"
          />
          <b-form-invalid-feedback>
            {{ forms.user.errors.userGroupId }}
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
import { PersonnelApi, StudentApi, UserGroupApi } from '../../../mixins/api';

const userFields = {
  id: null,
  username: null,
  password: null,
  passwordConfirmation: null,
  userGroupId: null,
}
export default {
  components: {
    FooterAction
  },
  mixins: [ PersonnelApi, UserGroupApi ],
  data() {
    return {
      isConfirmBusy: false,
      isShown: true,
      personnelId: null,
      forms: {
        user: {
          fields: { ...userFields },
          states: { ...userFields },
          errors: { ...userFields }
        }
      },
      options: {
        userGroups: {
          items: []
        }
      }
    }
  },
  created() {
    this.personnelId = this.$route.params?.personnelId
    if (this.personnelId && isNaN(this.personnelId)) {
      this.$router.push('/master-files/member')
      return
    }

    this.loadUserGroupList()
  },
  methods: {
    onSave() {
      this.isConfirmBusy = true
      const { user, user: { fields: { id: userId, username, userGroup, password, passwordConfirmation } }} = this.forms

      reset(user)

      const payload = { username, userGroupId: userGroup?.id, password, passwordConfirmation }

      this.addPersonnelUser(payload, this.personnelId).then(({ data }) => {
        this.isConfirmBusy = false
        this.$emit('onAccountCreated', data)
        showNotification(this, 'success', 'User Account has been saved.')
        this.onClose()
      }).catch(error => {
        const errors = error.response.data.errors
        console.log(errors)
        validate(user, errors)
        this.isConfirmBusy = false
      })
    },
    onClose() {
      this.$router.push({
        name: 'Member Edit',
        params: { personneId: this.$route.params.personneId }
      });
    },
    loadUserGroupList() {
      this.getUserGroupList({ paginate: false }).then(({ data }) => {
        this.options.userGroups.items = data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>

</style>
