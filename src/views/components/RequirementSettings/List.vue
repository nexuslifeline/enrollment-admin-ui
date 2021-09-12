<template>
  <div class="mt-4">
    <Card
      title="Requirements"
      titleSize="m"
      actionLabel="Add Requirement"
      @onAddNew="onAddRequirement"
      showAction
      :isLoading="isLoading">
      <template v-slot:header-action>
        <!-- v-if="items.length > 0" -->
        <div  class="header__action-dropdown">
          <SelectCategory
            label="name"
            :value="filters.schoolCategory"
            placeholder="School Category"
            @input="onSchoolCategoryChanged"
            appendToBody />
        </div>
      </template>
      <div v-if="items.length > 0" class="Requirement__list">
        <template v-for="(item, idx) in items">
          <Item :data="item" :key="idx" @onEdit="onEditRequirement" />
        </template>
      </div>
      <div v-else>
        <vText size="s" weight="light">No record(s) found.</vText>
      </div>
    </Card>
    <RequirementForm
      :isShown.sync="isShown"
      @onSave="onSaveRequirement"
      @onCreate="onCreateRequirement"
      @onDelete="onDeleteRequirement"
      :data="selected"
      :isConfirmBusy="isConfirmBusy"
      :isDeleteBusy="isDeleteBusy"
      :states="forms.requirement.states"
      :errors="forms.requirement.errors"
    />
  </div>
</template>
<script>

const requirementErrorFields = {
  schoolCategoryId: null,
  description: null,
  documentTypeId: null
}

import { reset, showNotification, validate } from '../../../helpers/forms';
import { RequirementApi } from '../../../mixins/api';
import Item from './Item';
import RequirementForm from './RequirementForm';

export default {
  components: {
    Item,
    RequirementForm
  },
  mixins: [ RequirementApi ],
  data() {
    return {
      isShown: false,
      selected: {},
      isConfirmBusy: false,
      isDeleteBusy: false,
      isLoading: true,
      forms: {
        requirement: {
          states: { ...requirementErrorFields },
          errors: { ...requirementErrorFields },
        }
      },
      filters: {
        schoolCategory: null,
        schoolCategoryId: null
      },
      items: []
    }
  },
  created() {
    // get list of requirements here
    // GET /requirements
    this.loadRequirements()
  },
  methods: {
    loadRequirements() {
      const { schoolCategoryId } = this.filters
      const params = { paginate: false, schoolCategoryId }
      this.isLoading = true
      this.getRequirementList(params).then(({ data }) => {
        this.items = data
        this.isLoading = false
      })
    },
    onAddRequirement() {
      const { requirement } = this.forms
      reset(requirement)
      this.isShown = true;
      this.selected = {};
    },
    onEditRequirement(item) {
      const { requirement } = this.forms
      reset(requirement)
      this.isShown = true;
      this.selected = { ...item };
    },
    onSaveRequirement(id, item) {
      // PUT /requirements
      const { requirement } = this.forms
      console.log('latest data from form => ', item)
      const payload = {
        id: item?.id,
        documentTypeId: item?.documentType?.id,
        schoolCategoryId: item?.schoolCategory?.id,
        description: item?.description
      };
      this.isConfirmBusy = true;
      reset(requirement)
      this.updateRequirement(payload, id).then(({ data }) => {
        const selectedIndex = this.items.findIndex(i => i.id === id )
        this.items.splice(selectedIndex, 1, data)
        showNotification(this, 'success', 'Requirement has been saved.')
        this.isConfirmBusy = false;
        this.isShown = false;
      }).catch((error) => {
        const errors = error.response.data.errors;
        this.isConfirmBusy = false;
        validate(requirement, errors, this);
      });
    },
    onCreateRequirement(item) {
      // POST /requirements
      console.log('latest data from form => ', item);
      const { requirement } = this.forms
      const payload = {
        id: item?.id,
        documentTypeId: item?.documentType?.id,
        schoolCategoryId: item?.schoolCategory?.id,
        description: item?.description
      };
      this.isConfirmBusy = true;
      reset(requirement)

      this.addRequirement(payload).then(({ data }) => {
        this.items.push(data)
        showNotification(this, 'success', 'Requirement has been saved.')
        this.isConfirmBusy = false;
        this.isShown = false;
      }).catch((error) => {
        const errors = error.response.data.errors;
        this.isConfirmBusy = false;
        validate(requirement, errors, this);
      });
    },
    onDeleteRequirement(id) {
      // DELETE /requirements
      // console.log('current selected item => ', item)
      this.isDeleteBusy = true;
      this.deleteRequirement(id).then(({ data }) => {
        const selectedIndex = this.items.findIndex(i => i.id === id )
        this.items.splice(selectedIndex, 1)
        showNotification(this, 'success', 'Requirement has been deleted.')
        this.isDeleteBusy = false;
        this.isShown = false;
      }).catch((error) => {
        const errors = error.response.data.errors;
        this.isDeleteBusy = false;
      });
    },
    onSchoolCategoryChanged(schoolCategory) {
      this.filters.schoolCategory = schoolCategory
      this.filters.schoolCategoryId = schoolCategory?.id || null
      this.loadRequirements()
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.Requirement__list {
  width: 100%;
  min-height: 120px;
  background-color: $white;
}

.header__action-dropdown {
  min-width: 40%;
  margin-right: 10px;
}

</style>
