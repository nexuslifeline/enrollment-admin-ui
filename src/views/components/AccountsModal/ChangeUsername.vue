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
    <div class="modal-field-container overflow-visible">
      <b-form-group>
        <label class="required">Username</label>
        <b-form-input
          v-model="forms.user.fields.username"
          :state="forms.user.states.username"
          :disabled="!forms.user.fields.username"
        />
        <b-form-invalid-feedback>
          {{ forms.user.errors.username }}
        </b-form-invalid-feedback>
      </b-form-group>
      <template v-if="user.userableType === 'App\\Personnel'">
        <b-form-group>
          <label class="required">User Group</label>
          <v-select
            label="name"
            placeholder="User Group"
            :options="options.userGroups.items"
            v-model="forms.user.fields.userGroup"
          />
        </b-form-group>
      </template>
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
import { AuthApi, StudentApi, UserGroupApi, PersonnelApi } from '../../../mixins/api';
import { reset, validate, showNotification } from '../../../helpers/forms'

const userFields = {
  id: null,
  username: null,
  userGroup: null
};


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
  mixins: [StudentApi, AuthApi, UserGroupApi, PersonnelApi],
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
      options: {
        userGroups: {
          items: []
        }
      }
    }
  },
  created() {
    const { studentId, personnelId } = this.$route.params;
    const id = studentId || personnelId;

    const isMember = this.user?.userableType === 'App\\Personnel';

    if (isMember) {
      this.loadUserGroupList();
    }

    const { user } = this.forms;
    // if no user provide in props, fetch user from server
    if (!Object.keys(this.user).length) {
      this[isMember ? 'getPersonnel' : 'getStudent'](id).then(({ data }) => {
        copyValue(data.user, user.fields)
      });
      return;
    }

    // most of the time user is provided(except when reloaded) from selected user or with currently editing form
    copyValue(this.user, user.fields);
  },
  methods: {
    loadUserGroupList() {
      this.getUserGroupList({ paginate: false }).then(({ data }) => {
        this.options.userGroups.items = data;
      });
    },
    onSave() {
      this.isConfirmBusy = true
      const { user, user: { fields: { id: userId, username, userGroup } }} = this.forms

      reset(user)

      const payload = { username, userGroupId: userGroup?.id }
      this.updateUsername(userId, payload).then(({ data }) => {
        this.isShown = false
        this.isConfirmBusy = false
        showNotification(this, 'success', 'Username has been updated.')
        this.$emit('onUserUpdated', data)
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
