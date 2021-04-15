<template>
  <div>
    <Card
      title="Education"
      actionLabel="Add Education"
      @onAddNew="onAddEduation"
      showAction>
      <div v-if="items.length > 0" class="education__list">
        <template v-for="(item, idx) in items">
          <Item :data="item" :key="idx" @onEdit="onEditEducation" />
        </template>
      </div>
      <div v-else>
        <vText size="s" weight="light">No record(s) found.</vText>
      </div>
    </Card>
    <EducationForm
      :isShown.sync="isShown"
      @onSave="onSaveEducation"
      @onCreate="onCreateEducation"
      @onDelete="onDeleteEducation"
      :data="selected"
      :form="forms.education"
      :isConfirmBusy="isConfirmBusy"
      :isDeleteBusy="isDeleteBusy"
    />
  </div>
</template>
<script>

const educationFields = {
  id: null,
  school: null,
  degree: null,
  address: null,
  field: null,
  startYear:null,
  endYear: null,
  societies: null
};

import Card from '../Card';
import Item from './Item';
import EducationForm from './EducationForm';
import { PersonnelApi } from '../../../mixins/api';
import { copyValue } from '../../../helpers/extractor';
import { reset, showNotification, validate, clearFields } from '../../../helpers/forms';

export default {
  components: {
    Card,
    Item,
    EducationForm
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
        education: {
          fields: { ...educationFields },
          states: { ...educationFields },
          errors: { ...educationFields },
        },
      }
    }
  },
  created() {
    reset(this.forms.education)
    const params = { paginate: false }
    this.getPersonnelEducationList(params, this.personnelId).then(({ data }) => {
      this.items = data
    })
  },
  methods: {
    onSaveEducation(id, data) {
      this.isConfirmBusy = true
      const { education } = this.forms
      reset(education)
      this.updatePersonnelEducation(education.fields, this.personnelId, id).then(({ data }) => {
        const index = this.items.findIndex(item => item.id === this.selected.id)
        this.items.splice(index, 1);
        this.items.splice(index, 0, data);
        this.isShown = false
        this.isConfirmBusy = false
        showNotification(this, 'success', 'Education has been updated.')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(education, errors);
        this.isConfirmBusy = false
      });
    },
    onCreateEducation(data) {
      this.isConfirmBusy = true
      const { education } = this.forms

      reset(education)
      this.addPersonnelEducation(education.fields, this.personnelId).then(({ data }) => {
        this.items.push(data)
        this.isShown = false
        this.isConfirmBusy = false
        showNotification(this, 'success', 'Education has been added.')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(education, errors);
        this.isConfirmBusy = false
      });
    },
    onDeleteEducation(id) {
      this.isDeleteBusy = true
      this.deletePersonnelEducation(this.personnelId, id).then(({ data }) => {
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
    onEditEducation(item) {
      const { education } = this.forms
      this.selected = { ...item };
      this.isShown = true;
      copyValue(item, education.fields)
    },
    onAddEduation() {
      const { education } = this.forms
      this.selected = {}
      this.isShown = true
      clearFields(education.fields)
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.education__list {
  width: 100%;
  min-height: 120px;
  background-color: $white;
}

</style>
