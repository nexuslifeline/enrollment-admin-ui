<template>
  <div>
    <Card
      title="Employment"
      actionLabel="Add Employment"
      @onAddNew="onAddEmployment"
      showAction>
      <div v-if="items.length > 0" class="employment__list">
        <template v-for="(item, idx) in items">
          <Item :data="item" :key="idx" @onEdit="onEditEmployment" />
        </template>
      </div>
      <div v-else>
        <vText size="s" weight="light">No record(s) found.</vText>
      </div>
    </Card>
    <EmploymentForm
      :isShown.sync="isShown"
      @onSave="onSaveEmployment"
      @onCreate="onCreateEmployment"
      @onDelete="onDeleteEmployment"
      :data="selected"
      :form="forms.employment"
      :isConfirmBusy="isConfirmBusy"
      :isDeleteBusy="isDeleteBusy"
    />
  </div>
</template>
<script>

const employmentFields = {
  id: null,
  position: null,
  company: null,
  address: null,
  startMonth: null,
  startYear: null,
  endMonth: null,
  endYear: null,
};

import Card from '../Card';
import Item from './Item';
import EmploymentForm from './EmploymentForm';
import { PersonnelApi } from '../../../mixins/api';
import { copyValue } from '../../../helpers/extractor';
import { reset, showNotification, validate, clearFields } from '../../../helpers/forms';

export default {
  components: {
    Card,
    Item,
    EmploymentForm
  },
  mixins: [ PersonnelApi ],
  props: {
    personnelId: {
      type: [String, Number],
    }
  },
  data() {
    return {
      isShown: false,
      selected: {},
      items: [],
      isConfirmBusy: false,
      isDeleteBusy: false,
      forms: {
        employment: {
          fields: { ...employmentFields },
          states: { ...employmentFields },
          errors: { ...employmentFields },
        },
      }
    }
  },
  created() {
    reset(this.forms.employment)
    const params = { paginate: false }
    this.getPersonnelEmploymentList(params, this.personnelId).then(({ data }) => {
      this.items = data
    })
  },
  methods: {
    onSaveEmployment(id, data) {
      this.isConfirmBusy = true
      const { employment } = this.forms
      reset(employment)
      this.updatePersonnelEmployment(employment.fields, this.personnelId, id).then(({ data }) => {
        const index = this.items.findIndex(item => item.id === this.selected.id)
        this.items.splice(index, 1);
        this.items.splice(index, 0, data);
        this.isShown = false
        this.isConfirmBusy = false
        showNotification(this, 'success', 'Employment has been updated.')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(employment, errors);
        this.isConfirmBusy = false
      });
    },
    onCreateEmployment(data) {
      this.isConfirmBusy = true
      const { employment } = this.forms

      reset(employment)
      this.addPersonnelEmployment(employment.fields, this.personnelId).then(({ data }) => {
        this.items.push(data)
        this.isShown = false
        this.isConfirmBusy = false
        showNotification(this, 'success', 'Employment has been added.')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(employment, errors);
        this.isConfirmBusy = false
      });
    },
    onDeleteEmployment(id) {
      this.isDeleteBusy = true
      this.deletePersonnelEmployment(this.personnelId, id).then(({ data }) => {
        this.items = this.items.filter(v => v?.id !== id);
        this.isShown = false
        this.isDeleteBusy = false
        showNotification(this, 'success', 'Education has been deleted.')
      }).catch((error) => {
        const errors = error.response.data.errors;
        showNotification(this, 'danger', 'Sorry, unable to delete this record.')
        this.isDeleteBusy = false
        this.isShown = false;
      });
    },
    onEditEmployment(item) {
      const { employment } = this.forms
      this.selected = { ...item };
      this.isShown = true;
      reset(employment)
      copyValue(item, employment.fields)
    },
    onAddEmployment() {
      const { employment } = this.forms
      this.selected = {}
      this.isShown = true
      reset(employment)
      clearFields(employment.fields)
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.employment__list {
  width: 100%;
  min-height: 120px;
  background-color: $white;
}

</style>
