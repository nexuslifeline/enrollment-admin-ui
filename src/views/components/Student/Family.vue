<template>
  <Card title="Family" titleSize="m" :hasFooter="true">
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label class="required">Father</label>
          <b-form-input
            v-model="forms.family.fields.fatherName"
            :state="forms.family.states.familyFatherName"
            debounce="500"/>
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
            debounce="500"/>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Occupation</label>
          <b-form-input
            v-model="forms.family.fields.fatherOccupation"
            debounce="500"/>
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label>Email Address</label>
          <b-form-input
            v-model="forms.family.fields.fatherEmail"
            :state="forms.family.states.familyFatherEmail"
            debounce="500" />
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
            debounce="500"/>
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
            debounce="500"/>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Occupation</label>
          <b-form-input
            v-model="forms.family.fields.motherOccupation"
            debounce="500"/>
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label>Email Address</label>
          <b-form-input
            v-model="forms.family.fields.motherEmail"
            :state="forms.family.states.familyMotherEmail"
            debounce="500"/>
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
          <label class="required">Parent/Guardian</label>
          <b-form-input
            v-model="forms.family.fields.parentGuardianName"
            :state="forms.family.states.familyParentGuardianName"
            debounce="500"/>
          <b-form-invalid-feedback>
            {{forms.family.errors.familyParentGuardianName}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label class="required">Parent/Guardian Contact No.</label>
          <b-form-input
            v-model="forms.family.fields.parentGuardianContactNo"
            :state="forms.family.states.familyParentGuardianContactNo"
            debounce="500"/>
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

export default {
  props: {
    data: {
      type: [Object]
    }
  },
  mixins: [ StudentApi ],
  data() {
    return {
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
    copyValue(this.data, this.forms.family.fields)
  },
  methods: {
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
