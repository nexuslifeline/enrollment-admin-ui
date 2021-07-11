<template>
  <div>
    <b-overlay :show="isLoading">
      <b-card>
        <div
          class="group"
          v-for="group in permissionGroups"
          :key="group.id">
          <div class="group__header">{{ group.name }}</div>
          <div
            class="permission"
            v-for="permission in group.permissions"
            :key="permission.id">
            <div class="permission-left">
              <div class="permission__name">{{ permission.name }}</div>
              <div class="permission__description">{{ permission.description }}</div>
            </div>
            <div class="permission-right">
              <Toggle
                v-model="permission.isEnabled"
              />
            </div>
          </div>
        </div>
        <template v-slot:footer>
          <b-button
            class="float-right btn-close ml-2"
            @click="$router.push('/maintenance/user-group')"
            variant="outline-danger">
            Close
          </b-button>
          <b-button
            :disabled="isProcessing"
            class="float-right btn-save"
            @click="onSavePermission()"
            variant="outline-primary">
            <v-icon
              v-if="isProcessing"
              name="sync"
              spin
              class="mr-2" />
            Save
          </b-button>
        </template>
      </b-card>
    </b-overlay>
  </div>
</template>
<script>
import { showNotification } from '../../../helpers/forms'
import { PermissionGroupApi, UserGroupApi } from '../../../mixins/api'
import Toggle from '../../components/Form/Toggle'
export default {
  mixins: [ PermissionGroupApi, UserGroupApi ],
  components: {
    Toggle
  },
  data() {
    return {
      userGroupId: null,
      isLoading: false,
      isProcessing: false,
      permissionGroups: [],
      allowedPermissions: []
    }
  },
  created() {
    this.userGroupId = this.$route.params.userGroupId
    this.loadPermissionGroups()
  },
  methods: {
    onSavePermission() {
      this.isProcessing = true
      const permissions = this.permissionGroups?.map(
        (v) => v?.permissions?.filter(p => p?.isEnabled) || []
      )?.flat()?.map((v) => v?.id);

      this.storePermissionsOfUserGroup(this.userGroupId, { permissions })
      .then(() => {
        showNotification(this, 'success', 'User group permissions successfully saved.')
        this.isProcessing = false
      })
    },
    loadPermissionGroups() {
      const params = { paginate: false };
      Promise.all([
        this.getPermissionGroupList(params),
        this.getPermissionsOfUserGroup(this.userGroupId, params)
      ]).then(([{ data: groups }, { data }]) => {
        const allowed = data.map((v) => v.id);
        this.permissionGroups = groups.map((v) => {
          return {
            ...v,
            permissions: v?.permissions?.map(
              (p) => ({...p, isEnabled: allowed?.includes(p?.id) })
            )
          }
        });
      }).catch((error) => {
        console.error(error);
      });
    },
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";
  .group__header {
    font-size: 18pt;
    font-weight: bold;
    padding: 10px 0;
  }
  .permission {
    height: 100%;
    display: flex;
    border-bottom: 1px solid lightgray;
    @include for-size(phone-only) {
      flex-direction: column;
      padding: 20px 20px 0 20px;
    }
  }
  .permission-left {
    min-width: 200px;
    display: flex;
    flex-direction: column;
    padding: 10px;
  }

  .permission-right {
    flex: 1;
    padding: 15px;
    text-align: right;

    @include for-size(phone-only) {
      margin-top: 20px;
    }
  }

  .permission__name {
    font-size: 15pt;
    font-weight: 500;
  }

  .permission__description {
    font-size: 10pt;
    padding-left: 5px;
  }

  .group > div:last-child {
    border: none;
  }

</style>
