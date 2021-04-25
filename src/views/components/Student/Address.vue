<template>
  <Card title="Address" titleSize="m" :hasFooter="true">
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label class="required">House No/Street (Current)</label>
          <b-form-input
            v-model="forms.address.fields.currentHouseNoStreet"
            :state="forms.address.states.addressCurrentHouseNoStreet"
            debounce="500"/>
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
            debounce="500"/>
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
            debounce="500"/>
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
            debounce="500"/>
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
            debounce="500"/>
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
            debounce="500"/>
        </b-form-group>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <b-form-group>
          <label>Region (Current)</label>
          <b-form-input
            v-model="forms.address.fields.currentRegion"
            debounce="500"/>
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
            <b-form-select-option v-for='country in []' :key='country.id' :value='country.id'>
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
          debounce="500"/>
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
              v-model="forms.address.fields.currentHouseNoStreet"
              :state="forms.address.states.addressCurrentHouseNoStreet"
              debounce="500"/>
            <b-form-invalid-feedback>
              {{forms.address.errors.addressCurrentHouseNoStreet}}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label class="required">Barangay (Permanent)</label>
            <b-form-input
              v-model="forms.address.fields.currentBarangay"
              :state="forms.address.states.addressCurrentBarangay"
              debounce="500"/>
            <b-form-invalid-feedback>
              {{forms.address.errors.addressCurrentBarangay}}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label class="required">City (Permanent)</label>
            <b-form-input
              v-model="forms.address.fields.currentCityTown"
              :state="forms.address.states.addressCurrentCityTown"
              debounce="500"/>
            <b-form-invalid-feedback>
              {{forms.address.errors.addressCurrentCityTown}}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label class="required">Province (Permanent)</label>
            <b-form-input
              v-model="forms.address.fields.currentProvince"
              :state="forms.address.states.addressCurrentProvince"
              debounce="500"/>
            <b-form-invalid-feedback>
              {{forms.address.errors.addressCurrentProvince}}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label class="required">Postal Code (Permanent)</label>
            <b-form-input
              v-model="forms.address.fields.currentPostalCode"
              :state="forms.address.states.addressCurrentPostalCode"
              debounce="500"/>
            <b-form-invalid-feedback>
              {{forms.address.errors.addressCurrentPostalCode}}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label >District (Permanent)</label>
            <b-form-input
              v-model="forms.address.fields.currentDistrict"
              debounce="500"/>
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label>Region (Permanent)</label>
            <b-form-input
              v-model="forms.address.fields.currentRegion"
              debounce="500"/>
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label class="required">Country (Permanent)</label>
            <b-form-select
              v-model="forms.address.fields.currentCountryId"
              :state="forms.address.states.addressCurrentCountryId">
              <template v-slot:first>
                <b-form-select-option :value='null' disabled>--Select Country --</b-form-select-option>
              </template>
              <b-form-select-option v-for='country in []' :key='country.id' :value='country.id'>
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
        <b-form-group>
          <label>Complete Address (Permanent)</label>
          <b-form-textarea
            rows="3"
            v-model="forms.address.fields.currentCompleteAddress"
            :state="forms.address.states.addressCurrentCompleteAddress"
            debounce="500"/>
          <b-form-invalid-feedback>
            {{forms.address.errors.addressCurrentCompleteAddress}}
          </b-form-invalid-feedback>
        </b-form-group>
      </InputContainer>
    </div>
    <template v-slot:footer>
      <CardFooterRow>
        <b-button variant="primary" @click="onSave">
          Save Address
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
      isSameAddress: true,
      forms: {
        address: {
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
