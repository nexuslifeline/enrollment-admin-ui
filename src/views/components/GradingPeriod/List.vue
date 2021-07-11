<template>
  <div>
    <Card
      title="Grading Period"
      titleSize="m"
      actionLabel="Add Period"
      @onAddNew="onAddPeriod"
      showAction>
      <div v-if="options.periods.items.length > 0" class="period__list">
        <template v-for="(item, idx) in options.periods.items">
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


import Card from '../Card';
import Item from './Item';
import PeriodForm from './PeriodForm';
import { reset, clearFields, validate } from '../../../helpers/forms'
import { copyValue } from '../../../helpers/extractor';
import { GradingPeriodApi } from '../../../mixins/api';


const periodFields = {
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
    PeriodForm
  },
  props: {
    schoolYearId: {
      type: [Number, String]
    }
  },
  mixins: [ GradingPeriodApi ],
  data() {
    return {
      isShown: false,
      forms: {
        period: {
          fields: { ...periodFields },
          states: { ...periodFields },
          errors: { ...periodFields },
        }
      },
      isDeleteBusy: false,
      isConfirmBusy: false,
      selected: {},
      options: {
        periods: {
          items: []
        }
      },
    }
  },
  created() {
    // alert('load list here base on School year id provided')
    const { periods } = this.options
    const params = { paginate: false, schoolYearId: this.schoolYearId}
    this.getGradingPeriodList(params).then(({ data }) => {
      periods.items = data
    })
  },
  methods: {
    onAddPeriod() {
      const { period } = this.forms
      this.selected = {}
      this.isShown = true
      reset(period)
      clearFields(period.fields)
    },
    onEditPeriod(item) {
      const { period } = this.forms
      this.selected = { ...item };
      this.isShown = true;
      reset(period)
      copyValue(item, period.fields)
    },
    onCreatePeriod() {
      this.isConfirmBusy = true
      const { period } = this.forms
      const { items } = this.options.periods

      reset(period)
      period.fields.schoolYearId = this.schoolYearId
      this.addGradingPeriod(period.fields).then(({ data }) => {
        items.push(data)
        this.isShown = false
        this.isConfirmBusy = false
        showNotification(this, 'success', 'Term has been added.')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(period, errors, this);
        this.isConfirmBusy = false
      });
    },
    onSavePeriod() {
      this.isConfirmBusy = true
      const { period, period: {fields: { id: periodId }} } = this.forms
      const { items } = this.options.periods
      reset(period)
      this.updateGradingPeriod(period.fields, periodId).then(({ data }) => {
        const index = items.findIndex(item => item.id === this.selected.id)
        items.splice(index, 1);
        items.splice(index, 0, data);
        this.isShown = false
        this.isConfirmBusy = false
        showNotification(this, 'success', 'Term has been updated.')
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(period, errors, this);
        this.isConfirmBusy = false
      });
    },
    onDeletePeriod() {
      this.isDeleteBusy = true
      const { period: {fields: { id: periodId }} } = this.forms
      const { periods } = this.options
      this.deleteGradingPeriod(periodId).then(({ data }) => {
        periods.items = periods.items.filter(v => v?.id !== periodId);
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

.period__list {
  width: 100%;
  min-height: 120px;
  background-color: $white;
}

</style>
