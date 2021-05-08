<template>
  <Card title="Personal Information" titleSize="m" :hasFooter="true">
    <InputGroup>
      <InputContainer>
          <b-form-group>
            <label class="required">First Name</label>
            <b-form-input
              v-model="forms.profile.fields.firstName"
              :state="forms.profile.states.firstName"
              debounce="500" />
            <b-form-invalid-feedback>
              {{forms.profile.errors.firstName}}
            </b-form-invalid-feedback>
          </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label>Middle Name</label>
          <b-form-input
            v-model="forms.profile.fields.middleName"
            debounce="500" />
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label class="required">Last Name</label>
          <b-form-input
            v-model="forms.profile.fields.lastName"
            :state="forms.profile.states.lastName"
            debounce="500"/>
          <b-form-invalid-feedback>
            {{forms.profile.errors.lastName}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label class="required">Date of Birth</label>
          <b-form-input type="date"
            v-model="forms.profile.fields.birthDate"
            :state="forms.profile.states.birthDate" />
          <b-form-invalid-feedback>
            {{forms.profile.errors.birthDate}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label class="required">Job Title</label>
          <b-form-input
            v-model="forms.profile.fields.jobTitle"
            :state="forms.profile.states.jobTitle" />
          <b-form-invalid-feedback>
            {{forms.profile.errors.jobTitle}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label class="required">Department</label>
          <b-form-select
            v-model="forms.profile.fields.departmentId"
            :state="forms.profile.states.departmentId" >
            <template v-slot:first>
              <b-form-select-option :value='null' disabled>--Select Department --</b-form-select-option>
            </template>
            <b-form-select-option v-for='department in options.departments.items' :key='department.id' :value='department.id'>
              {{ department.name }}
            </b-form-select-option>
          </b-form-select>
          <b-form-invalid-feedback>
            {{ forms.profile.errors.departmentId }}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label class="required">Civil Status</label>
          <b-form-select
            v-model="forms.profile.fields.civilStatusId"
            :state="forms.profile.states.civilStatusId" >
            <template v-slot:first>
              <b-form-select-option :value='null' disabled>--Select Civil Status --</b-form-select-option>
            </template>
            <b-form-select-option v-for='civilStatus in $options.CivilStatuses.values' :key='civilStatus.id' :value='civilStatus.id'>
              {{ civilStatus.name }}
            </b-form-select-option>
          </b-form-select>
          <b-form-invalid-feedback>
            {{ forms.profile.errors.civilStatusId }}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputContainer>
      <b-form-group>
        <label>Biography</label>
        <b-form-textarea
          v-model="forms.profile.fields.biography">
        </b-form-textarea>
      </b-form-group>
    </InputContainer>
    <InputContainer>
      <InputInline class="mt-3 mb-3">
        <Toggle />
        <span class="ml-2">Active</span>
      </InputInline>
    </InputContainer>
    <LinkVisibilityToggler
      linkText="Upload Personnel Photo"
      hideLinkText="Hide Personnel Photo"
      :hideOnContentShow="false">
      <template>
        <div>
          <AvatarMaker
            @onPhotoChange="onPhotoChange"
            :avatarId="data.id"
            :size="130"
            :text="avatarText"
            :src="userPhoto"
            :borderSize="3"
            enableUpload
          />
        </div>
      </template>
    </LinkVisibilityToggler>
    <template v-slot:footer>
      <CardFooterRow>
        <b-button variant="primary" @click="onSave" :disabled="isProcessing">
          <v-icon name="spinner" spin v-if="isProcessing"/> Save Profile
        </b-button>
      </CardFooterRow>
    </template>
  </Card>
</template>
<script>
import { copyValue } from '../../../helpers/extractor';
import { validate, reset, showNotification } from '../../../helpers/forms';
import { DepartmentApi, PersonnelApi } from '../../../mixins/api';
import { CivilStatuses } from '../../../helpers/enum'

const profileFields = {
  id: null,
  firstName: null,
  middleName: null,
  lastName: null,
  jobTitle: null,
  mobileNo: null,
  birthDate: null,
  civilStatusId: null,
  biography: null,
  departmentId: null,
  photo: {}
}

export default {
  CivilStatuses,
  props: {
    data: {
      type: [Object]
    }
  },
  mixins: [ PersonnelApi, DepartmentApi ],
  computed: {
    avatarText() {
      const { fields } = this.forms.profile;
      return `${fields?.firstName?.charAt(0) || '?'}${fields?.lastName?.charAt(0) || ''}`
    },
    userPhoto() {
      const { fields } = this.forms.profile;
      const path = fields?.photo?.hashName || '';
      return path ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${path}` : '';
    },
    studentId() {
       const { data } = this;
       return data?.id
    }
  },
  data() {
    return {
      forms: {
        profile: {
          fields: { ...profileFields },
          errors: { ...profileFields },
          states: { ...profileFields }
        }
      },
      isProcessing: false,
      options: {
        departments: {
          items: []
        }
      }
    }
  },
  mounted() {
    const { profile } = this.forms
    copyValue(this.data, profile.fields)

    profile.fields.civilStatusId = profile.fields.civilStatusId || this.$options.CivilStatuses.SINGLE.id
    this.loadDepartments()
  },
  methods: {
    onSave() {
      this.isProcessing = true
      const { profile, profile: { fields: { studentNo }} } = this.forms
      // reset(profile)

      // profile.fields.studentNo = profile.fields.studentNo === ""
      //   ? null
      //   : profile.fields.studentNo

      const { photo, ...restProps } = profile.fields; // excempt photo property
      const payLoad = {
        ...restProps
      }

      reset(profile)

      this.updatePersonnel(payLoad, this.studentId).then(({ data }) => {
        this.isProcessing = false
        showNotification(this, 'success', 'Profile has been saved.')
      }).catch(error => {
        const errors = error.response.data.errors
        validate(profile, errors)
        this.isProcessing = false
      })
    },
    onPhotoChange(file) {
      const formData = new FormData();
      formData.append('photo', file);
      this.savePhoto(formData, this.studentId).then(({ data }) =>{
        this.forms.profile.fields.photo = data
      }).catch(error => {
        const errors = error.response.data.errors
        console.log(errors)
      })
    },
    loadDepartments() {
      const { departments } = this.options
      const params = { paginate: false }
      this.getDepartmentList(params).then(({ data }) => {
        departments.items = data
      })
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";
</style>
