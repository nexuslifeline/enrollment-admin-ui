<template>
  <div class="mt-4">
    <Card
      title="Requirements"
      titleSize="m"
      actionLabel="Add Requirement"
      @onAddNew="onAddRequirement"
      showAction>
      <template v-slot:header-action>
        <div v-if="items.length > 0" class="header__action-dropdown">
          <SelectCategory @input="onSchoolCategoryChange" />
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
    />
  </div>
</template>
<script>
import Item from './Item';
import RequirementForm from './RequirementForm';

export default {
  components: {
    Item,
    RequirementForm
  },
  data() {
    return {
      isShown: false,
      selected: {},
      isConfirmBusy: false,
      isDeleteBusy: false,
      items: [
        { id: 1, documentType: { name: 'Form 138', description: 'Lorem ipsum dolor itet disan dokum mane duki dja' }, schoolCategory: { name: 'College '} },
        { id: 2, documentType: { name: 'Good Moral', description: 'Lorem ipsum dolor itet disan dokum mane duki dja' }, schoolCategory: { name: 'College '} },
      ]
    }
  },
  created() {
    // get list of requirements here
    // GET /requirements
  },
  methods: {
    onAddRequirement() {
      this.isShown = true;
      this.selected = {};
    },
    onEditRequirement(item) {
      this.isShown = true;
      this.selected = { ...item };
    },
    onSaveRequirement(item) {
      // PUT /requirements
      console.log('latest data from form => ', item)
      const payload = {
        id: item?.id,
        documentTypeId: item?.documentType?.id,
        schoolCategoryId: item?.schoolCategory?.id,
        description: item?.description
      };
    },
    onCreateRequirement(item) {
      // POST /requirements
      console.log('latest data from form => ', item);
      const payload = {
        id: item?.id,
        documentTypeId: item?.documentType?.id,
        schoolCategoryId: item?.schoolCategory?.id,
        description: item?.description
      };
    },
    onDeleteRequirement(item) {
      // DELETE /requirements
      console.log('current selected item => ', item)
    },
    onSchoolCategoryChange() {

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
