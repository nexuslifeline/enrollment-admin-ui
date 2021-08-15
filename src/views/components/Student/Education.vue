<template>
  <Card title="Education" titleSize="m" :hasFooter="true">
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Last School Attended</label>
          <b-form-input
            v-model="forms.education.fields.lastSchoolAttended"
            debounce="500"/>
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label>Level</label>
          <b-form-input
            v-model="forms.education.fields.lastLevel"
            debounce="500"/>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>From</label>
          <b-form-input
            v-model="forms.education.fields.lastSchoolYearFrom"
            debounce="500"/>
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label>To</label>
          <b-form-input
            v-model="forms.education.fields.lastSchoolYearTo"
            debounce="500"/>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Last School Address</label>
          <b-form-textarea
            v-model="forms.education.fields.lastSchoolAddress"
            debounce="500" />
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <LinkVisibilityToggler
      linkText="Add Primary School"
      hideLinkText="Hide Primary School"
      :hideOnContentShow="false">
      <template>
        <hr />
        <InputGroup>
          <InputContainer>
            <b-form-group>
              <label>Primary</label>
              <b-form-input
                  v-model="forms.education.fields.elementaryCourse"
                  debounce="500"/>
            </b-form-group>
          </InputContainer>
        </InputGroup>
        <InputGroup>
          <InputContainer>
            <b-form-group>
              <label>From</label>
              <b-form-input
                  v-model="forms.education.fields.elementaryCourseYearFrom"
                  debounce="500" />
            </b-form-group>
          </InputContainer>
          <InputContainer>
            <b-form-group>
              <label>To</label>
              <b-form-input
                  v-model="forms.education.fields.elementaryCourseYearTo"
                  debounce="500" />
            </b-form-group>
          </InputContainer>
        </InputGroup>
        <InputContainer>
          <b-form-group>
            <label>Honor Received</label>
            <b-form-input
                v-model="forms.education.fields.elementaryCourseHonors"
                debounce="500"/>
          </b-form-group>
        </InputContainer>
      </template>
    </LinkVisibilityToggler>
    <LinkVisibilityToggler
      linkText="Add Secondary School"
      hideLinkText="Hide Secondary School"
      :hideOnContentShow="false">
      <template>
        <hr />
        <InputGroup>
          <InputContainer>
            <b-form-group>
              <label>Secondary</label>
              <b-form-input
                  v-model="forms.education.fields.highSchoolCourse"
                  debounce="500"/>
            </b-form-group>
          </InputContainer>
        </InputGroup>
        <InputGroup>
          <InputContainer>
            <b-form-group>
              <label>From</label>
              <b-form-input
                  v-model="forms.education.fields.highSchoolCourseYearFrom"
                  debounce="500"/>
            </b-form-group>
          </InputContainer>
          <InputContainer>
            <b-form-group>
              <label>To</label>
              <b-form-input
                  v-model="forms.education.fields.highSchoolCourseYearTo"
                  debounce="500"/>
            </b-form-group>
          </InputContainer>
        </InputGroup>
        <InputContainer>
          <b-form-group>
            <label>Honor Received</label>
            <b-form-input
                v-model="forms.education.fields.highSchoolCourseHonors"
                debounce="500"/>
          </b-form-group>
        </InputContainer>
      </template>
    </LinkVisibilityToggler>

    <template v-slot:footer>
      <CardFooterRow>
        <b-button variant="primary" @click="onSave" :disabled="isProcessing">
          <v-icon name="spinner" spin v-if="isProcessing"/>  Save Education
        </b-button>
      </CardFooterRow>
    </template>
  </Card>
</template>
<script>

const educationFields = {
  lastSchoolAttended: null,
  lastSchoolAddress: null,
  lastSchoolYearFrom: null,
  lastSchoolYearTo: null,
  lastLevel: null,
  elementaryCourse: null,
  elementaryCourseYearFrom: null,
  elementaryCourseYearTo: null,
  elementaryCourseHonors: null,
  highSchoolCourse: null,
  highSchoolCourseYearFrom: null,
  highSchoolCourseYearTo: null,
  highSchoolCourseHonors: null,
  seniorSchoolCourse: null,
  seniorSchoolCourseYearFrom: null,
  seniorSchoolCourseYearTo: null,
  seniorSchoolCourseHonors: null,
  collegeDegree: null,
  collegeDegreeYearFrom: null,
  collegeDegreeYearTo: null,
  collegeDegreeHonors: null,
}

import { StudentApi } from '../../../mixins/api';
import { copyValue } from '../../../helpers/extractor';
import { validate, reset, showNotification } from '../../../helpers/forms';

export default {
  props: {
    data: {
      type: [Object]
    },
    isAutoSave: {
      type: [Boolean],
      default: true
    }
  },
  mixins: [ StudentApi ],
  data() {
    return {
      forms: {
        education: {
          fields: { ...educationFields },
          errors: { ...educationFields },
          states: { ...educationFields }
        },
      },
      isProcessing: false,
    }
  },
  created() {
    copyValue(this.data, this.forms.education.fields);
  },
  methods: {
    onSave() {
      this.isProcessing = true
      const { education } = this.forms
      reset(education)

      const data = {
        id: this.studentId,
        education: {
          ...education.fields
        }
      }

      this.updateStudent(data, this.studentId).then(({ data }) => {
        this.isProcessing = false
        showNotification(this, 'success', 'Education has been saved.')
      }).catch(error => {
        const errors = error.response.data.errors
        validate(education, errors, this)
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
