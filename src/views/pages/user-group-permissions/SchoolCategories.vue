<template>
  <div>
    <b-overlay :show="isLoading">
      <b-card class="school-category__card">
        <b-form-group>
          <label class="school-category__label">Allow access to School Categories :</label>
          <v-select
            :disabled="Number(userGroupId) === $options.UserGroups.SUPER_USER.id"
            v-model="selectedSchoolCategories"
            :reduce="item => item.id"
            multiple
            label="name"
            :options="schoolCategories.values" />
        </b-form-group>
        <template v-if="Number(userGroupId) !== $options.UserGroups.SUPER_USER.id" v-slot:footer>
          <b-button
            class="float-right btn-close ml-2"
            @click="$router.push('/maintenance/user-group')"
            variant="outline-danger">
            Close
          </b-button>
          <b-button
            :disabled="isProcessing"
            class="float-right btn-save"
            @click="onSaveSchoolCategories()"
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
import { SchoolCategories, UserGroups } from '../../../helpers/enum'
import { showNotification } from '../../../helpers/forms'
import { UserGroupApi } from '../../../mixins/api'
export default {
  mixins: [ UserGroupApi ],
  UserGroups,
  data() {
    return {
      isProcessing: false,
      isLoading: false,
      schoolCategories: SchoolCategories,
      selectedSchoolCategories: [],
      userGroupId: null
    }
  },
  created() {
    this.userGroupId = this.$route.params.userGroupId
    this.loadSchoolCategoriesOfUserGroup()
  },
  methods: {
    loadSchoolCategoriesOfUserGroup() {
      const params = { paginate: false }
      this.isLoading = true
      this.getSchoolCategoriesOfUserGroup(this.userGroupId, params)
      .then(({ data }) => {
        this.selectedSchoolCategories = data.map(category => { return category.id })
        this.isLoading = false
      })
    },
    onSaveSchoolCategories() {
      this.isProcessing = true
      this.storeSchoolCategoriesOfUserGroup(this.userGroupId, { schoolCategories: this.selectedSchoolCategories })
      .then(({ data }) => {
        this.selectedSchoolCategories = data.map(category => { return category.id })
        showNotification(this, 'success', 'User group school categories successfully saved.')
        this.isProcessing = false
      })
    },
  }
}
</script>
<style lang="scss" scoped>
  .school-category__card {
    min-height: 300px
  }
  .school-category__label {
    font-weight: bold;
  }
</style>