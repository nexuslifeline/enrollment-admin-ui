<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Edit Profile"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    :centered="true"
    @hidden="$router.push({ name: 'Profile' })">
    <div class="modal-field-container">
      <b-form-group>
        <label class="required">First Name</label>
        <b-form-input
          v-model="forms.personnel.fields.firstName"
          :state="forms.personnel.states.firstName"/>
        <b-form-invalid-feedback>
          {{ forms.personnel.errors.firstName }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label >Middle Name</label>
        <b-form-input
          v-model="forms.personnel.fields.middleName"
          :state="forms.personnel.states.middleName"/>
        <b-form-invalid-feedback>
          {{ forms.personnel.errors.middleName }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">Last Name</label>
        <b-form-input
          v-model="forms.personnel.fields.lastName"
          :state="forms.personnel.states.lastName"/>
        <b-form-invalid-feedback>
          {{ forms.personnel.errors.lastName }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">Date of Birth</label>
        <b-form-input type="date"
          v-model="forms.personnel.fields.birthDate"
          :state="forms.personnel.states.birthDate"/>
        <b-form-invalid-feedback>
          {{ forms.personnel.errors.birthDate }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">Address</label>
        <b-form-textarea
          v-model="forms.personnel.fields.completeAddress"
          :state="forms.personnel.states.completeAddress"/>
        <b-form-invalid-feedback>
          {{ forms.personnel.errors.completeAddress }}
        </b-form-invalid-feedback>
      </b-form-group>
      <LinkVisibilityToggler linkText="Add Contact info" hideLinkText="Hide Contact info" :hideOnContentShow="false">
        <template>
          <b-form-group>
            <label>Mobile Number</label>
            <b-form-input v-model="forms.personnel.fields.mobileNo" />
          </b-form-group>
          <b-form-group>
            <label>Phone Number</label>
            <b-form-input v-model="forms.personnel.fields.phoneNumber" />
          </b-form-group>
          <b-form-group>
            <label>Facebook:</label>
            <b-form-input v-model="forms.personnel.fields.facebookUrl" />
          </b-form-group>
          <b-form-group>
            <label>Instagram:</label>
            <b-form-input v-model="forms.personnel.fields.instagramUrl" />
          </b-form-group>
          <b-form-group>
            <label >Twitter:</label>
            <b-form-input v-model="forms.personnel.fields.twitterUrl"/>
          </b-form-group>
          <b-form-group>
            <label>Website:</label>
            <b-form-input v-model="forms.personnel.fields.websiteUrl" />
          </b-form-group>
        </template>
      </LinkVisibilityToggler>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        @onConfirm="onSave"
        @onCancel="isShown = false"
        :isConfirmBusy="isConfirmBusy"
      />
    </template>
  </b-modal>
</template>
<script>
import { AuthApi, PersonnelApi } from '../../../mixins/api';
import FooterAction from '../../components/ModalFooter/ActionBar';
import LinkVisibilityToggler from '../../components/VisibilityToggler/Link';
import { copyValue } from '../../../helpers/extractor';
import { reset, showNotification, validate } from '../../../helpers/forms';

const personnelFields = {
  id: null,
  firstName: null,
  middleName: null,
  lastName: null,
  birthDate: null,
  completeAddress: null,
  departmentId: null,
  jobTitle: null,
  mobileNo: null,
  phoneNo: null,
  emergencyMobileNo: null,
  emergencyPhoneNo: null,
  personnelStatusId: null,
  biography: null,
  facebookUrl: null,
  linkedinUrl: null,
  twitterUrl: null,
  instagramUrl: null,
  websiteUrl: null,
};


export default {
  components: {
    FooterAction,
    LinkVisibilityToggler
  },
  mixins: [ PersonnelApi, AuthApi ],
  data() {
    return {
      isConfirmBusy: false,
      isShown: true,
      profile: {
        ...this.$store.state.user?.userable
      },
      forms: {
        personnel: {
          isLoading: false,
          isProcessing: false,
          fields: { ...personnelFields },
          states: { ...personnelFields },
          errors: { ...personnelFields },
        },
      }
    }
  },
  created() {
    const { personnel } = this.forms
    copyValue(this.$store.state.user?.userable, personnel.fields)
  },
  methods: {
    onSave() {
      this.isConfirmBusy = true
      const { personnel,  personnel: { fields: { id: personnelId }} } = this.forms

      reset(personnel)
      this.updatePersonnel(personnel.fields, personnelId).then(({ data }) => {
        copyValue(data, personnel.fields)

        const user = {
          ...data.user,
          userable: {
            ...personnel.fields,
            name: data.name,
            photo: {
              ...data.photo
            }
          }
        }
        this.$store.commit('SET_USER', user);
        this.isShown = false
        this.isConfirmBusy = false
        showNotification(this, 'success', 'Profile has been updated.')

      }).catch((error) => {
        const errors = error.response.data.errors;
        validate(personnel, errors);
        this.isConfirmBusy = false
      });
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
