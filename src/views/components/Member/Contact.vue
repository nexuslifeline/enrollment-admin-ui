<template>
  <Card title="Contact" titleSize="m" :isCompleted="isCompleted" :hasFooter="true">
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label class="required">Complete Address</label>
          <b-form-textarea
            rows="4"
            v-model="forms.personnel.fields.completeAddress"
            :state="forms.personnel.states.completeAddress"
           />
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
           />
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
           />
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Emergency Mobile No</label>
          <b-form-input
            v-model="forms.personnel.fields.emergencyMobileNo"
           />
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
           />
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Facebook URL</label>
          <b-form-input
            v-model="forms.personnel.fields.facebookUrl"
           />
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
           />
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
           />
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
           />
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
           />
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
import debounce from 'lodash/debounce';

export default {
  props: {
    data: {
      type: [Object]
    }
  },
  mixins: [ PersonnelApi ],
  data() {
    return {
      isCompleted: false,
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
    copyValue(this.data, this.forms.personnel.fields);
    this.registerObservers();
  },
  methods: {
    registerObservers() {
      this.$watch('forms.personnel.fields', this.autoSave, { deep: true, immediate: false });
      this.$watch('forms.personnel.fields', this.checkCompletion, { deep: true, immediate: true });
    },
    checkCompletion() {
      const {
        completeAddress
      } = this.forms.personnel.fields;
      this.isCompleted = !!completeAddress;
      this.$emit('onCompletionChange', this.isCompleted);
    },
    autoSave: debounce(function() { this.onSave() }, 2000),
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
