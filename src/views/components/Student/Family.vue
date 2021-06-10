<template>
  <Card title="Family" titleSize="m" :isCompleted="isCompleted" :hasFooter="true">
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label class="required">Father</label>
          <b-form-input
            v-model="forms.family.fields.fatherName"
            :state="forms.family.states.familyFatherName"
           />
          <b-form-invalid-feedback>
            {{forms.family.errors.familyFatherName}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label>Contact No.</label>
          <b-form-input
            v-model="forms.family.fields.fatherMobileNo"
           />
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Occupation</label>
          <b-form-input
            v-model="forms.family.fields.fatherOccupation"
           />
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label>Email Address</label>
          <b-form-input
            v-model="forms.family.fields.fatherEmail"
            :state="forms.family.states.familyFatherEmail"
           />
          <b-form-invalid-feedback>
            {{forms.family.errors.familyFatherEmail}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label class="required">Mother</label>
          <b-form-input
            v-model="forms.family.fields.motherName"
            :state="forms.family.states.familyMotherName"
           />
          <b-form-invalid-feedback>
            {{forms.family.errors.familyMotherName}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label>Contact No.</label>
          <b-form-input
            v-model="forms.family.fields.motherMobileNo"
          />
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Occupation</label>
          <b-form-input
            v-model="forms.family.fields.motherOccupation"
          />
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label>Email Address</label>
          <b-form-input
            v-model="forms.family.fields.motherEmail"
            :state="forms.family.states.familyMotherEmail"
          />
          <b-form-invalid-feedback>
            {{forms.family.errors.familyMotherEmail}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <h6>In case of emergency, Please contact : </h6>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label class="required">Guardian</label>
          <b-form-input
            v-model="forms.family.fields.parentGuardianName"
            :state="forms.family.states.familyParentGuardianName"
           />
          <b-form-invalid-feedback>
            {{forms.family.errors.familyParentGuardianName}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label class="required">Guardian Contact No.</label>
          <b-form-input
            v-model="forms.family.fields.parentGuardianContactNo"
            :state="forms.family.states.familyParentGuardianContactNo"
           />
          <b-form-invalid-feedback>
            {{forms.family.errors.familyParentGuardianContactNo}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <template v-slot:footer>
      <CardFooterRow>
        <b-button variant="primary" @click="onSave" :disabled="isProcessing">
          <v-icon name="spinner" spin v-if="isProcessing"/>  Save Family
        </b-button>
      </CardFooterRow>
    </template>
  </Card>
</template>
<script>

const familyFields = {
  fatherName: null,
  fatherOccupation: null,
  fatherMobileNo: null,
  fatherEmail: null,
  motherName: null,
  motherOccupation: null,
  motherMobileNo: null,
  motherEmail: null,
  parentGuardianName: null,
  parentGuardianContactNo: null
}

const familyErrorFields = {
  familyFatherName: null,
  familyFatherOccupation: null,
  familyFatherMobileNo: null,
  familyFatherEmail: null,
  familyMotherName: null,
  familyMotherOccupation: null,
  familyMotherMobileNo: null,
  familyMotherEmail: null,
  familyParentGuardianName: null,
  familyParentGuardianContactNo: null
}

import { StudentApi } from '../../../mixins/api';
import { copyValue } from '../../../helpers/extractor';
import { validate, reset, showNotification } from '../../../helpers/forms';
import debounce from 'lodash/debounce';

export default {
  props: {
    data: {
      type: [Object]
    }
  },
  mixins: [StudentApi],
  data() {
    return {
      isCompleted: false,
      forms: {
        family: {
          fields: { ...familyFields },
          errors: { ...familyErrorFields },
          states: { ...familyErrorFields }
        },
      },
      isProcessing: false,
    }
  },
  created() {
    copyValue(this.data, this.forms.family.fields);
    this.registerObservers();
  },
  methods: {
    registerObservers() {
      this.$watch('forms.family.fields', this.autoSave, { deep: true, immediate: false });
      this.$watch('forms.family.fields', this.checkCompletion, { deep: true, immediate: true });
    },
    checkCompletion() {
      const {
        fatherName,
        motherName,
        parentGuardianName,
        parentGuardianContactNo
      } = this.forms.family.fields;
      this.isCompleted = !!fatherName && !!motherName && !!parentGuardianName && !!parentGuardianContactNo;
      this.$emit('onCompletionChange', this.isCompleted);
    },
    autoSave: debounce(function() { this.onSave() }, 2000),
    onSave() {
      this.isProcessing = true
      const { family } = this.forms
      reset(family)

      const data = {
        family: {
          ...family.fields
        }
      }

      this.updateStudent(data, this.studentId).then(({ data }) => {
        this.isProcessing = false
        showNotification(this, 'success', 'Family has been saved.')
      }).catch(error => {
        const errors = error.response.data.errors
        validate(family, errors)
        console.log(errors)
        this.isProcessing = false
      })
    }
  },
  computed: {
    studentId() {
      return this.$route.params.studentId;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";
</style>
