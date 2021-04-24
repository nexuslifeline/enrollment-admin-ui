<template>
  <div>
    <Card
      title="Billing Terms"
      titleSize="m"
      actionLabel="Add Term"
      @onAddNew="onAddTerm"
      showAction>
      <div v-if="items.length > 0" class="terms__list">
        <template v-for="(item, idx) in items">
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

const termFields = {
  name: null,
  description: null,
  schooolYearId: null
};

import Card from '../Card';
import Item from './Item';
import TermForm from './TermForm';

export default {
  components: {
    Card,
    Item,
    TermForm
  },
  props: {
    selected: {},
    schooolYearId: {
      type: Number
    }
  },
  data() {
    return {
      isShown: false,
      forms: {
        term: {

        }
      },
      items: [
        {
          id: 1,
          name: 'Monthly',
          description: 'Pays due monthly.'
        },
        {
          id: 2,
          name: 'Quarterly',
          description: 'Pays due quarterly.'
        },
        {
          id: 3,
          name: 'Semi-Annual',
          description: 'Pays due semi-annually.'
        }
      ]
    }
  },
  created() {
    alert('load list here base on School year id provided')
  },
  methods: {
    onAddTerm() {
      this.selected = {};
      this.isShown = true;
    },
    onEditTerm(item) {
      this.selected = { ...item };
      this.isShown = true;
    },
    onCreateTerm() {

    },
    onSaveTerm() {

    },
    onDeleteTerm() {

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
