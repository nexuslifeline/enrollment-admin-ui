<template>
  <Card title="Contact" titleSize="m" :hasFooter="true">
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Complete Address</label>
          <b-form-textarea
            rows="4"
            v-model="forms.personnel.fields.completeAddress"
            :state="forms.personnel.states.completeAddress"
            debounce="500"/>
          <b-form-invalid-feedback>
            {{forms.personnel.errors.completeAddress}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Mobile No</label>
          <b-form-input
            v-model="forms.personnel.fields.mobileNo"
            debounce="500"/>
          <b-form-invalid-feedback>
            {{forms.personnel.errors.mobileNo}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label>Phone No.</label>
          <b-form-input
            v-model="forms.personnel.fields.phoneNo"
            debounce="500"/>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Emergency Mobile No</label>
          <b-form-input
            v-model="forms.personnel.fields.emergencyMobileNo"
            debounce="500"/>
          <b-form-invalid-feedback>
            {{forms.personnel.errors.emergencyMobileNo}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label>Emergency Phone No.</label>
          <b-form-input
            v-model="forms.personnel.fields.emergencyPhoneNo"
            debounce="500"/>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Facebook URL</label>
          <b-form-input
            v-model="forms.personnel.fields.facebookUrl"
            debounce="500"/>
          <b-form-invalid-feedback>
            {{forms.personnel.errors.facebookUrl}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>LinkedIn URL</label>
          <b-form-input
            v-model="forms.personnel.fields.linkedinUrl"
            debounce="500"/>
          <b-form-invalid-feedback>
            {{forms.personnel.errors.linkedinUrl}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
       <InputContainer>
        <b-form-group>
          <label>Twitter URL</label>
          <b-form-input
            v-model="forms.personnel.fields.twitterUrl"
            debounce="500"/>
          <b-form-invalid-feedback>
            {{forms.personnel.errors.linkedinUrl}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Instagram URL</label>
          <b-form-input
            v-model="forms.personnel.fields.instagramUrl"
            debounce="500"/>
          <b-form-invalid-feedback>
            {{forms.personnel.errors.instagramUrl}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Website URL</label>
          <b-form-input
            v-model="forms.personnel.fields.websiteUrl"
            debounce="500"/>
          <b-form-invalid-feedback>
            {{forms.personnel.errors.websiteUrl}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <template v-slot:footer>
      <CardFooterRow>
        <b-button variant="primary" @click="onSave" :disabled="isProcessing">
          <v-icon name="spinner" spin v-if="isProcessing"/>  Save Contact
        </b-button>
      </CardFooterRow>
    </template>
  </Card>
</template>
<script>

const personnelFields = {
  id: null,
  completeAddress: null,
  mobileNo: null,
  phoneNo: null,
  emergencyMobileNo: null,
  emergencyPhoneNo: null,
  facebookUrl: null,
  linkedinUrl: null,
  twitterUrl: null,
  instagramUrl: null,
  websiteUrl: null,
};
import { PersonnelApi  } from '../../../mixins/api';
import { copyValue } from '../../../helpers/extractor';
import { validate, reset, showNotification } from '../../../helpers/forms';

export default {
  props: {
    data: {
      type: [Object]
    }
  },
  mixins: [ PersonnelApi ],
  data() {
    return {
      forms: {
        personnel: {
          fields: { ...personnelFields },
          errors: { ...personnelFields },
          states: { ...personnelFields }
        },
      },
      isProcessing: false,
    }
  },
  created() {
    copyValue(this.data, this.forms.personnel.fields)
  },
  methods: {
    onSave() {
      this.isProcessing = true
      const { personnel } = this.forms
      reset(personnel)

      const data = {
        ...personnel.fields
      }

      this.updatePersonnel(data, this.personnelId).then(({ data }) => {
        this.isProcessing = false
        showNotification(this, 'success', 'Contact has been saved.')
      }).catch(error => {
        const errors = error.response.data.errors
        validate(personnel, errors)
        console.log(errors)
        this.isProcessing = false
      })
    }
  },
  computed: {
    personnelId() {
      const { data } = this
      return data?.id
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";
</style>
