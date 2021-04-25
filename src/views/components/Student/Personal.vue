<template>
  <Card title="Personal Information" titleSize="m" :hasFooter="true">
    <InputGroup>
      <InputContainer>
         <b-form-group v-if="!!forms.profile.fields.studentNo">
          <label >Student No.</label>
          <b-form-input
            v-model="forms.profile.fields.studentNo"
            placeholder="Awaiting Confirmation"
            readonly
            debounce="500"/>
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
          <label>Mobile No.</label>
          <masked-input
            type="text"
            class="form-control"
            v-model="forms.profile.fields.mobileNo"
            :mask="['(', '+', '6', '3', ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]"
            :guide="false"
            :showMask="false"
            placeholderChar="_">
          </masked-input>
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
            <b-form-select-option v-for='civilStatus in []' :key='civilStatus.id' :value='civilStatus.id'>
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
            enableUpload
          />
        </div>
      </template>
    </LinkVisibilityToggler>
    <template v-slot:footer>
      <CardFooterRow>
        <b-button variant="primary" @click="onSave">
          Save Profile
        </b-button>
      </CardFooterRow>
    </template>
  </Card>
</template>
<script>
import AvatarMaker from '../AvatarMaker';
export default {
  props: {
    data: {
      type: [Object]
    }
  },
  components: {
    AvatarMaker
  },
  computed: {
    avatarText() {
      const { userable } = this.data;
      return `${userable?.firstName?.charAt(0) || '?'}${userable?.lastName?.charAt(0) || ''}`
    },
    userPhoto() {
      const { userable } = this.data;
      const path = userable?.photo?.hashName || '';
      return path ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${path}` : '';
    },
  },
  data() {
    return {
      forms: {
        profile: {
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

    },
    onPhotoChange(file) {

    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";
</style>
