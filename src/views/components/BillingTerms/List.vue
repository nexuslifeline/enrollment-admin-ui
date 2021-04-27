<template>
  <div>
    <Card
      title="Billing Terms"
      titleSize="m"
      actionLabel="Add Term"
      @onAddNew="onAddTerm"
      showAction>
      <div v-if="options.billingTerms.items.length > 0" class="terms__list">
        <template v-for="(item, idx) in options.billingTerms.items">
          <Item :data="item" :key="idx" @onEdit="onEditTerm" />
        </template>
      </div>
      <div v-else>
        <vText size="s" weight="light">No record(s) found.</vText>
      </div>
    </Card>
    <TermForm
      :isShown.sync="isShown"
      @onSave="onSaveTerm"
      @onCreate="onCreateTerm"
      @onDelete="onDeleteTerm"
      :data="selected"
      :form="forms.term"
      :isConfirmBusy="isConfirmBusy"
      :isDeleteBusy="isDeleteBusy"
    />
  </div>
</template>
<script>
import { TermApi } from '../../../mixins/api';
import { reset, clearFields, validate } from '../../../helpers/forms'
import { copyValue } from '../../../helpers/extractor';
import Card from '../Card';
import Item from './Item';
import TermForm from './TermForm';

const termFields = {
  id: null,
  name: null,
  description: null,
  schoolYearId: null,
  schoolCategoryId: null,
  semesterId: null
};

export default {
  components: {
    Card,
    Item,
    TermForm
  },
  props: {
    schoolYearId: {
      type: Number
    }
  },
  mixins: [ TermApi ],
  data() {
    return {
      isShown: false,
      forms: {
        term: {
          fields: { ...termFields },
          states: { ...termFields },
          errors: { ...termFields },
        }
      },
      isDeleteBusy: false,
      isConfirmBusy: false,
      selected: {},
      options: {
        billingTerms: {
          items: []
        }
      },
    }
  },
  created() {
    // alert('load list here base on School year id provided')
    const { billingTerms } = this.options
    const params = { paginate: false, schoolYearId: this.schoolYearId}
    this.getTermList(params).then(({ data }) => {
      billingTerms.items = data
    })
  },
  methods: {
    onAddTerm() {
      const { term } = this.forms
      this.selected = {}
      this.isShown = true
      reset(term)
      clearFields(term.fields)
    },
    onEditTerm(item) {
      const { term } = this.forms
      this.selected = { ...item };
      this.isShown = true;
      reset(term)
      copyValue(item, term.fields)
    },
    onCreateTerm() {
      this.isConfirmBusy = true
      const { term } = this.forms
      const { items } = this.options.billingTerms
      reset(term)
      term.fields.schoolYearId = this.schoolYearId
      this.addTerm(term.fields).then(({ data }) => {
        items.push(data)
        this.isShown = false
        this.isConfirmBusy = false
        showNotification(this, 'success', 'Term has been added.')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(term, errors);
        this.isConfirmBusy = false
      });
    },
    onSaveTerm() {
      this.isConfirmBusy = true
      const { term, term: {fields: { id: termId }} } = this.forms
      const { items } = this.options.billingTerms
      reset(term)
      this.updateTerm(term.fields, termId).then(({ data }) => {
        const index = items.findIndex(item => item.id === this.selected.id)
        items.splice(index, 1);
        items.splice(index, 0, data);
        this.isShown = false
        this.isConfirmBusy = false
        showNotification(this, 'success', 'Term has been updated.')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(term, errors);
        this.isConfirmBusy = false
      });
    },
    onDeleteTerm() {
      this.isDeleteBusy = true
      const { term: {fields: { id: termId }} } = this.forms
      const { billingTerms } = this.options
      this.deleteTerm(termId).then(({ data }) => {
        billingTerms.items = billingTerms.items.filter(v => v?.id !== termId);
        this.isShown = false
        this.isDeleteBusy = false
        showNotification(this, 'success', 'Term has been deleted.')
      }).catch((error) => {
        const errors = error.response.data.errors;
        showNotification(this, 'danger', 'Sorry, unable to delete this record.')
        this.isDeleteBusy = false
        this.isShown = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.terms__list {
  width: 100%;
  min-height: 120px;
  background-color: $white;
}

</style>
