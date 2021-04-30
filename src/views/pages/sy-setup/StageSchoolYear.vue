<template>
  <div>
    <Card title="School Year" titleSize="m" :hasFooter="true">
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label class="required">Name</label>
            <b-form-input type="text"
              v-model="form.fields.name"
              :state="form.states.name"
              debounce="1000"
              @update="onSaveChanges"/>
            <b-form-invalid-feedback>
              {{ form.errors.name }}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label class="required">Start Date(or Expected)</label>
            <b-form-input type="date"
              v-model="form.fields.startDate"
              :state="form.states.startDate"
              debounce="1000"
              @update="onSaveChanges"/>
            <b-form-invalid-feedback>
              {{ form.errors.startDate }}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <b-form-group>
        <label class="required">Description</label>
        <b-form-textarea
          v-model="form.fields.description"
          :state="form.states.description"
          debounce="1000"
          @update="onSaveChanges" />
        <b-form-invalid-feedback>
          {{ form.errors.description }}
        </b-form-invalid-feedback>
      </b-form-group>
      <template v-slot:footer>
        <div class="card-footer__action">
          <b-button variant="primary" @click="onSaveChanges" :disabled="isSavingSchoolYear">
            <v-icon name="spinner" spin v-if="isSavingSchoolYear"/> Save Changes
          </b-button>
        </div>
      </template>
    </Card>

    <SchoolCategoryForm :schoolYearId="this.form.fields.id" :schoolCategoryModes="schoolCategoryModes"/>

    <ActionRow
      :showBack="false"
      nextLabel="Continue"
      @onContinue="onContinue"
      @onBack="onBack"
      :isDisabled="isEnableContinue"
      :isBusy="isProcessing"
    />
  </div>
</template>

<script>
import { copyValue } from '../../../helpers/extractor';
import { showNotification, validate, reset } from '../../../helpers/forms';
import { SchoolYearApi } from '../../../mixins/api';
import Card from '../../components/Card';
import { InputGroup, InputContainer } from '../../components/InputGroup';
import ActionRow from './ActionRow';
import SchoolCategoryForm from './SchoolCategoryForm';
import { SchoolYearStatuses } from '../../../helpers/enum';


export default {
  components: {
    Card,
    InputGroup,
    InputContainer,
    ActionRow,
    SchoolCategoryForm
  },
  SchoolYearStatuses,
  mixins: [ SchoolYearApi ],
  props: {
    form: {
      type: Object,
    },
    schoolCategoryModes: {
      type: Array,
      default: []
    }
   },
  data() {
    return {
      isProcessing: false,
      isSavingSchoolYear: false,
    };
  },
  methods: {
    onContinue() {
      // alert('this button will enable only if all school year requireds fields are provided')
      // patch school year stage here
      // alert('patch school year stage here!')
      this.isProcessing = true
      const { id: schoolYearId } = this.form.fields
      const data = { schoolYearStatusId: this.$options.SchoolYearStatuses.SETUP_BILLING_TERMS.id}
      this.patchSchoolYear(data, schoolYearId).then(({ data }) => {
        copyValue(data, this.form )
        const nextStage = 1
        this.$emit('onContinue', nextStage);
        this.isProcessing = true
      }).catch((error) => {
        const errors = error.response.data.errors;
        showNotification(this, 'danger', 'Error!')
        this.isProcessing = false
      });
    },
    onBack() {

    },
    onSaveChanges() {
      ///alert('update(PUT) school year here. Note: changes in School Year fields should be auto-save. throttle it for atleast 1 second.')
      reset(this.form)
      this.isSavingSchoolYear = true
      const { fields, fields: { id: schoolYearId } } = this.form
      const data = { ...fields }
      this.updateSchoolYear(data, schoolYearId).then(({ data }) => {
        copyValue(fields, data)
        this.isSavingSchoolYear = false
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(this.form, errors);
        this.isSavingSchoolYear = false
      });
    }
  },
  computed: {
    isEnableContinue() {
      //false => button is enabled
      //true => button is disabled
      const { name, description, startDate } = this.form.fields
      return !(name && description && startDate)
    }
  }
}
</script>
<style lang="scss">
  @import "../../../assets/scss/shared.scss";

  .setup__table-category {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    border: 1px solid $light-gray-10;
    background-color: $white;

    th {
      text-transform: uppercase;
      font-size: 13px;
      background-color: $light-gray-50;
    }

    td {
      font-size: 15px;
    }

    td, th {
      padding: 13px 20px;
      border-bottom: 1px solid $light-gray-10;

      &:last-child {
        text-align: center;
      }
    }
  }

  .card-footer__action {
    display: flex;
    justify-content: flex-end;
  }
</style>
