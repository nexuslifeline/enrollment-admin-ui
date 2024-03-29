<template>
  <Card title="Personal Information"
    titleSize="m"
    :hasFooter="true"
    :isCompleted="isCompleted">
    <InputGroup>
      <InputContainer>
         <b-form-group v-if="!!forms.profile.fields.studentNo">
          <label >Student No.</label>
          <b-form-input
            v-model="forms.profile.fields.studentNo"
            placeholder="Awaiting Confirmation"
            readonly
           />
        </b-form-group>
      </InputContainer>
      <InputContainer>

      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
          <b-form-group>
            <label class="required">First Name</label>
            <b-form-input
              v-model="forms.profile.fields.firstName"
              :state="forms.profile.states.firstName"
              :disabled="isReadOnly"
            />
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
            :disabled="isReadOnly"
           />
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
            :disabled="isReadOnly"
           />
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
            :state="forms.profile.states.birthDate"
            :disabled="isReadOnly"
          />
          <b-form-invalid-feedback>
            {{forms.profile.errors.birthDate}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Mobile No.</label>
          <masked-input
            type="text"
            class="form-control"
            v-model="forms.profile.fields.mobileNo"
            :mask="['(', '+', '6', '3', ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]"
            :guide="false"
            :showMask="false"
            :disabled="isReadOnly"
            placeholderChar="_">
          </masked-input>
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label class="required">Civil Status</label>
          <b-form-select
            :disabled="isReadOnly"
            v-model="forms.profile.fields.civilStatusId"
            :state="forms.profile.states.civilStatusId">
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
    <LinkVisibilityToggler
      linkText="Upload Student Photo"
      hideLinkText="Hide Student Photo"
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
            :enableUpload="!isReadOnly"
          />
        </div>
      </template>
    </LinkVisibilityToggler>
    <template v-slot:footer>
      <CardFooterRow>
        <b-button v-if="!isReadOnly" variant="primary" @click="onSave" :disabled="isProcessing">
          <v-icon name="spinner" spin v-if="isProcessing"/> Save Profile
        </b-button>
      </CardFooterRow>
    </template>
  </Card>
</template>
<script>
import { copyValue } from '../../../helpers/extractor';
import { validate, reset, showNotification } from '../../../helpers/forms';
import { StudentApi } from '../../../mixins/api';
import AvatarMaker from '../AvatarMaker';
import { CivilStatuses } from '../../../helpers/enum';
import debounce from 'lodash/debounce';

const profileFields = {
  id: null,
  // studentNo: null,
  firstName: null,
  middleName: null,
  lastName: null,
  mobileNo: null,
  birthDate: null,
  civilStatusId: null,
  // email: null,
  // isManual: 1,
  photo: {}
}

export default {
  CivilStatuses,
  props: {
    data: {
      type: [Object]
    },
    isReadOnly: {
      type: [Boolean],
      default: false
    },
    isAutoSave: {
      type: [Boolean],
      default: true
    }
  },
  components: {
    AvatarMaker
  },
  mixins: [ StudentApi ],
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
      return this.$route?.params?.studentId || this?.data?.id;
    }
  },
  data() {
    return {
      isCompleted: false,
      forms: {
        profile: {
          fields: { ...profileFields },
          errors: { ...profileFields },
          states: { ...profileFields }
        }
      },
      isProcessing: false,
    }
  },
  created() {
    const { profile } = this.forms
    copyValue(this.data, profile.fields);
    if (this.isAutoSave) {
      this.registerObservers();
    }
  },
  methods: {
    registerObservers() {
      this.$watch('forms.profile.fields', this.autoSave, { deep: true, immediate: false });
      this.$watch('forms.profile.fields', this.checkCompletion, { deep: true, immediate: true });
    },
    checkCompletion() {
      const { firstName, lastName, civilStatusId, birthDate } = this.forms.profile.fields;
      this.isCompleted = !!firstName && !!lastName && !!civilStatusId && !!birthDate;
      this.$emit('onCompletionChange', this.isCompleted);
    },
    autoSave: debounce(function() { if(this.isCompleted) this.onSave() }, 2000),
    onSave() {
      this.isProcessing = true
      const { profile } = this.forms

      // profile.fields.studentNo = profile.fields.studentNo === ""
      //   ? null
      //   : profile.fields.studentNo

      const { photo, ...restProps } = profile.fields; // excempt photo property
      const payLoad = {
        ...restProps
      }

      reset(profile)

      this.updateStudent(payLoad, this.studentId).then(({ data }) => {
        this.isProcessing = false
        showNotification(this, 'success', 'Profile has been saved.')
      }).catch(error => {
        const errors = error.response.data.errors
        validate(profile, errors, this)
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
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";
</style>
