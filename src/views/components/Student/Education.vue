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
        <b-button variant="primary" @click="onSave">
          Save Changes
        </b-button>
      </CardFooterRow>
    </template>
  </Card>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      forms: {
        education: {
          fields: {

          },
          errors: {},
          states: {}
        }
      }
    }
  },
  methods: {
    onSave() {

    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";
</style>
