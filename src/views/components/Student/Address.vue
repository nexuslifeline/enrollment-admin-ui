<template>
  <Card
    title="Address"
    titleSize="m"
    :isCompleted="isCompleted"
    :hasFooter="true">
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label class="required">House No/Street (Current)</label>
          <b-form-input
            v-model="forms.address.fields.currentHouseNoStreet"
            :state="forms.address.states.addressCurrentHouseNoStreet"
           />
          <b-form-invalid-feedback>
            {{forms.address.errors.addressCurrentHouseNoStreet}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label class="required">Barangay (Current)</label>
          <b-form-input
            v-model="forms.address.fields.currentBarangay"
            :state="forms.address.states.addressCurrentBarangay"
           />
          <b-form-invalid-feedback>
            {{forms.address.errors.addressCurrentBarangay}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label class="required">City (Current)</label>
          <b-form-input
            v-model="forms.address.fields.currentCityTown"
            :state="forms.address.states.addressCurrentCityTown"
           />
          <b-form-invalid-feedback>
            {{forms.address.errors.addressCurrentCityTown}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label class="required">Province (Current)</label>
          <b-form-input
            v-model="forms.address.fields.currentProvince"
            :state="forms.address.states.addressCurrentProvince"
           />
          <b-form-invalid-feedback>
            {{forms.address.errors.addressCurrentProvince}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label class="required">Postal Code (Current)</label>
          <b-form-input
            v-model="forms.address.fields.currentPostalCode"
            :state="forms.address.states.addressCurrentPostalCode"
           />
          <b-form-invalid-feedback>
            {{forms.address.errors.addressCurrentPostalCode}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label >District (Current)</label>
          <b-form-input
            v-model="forms.address.fields.currentDistrict"
           />
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Region (Current)</label>
          <b-form-input
            v-model="forms.address.fields.currentRegion"
           />
        </b-form-group>
      </InputContainer>
      <InputContainer>
        <b-form-group>
          <label class="required">Country (Current)</label>
          <b-form-select
            v-model="forms.address.fields.currentCountryId"
            :state="forms.address.states.addressCurrentCountryId">
            <template v-slot:first>
              <b-form-select-option :value='null' disabled>--Select Country --</b-form-select-option>
            </template>
            <b-form-select-option v-for='country in Countries' :key='country.id' :value='country.id'>
              {{country.name}}
            </b-form-select-option>
          </b-form-select>
          <b-form-invalid-feedback>
              {{forms.address.errors.addressCurrentCountryId}}
            </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputContainer>
    <InputContainer>
      <b-form-group>
        <label>Complete Address (Current)</label>
        <b-form-textarea
          rows="3"
          v-model="forms.address.fields.currentCompleteAddress"
          :state="forms.address.states.addressCurrentCompleteAddress"
         />
        <b-form-invalid-feedback>
          {{forms.address.errors.addressCurrentCompleteAddress}}
        </b-form-invalid-feedback>
      </b-form-group>
    </InputContainer>
      <InputInline class="mt-4">
        <Toggle v-model="isSameAddress" />
        <span class="ml-2">Permanent Address is same as Current Address</span>
      </InputInline>
    </InputContainer>
    <div v-if="!isSameAddress" class="mt-4">
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label class="required">House No/Street (Permanent)</label>
            <b-form-input
              v-model="forms.address.fields.permanentHouseNoStreet"
              :state="forms.address.states.addressPermanentHouseNoStreet"
             />
            <b-form-invalid-feedback>
              {{forms.address.errors.addressPermanentHouseNoStreet}}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label class="required">Barangay (Permanent)</label>
            <b-form-input
              v-model="forms.address.fields.permanentBarangay"
              :state="forms.address.states.addressPermanentBarangay"
             />
            <b-form-invalid-feedback>
              {{forms.address.errors.addressPermanentBarangay}}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label class="required">City (Permanent)</label>
            <b-form-input
              v-model="forms.address.fields.permanentCityTown"
              :state="forms.address.states.addressPermanentCityTown"
             />
            <b-form-invalid-feedback>
              {{forms.address.errors.addressPermanentCityTown}}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label class="required">Province (Permanent)</label>
            <b-form-input
              v-model="forms.address.fields.permanentProvince"
              :state="forms.address.states.addressPermanentProvince"
             />
            <b-form-invalid-feedback>
              {{forms.address.errors.addressPermanentProvince}}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label class="required">Postal Code (Permanent)</label>
            <b-form-input
              v-model="forms.address.fields.permanentPostalCode"
              :state="forms.address.states.addressPermanentPostalCode"
             />
            <b-form-invalid-feedback>
              {{forms.address.errors.addressPermanentPostalCode}}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label >District (Permanent)</label>
            <b-form-input
              v-model="forms.address.fields.permanentDistrict"
             />
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label>Region (Permanent)</label>
            <b-form-input
              v-model="forms.address.fields.permanentRegion"
             />
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label class="required">Country (Permanent)</label>
            <b-form-select
              v-model="forms.address.fields.permanentCountryId"
              :state="forms.address.states.addressPermanentCountryId">
              <template v-slot:first>
                <b-form-select-option :value='null' disabled>--Select Country --</b-form-select-option>
              </template>
              <b-form-select-option v-for='country in Countries' :key='country.id' :value='country.id'>
                {{country.name}}
              </b-form-select-option>
            </b-form-select>
            <b-form-invalid-feedback>
                {{forms.address.errors.addressPermanentCountryId}}
              </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Complete Address (Permanent)</label>
          <b-form-textarea
            rows="3"
            v-model="forms.address.fields.permanentCompleteAddress"
            :state="forms.address.states.addressPermanentCompleteAddress"
           />
          <b-form-invalid-feedback>
            {{forms.address.errors.addressPermanentCompleteAddress}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </div>
    <template v-slot:footer>
      <CardFooterRow>
        <b-button variant="primary" @click="onSave" :disabled="isProcessing">
          <v-icon name="spinner" spin v-if="isProcessing"/>  Save Address
        </b-button>
      </CardFooterRow>
    </template>
  </Card>
</template>
<script>
const addressFields = {
  currentHouseNoStreet: null,
  currentBarangay: null,
  currentCityTown: null,
  currentProvince: null,
  currentRegion: null,
  currentDistrict: null,
  currentPostalCode: null,
  currentCountryId: Countries.PHILIPPINES.id,
  currentCompleteAddress: null,
  // currentHomeLandlineMobileNo: null,
  permanentHouseNoStreet: null,
  permanentBarangay: null,
  permanentCityTown: null,
  permanentProvince: null,
  permanentRegion: null,
  permanentDistrict: null,
  permanentPostalCode: null,
  permanentCountryId: Countries.PHILIPPINES.id,
  permanentCompleteAddress: null,
  // permanentHomeLandlineMobileNo: null
}

const addressErrorFields = {
  addressCurrentHouseNoStreet: null,
  addressCurrentBarangay: null,
  addressCurrentCityTown: null,
  addressCurrentProvince: null,
  addressCurrentRegion: null,
  addressCurrentDistrict: null,
  addressCurrentPostalCode: null,
  addressCurrentCountryId: null,
  addressCurrentCompleteAddress: null,
  // addressCurrentHomeLandlineMobileNo: null,
  addressPermanentHouseNoStreet: null,
  addressPermanentBarangay: null,
  addressPermanentCityTown: null,
  addressPermanentProvince: null,
  addressPermanentRegion: null,
  addressPermanentDistrict: null,
  addressPermanentPostalCode: null,
  addressPermanentCountryId: null,
  addressPermanentCompleteAddress: null,
  // addressPermanentHomeLandlineMobileNo: null
}
import { Countries } from '../../../helpers/enum'
import { StudentApi } from '../../../mixins/api';
import { copyValue } from '../../../helpers/extractor';
import { validate, reset, showNotification } from '../../../helpers/forms';
import debounce from 'lodash/debounce';

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
      isCompleted: false,
      Countries: Countries.values,
      isSameAddress: true,
      forms: {
        address: {
          fields: { ...addressFields },
          errors: { ...addressErrorFields },
          states: { ...addressErrorFields }
        }
      },
      isProcessing: false,
    }
  },
  created() {
    copyValue(this.data, this.forms.address.fields);
    if (this.isAutoSave) {
      this.registerObservers();
    }
  },
  methods: {
    registerObservers() {
      this.$watch('forms.address.fields', this.autoSave, { deep: true, immediate: false });
      this.$watch('forms.address.fields', this.checkCompletion, { deep: true, immediate: true });
    },
    checkCompletion() {
      const {
        currentHouseNoStreet,
        currentBarangay,
        currentCityTown,
        currentProvince,
        // currentDistrict,
        currentPostalCode,
        currentCountryId,
        permanentHouseNoStreet,
        permanentBarangay,
        permanentCityTown,
        permanentProvince,
        // permanentDistrict,
        permanentPostalCode,
        permanentCountryId
      } = this.forms.address.fields;
      this.isCompleted = !!currentHouseNoStreet &&
        !!currentBarangay &&
        !!currentCityTown &&
        !!currentProvince &&
        // !!currentDistrict &&
        !!currentPostalCode &&
        !!currentCountryId &&
        !!permanentHouseNoStreet &&
        !!permanentBarangay &&
        !!permanentCityTown &&
        !!permanentProvince &&
        // !!permanentDistrict &&
        !!permanentPostalCode &&
        !!permanentCountryId;
      this.$emit('onCompletionChange', this.isCompleted);
    },
    autoSave: debounce(function() { if(this.isCompleted) this.onSave() }, 2000),
    onSave() {
      this.isProcessing = true
      const { address } = this.forms
      reset(address)

      if(this.isSameAddress)
      {
        address.fields.permanentHouseNoStreet = address.fields.currentHouseNoStreet
        address.fields.permanentBarangay = address.fields.currentBarangay
        address.fields.permanentCityTown = address.fields.currentCityTown
        address.fields.permanentProvince = address.fields.currentProvince
        address.fields.permanentRegion = address.fields.currentRegion
        address.fields.permanentDistrict = address.fields.currentDistrict
        address.fields.permanentPostalCode = address.fields.currentPostalCode
        address.fields.permanentCountryId = address.fields.currentCountryId
        address.fields.permanentCompleteAddress = address.fields.currentCompleteAddress
        address.fields.permanentHomeLandlineMobileNo = address.fields.currentHomeLandlineMobileNo
      }

      const data = {
        id: this.studentId,
        address: {
          ...address.fields
        }
      }

      this.updateStudent(data, this.studentId).then(() => {
        this.isProcessing = false
        showNotification(this, 'success', 'Address has been saved.')
      }).catch(error => {
        const errors = error.response.data.errors
        validate(address, errors, this)
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
