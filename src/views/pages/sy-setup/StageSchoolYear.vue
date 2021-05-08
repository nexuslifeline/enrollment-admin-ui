<template>
  <div>
    <Card title="School Year" titleSize="m" :hasFooter="true">
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label class="required">Name</label>
            <b-form-input type="text"
              v-model="forms.schoolYear.fields.name"
              :state="forms.schoolYear.states.name"
            />
            <b-form-invalid-feedback>
              {{ forms.schoolYear.errors.name }}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label class="required">Start Date(or Expected)</label>
            <b-form-input type="date"
              v-model="forms.schoolYear.fields.startDate"
              :state="forms.schoolYear.states.startDate"
            />
            <b-form-invalid-feedback>
              {{ forms.schoolYear.errors.startDate }}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <b-form-group>
        <label class="required">Description</label>
        <b-form-textarea
          v-model="forms.schoolYear.fields.description"
          :state="forms.schoolYear.states.description"
        />
        <b-form-invalid-feedback>
          {{ forms.schoolYear.errors.description }}
        </b-form-invalid-feedback>
      </b-form-group>
      <InputGroup>
        <InputInline>
          <Toggle v-model="forms.schoolYear.fields.isActive" />
          <span class="ml-2">Active</span>
        </InputInline>
      </InputGroup>
      <template v-slot:footer>
        <div class="card-footer__action">
          <b-button variant="primary" @click="onSaveChanges" :disabled="isSaving">
            <v-icon name="spinner" spin v-if="isSaving"/> Save Changes
          </b-button>
        </div>
      </template>
    </Card>

    <SchoolCategoryForm
      :schoolYearId="schoolYearId"
      :schoolCategoryModes="schoolCategoryModes"
    />

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

const schoolYearFields = {
  id: null,
  name: null,
  description: null,
  startDate: null,
  schoolYearStatusId: null,
  isActive: null
}

export default {
  components: {
    Card,
    InputGroup,
    InputContainer,
    ActionRow,
    SchoolCategoryForm
  },
  SchoolYearStatuses,
  mixins: [SchoolYearApi],
  props: {
    data: {
      type: Object,
    },
    schoolCategoryModes: {
      type: Array,
      default: []
    },
    schoolYearId: {
      type: [Number, String]
    },
   },
  data() {
    return {
      isProcessing: false,
      isSaving: false,
      forms: {
        schoolYear: {
          fields: { ...schoolYearFields },
          states: { ...schoolYearFields },
          errors: { ...schoolYearFields }
        }
      },
    };
  },
  created() {
    copyValue(this.data, this.forms.schoolYear.fields)
  },
  methods: {
    onContinue() {
      this.onSaveChanges();

      this.isProcessing = true
      const { schoolYearId, forms: { schoolYear } } = this
      const nextStageId = this.$options.SchoolYearStatuses.SETUP_BILLING_TERMS.id;
      reset(schoolYear);
      this.patchSchoolYear({ schoolYearStatusId: nextStageId }, schoolYearId).then(({ data }) => {
        this.$emit('update:data', data);
        this.$emit('onContinue', nextStageId - 1);
        this.isProcessing = true
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(schoolYear, errors)
        showNotification(this, 'danger', 'Error!')
        this.isProcessing = false
      });
    },
    onBack() {

    },
    onSaveChanges() {
      this.isSaving = true
      const { schoolYearId, forms: { schoolYear } } = this
      reset(schoolYear)
      this.updateSchoolYear(schoolYear.fields, schoolYearId).then(({ data }) => {
        this.isSaving = false
      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(schoolYear, errors);
        this.isSaving = false
      });
    }
  },
  computed: {
    isEnableContinue() {
      const { name, description, startDate } = this.forms.schoolYear.fields
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
