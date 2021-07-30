<template>
  <Card
    :title="title"
    titleSize="m"
    :hasFooter="true">
    <!-- <CardNote v-if="showNotes">
      <template v-if="!!notes">
        {{ notes }}
      </template>
      <template v-else>
        It is recommended to complete the <b>Academic Record</b> section first before
        adding Subject to be able to find the right subjects for the Student.
      </template>
    </CardNote> -->
    <InputGroup>
      <InputContainer>
        <b-form-group
          label="Last School Attended"
          labelClass="required"
          :state="forms.evaluation.states.lastSchoolAttended"
          :invalid-feedback="forms.evaluation.errors.lastSchoolAttended">
          <b-form-input
            v-model="data.lastSchoolAttended"
          />
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group
          label="Last School Level"
          labelClass="required"
          :state="forms.evaluation.states.lastSchoolLevelId"
          :invalid-feedback="forms.evaluation.errors.lastSchoolLevelId">
          <SelectLevel
            :value="data.lastSchoolLevel"
            label="name"
            @input="onLevelChanged"
            :disabled="isReadOnly"
          />
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group
          label="Last School Year From"
          labelClass="required"
          :state="forms.evaluation.states.lastSchoolYearFrom"
          :invalid-feedback="forms.evaluation.errors.lastSchoolYearFrom">
          <b-form-input
            v-model="data.lastSchoolYearFrom"
          />
        </b-form-group>
      </InputContainer>
       <InputContainer>
        <b-form-group
          label="Last School Year To"
          labelClass="required"
          :state="forms.evaluation.states.lastSchoolYearTo"
          :invalid-feedback="forms.evaluation.errors.lastSchoolYearTo">
          <b-form-input
            v-model="data.lastSchoolYearTo"
          />
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group
          label="Notes"
          :state="forms.evaluation.states.notes"
          :invalid-feedback="forms.evaluation.errors.notes">
          <b-form-textarea
            rows="4"
            v-model="data.notes" />
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <template v-slot:footer>
      <CardFooterRow>
        <b-button v-if="!isReadOnly" variant="primary" @click="onSave" :disabled="isProcessing">
          <v-icon v-if="isProcessing" name="spinner" spin /> Save Changes
        </b-button>
      </CardFooterRow>
    </template>
  </Card>
</template>

<script>

import { reset, showNotification, validate } from '../../../helpers/forms'
import { SchoolCategories } from '../../../helpers/enum'
import { EvaluationApi } from '../../../mixins/api'
import debounce from 'lodash/debounce';
import SelectLevel from '../Dropdowns/SelectLevel'

const evaluationFields = {
  lastSchoolAttended: null,
  lastSchoolYearFrom: null,
  lastSchoolYearTo: null,
  lastSchoolLevelId: null,
  notes: null
}

  export default {
    SchoolCategories,
    props: {
      data: {
        type: [Object]
      },
      showNotes: {
        type: Boolean,
        default: false
      },
      allowChangeStatus: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: 'Evaluation'
      },
      notes: {
        type: String
      },
      isReadOnly: {
        type: Boolean,
        default: false
      },
    },
    mixins: [ EvaluationApi ],
    components: {
      SelectLevel
    },
    data() {
      return {
        isProcessing: false,
        forms: {
          evaluation: {
            states: { ...evaluationFields },
            errors: { ...evaluationFields }
          }
        }
      }
    },
    created() {
      this.$watch('data', this.autoSave, { deep: true, immediate: false });
    },
    methods: {
      autoSave: debounce(function() { this.onSave() }, 4000),
      onSave() {
        const { evaluation } = this.forms
        const {
          lastSchoolLevelId,
          lastSchoolAttended,
          lastSchoolYearFrom,
          lastSchoolYearTo,
          notes,
          id: evaluationId
        } = this.data

        const evaluationData = {
          lastSchoolLevelId,
          lastSchoolAttended,
          lastSchoolYearFrom,
          lastSchoolYearTo,
          notes
        }
        reset(evaluation)
        this.isProcessing = true
        this.updateEvaluation(evaluationData, evaluationId).then(({ data }) => {
          showNotification(this, 'success', 'Evaluation Record Saved!.')
          this.isProcessing = false
        }).catch((error) => {
          const errors = error.response.data.errors;
          console.log(error)
          this.isProcessing = false;
          validate(evaluation, errors, this);
        });

      },
      onLevelChanged(level) {
        this.data.lastSchoolLevelId = level?.id || null
        this.data.lastSchoolLevel = level
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
</style>