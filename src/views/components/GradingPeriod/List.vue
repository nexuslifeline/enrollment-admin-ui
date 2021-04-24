<template>
  <div>
    <Card
      title="Grading Period"
      titleSize="m"
      actionLabel="Add Period"
      @onAddNew="onAddPeriod"
      showAction>
      <div v-if="items.length > 0" class="period__list">
        <template v-for="(item, idx) in items">
          <Item :data="item" :key="idx" @onEdit="onEditPeriod" />
        </template>
      </div>
      <div v-else>
        <vText size="s" weight="light">No record(s) found.</vText>
      </div>
    </Card>
    <PeriodForm
      :isShown.sync="isShown"
      @onSave="onSavePeriod"
      @onCreate="onCreatePeriod"
      @onDelete="onDeletePeriod"
      :data="selected"
      :form="forms.period"
      :isConfirmBusy="isConfirmBusy"
      :isDeleteBusy="isDeleteBusy"
    />
  </div>
</template>
<script>

const periodFields = {
  name: null,
  description: null,
  schooolYearId: null
};

import Card from '../Card';
import Item from './Item';
import PeriodForm from './PeriodForm';

export default {
  components: {
    Card,
    Item,
    PeriodForm
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
        period: {

        }
      },
      items: [
        {
          id: 1,
          name: 'Prelim',
          description: 'Pays due monthly.'
        },
        {
          id: 2,
          name: 'Midterm',
          description: 'Pays due quarterly.'
        },
        {
          id: 3,
          name: 'Finals',
          description: 'Pays due semi-annually.'
        }
      ]
    }
  },
  created() {
    alert('load list here base on School year id provided')
  },
  methods: {
    onAddPeriod() {
      this.selected = {};
      this.isShown = true;
    },
    onEditPeriod(item) {
      this.selected = { ...item };
      this.isShown = true;
    },
    onCreatePeriod() {

    },
    onSavePeriod() {

    },
    onDeletePeriod() {

    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.period__list {
  width: 100%;
  min-height: 120px;
  background-color: $white;
}

</style>
