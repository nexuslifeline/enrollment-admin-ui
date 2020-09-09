<template>
  <div>
    <b-overlay :show="isLoading">
      <b-card>
        <div
          class="group"
          v-for="group in permissionGroups"
          :key="group.id">
          <div class="group__header">{{group.name}}</div>
          <div
            class="permission"
            v-for="permission in group.permissions"
            :key="permission.id">
            <div class="permission-left">
              <div class="permission__name">{{permission.name}}</div>
              <div class="permission__description">{{permission.description}}</div>
            </div>
            <div class="permission-right">
              <Toggle
                @input="toggledPermission" />
            </div>
          </div>
        </div>
      </b-card>
    </b-overlay>
  </div>
</template>
<script>
import { PermissionGroupApi } from '../../../mixins/api'
import Toggle from '../../components/Form/Toggle'
export default {
  mixins: [ PermissionGroupApi ],
  components: {
    Toggle
  },
  data() {
    return {
      isLoading: false,
      permissionGroups: []
    }
  },
  created() {
    this.loadPermissionGroups()
  },
  methods: {
    loadPermissionGroups() {
      const params = { paginate: false }
      this.isLoading = true
      this.getPermissionGroupList(params)
      .then(({ data }) => {
        this.permissionGroups = data
        this.isLoading = false
      })
    },
    toggledPermission(isChecked) {
      // alert(isChecked)
    }
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
