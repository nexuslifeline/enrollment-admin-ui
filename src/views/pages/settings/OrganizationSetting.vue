<template>
  <div class="organization-setting__main-container">
    <b-overlay :show="isLoading" rounded="sm">
      <div class="header-container">
        <h4>ORGANIZATION SETTINGS</h4>
        <p>
          In Organization Settings, you can set the name of the organization, address, contact numbers and upload the organization's logo.
        </p>
      </div>
      <div class="content-container">
        <div class="logo-container">
          <div class="logo">
            <PhotoViewer
              @onPhotoChange="onPhotoChange"
              @onPhotoRemove="onPhotoRemove"
              :imageUrl="organizationLogoUrl"
              :isBusy="isOrganizationLogoBusy"
              ref="photoViewer"
            />
          </div>
          <div class="logo-details">
            <h5>CHANGE LOGO</h5>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta architecto ipsam reiciendis itaque sed facilis placeat! </p>
            <b-button variant="outline-primary" @click="onUploadClick">UPLOAD</b-button>
          </div>
        </div>
        <div class="organization-info-container">
          <h5>ORGANIZATION INFORMATION</h5>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta architecto ipsam reiciendis itaque sed facilis placeat! </p>
          <div class="organization-details">
            <b-form-group
              label="ORGANIZATION NAME"
              class="organization-name"
              label-class="font-weight-bold">
              <b-form-input
                v-model="forms.organizationSetting.fields.name"
                :state="forms.organizationSetting.states.name"
                debounce="500"/>
              <b-form-invalid-feedback>
                {{forms.organizationSetting.errors.name}}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              label="ADDRESS"
              label-class="font-weight-bold">
              <b-form-textarea
                v-model="forms.organizationSetting.fields.address"
                rows="5"
                :state="forms.organizationSetting.states.address"
                debounce="500"/>
              <b-form-invalid-feedback>
                {{forms.organizationSetting.errors.address}}
              </b-form-invalid-feedback>
            </b-form-group>
            <div class="organization-contact-info">
              <b-form-group
                label="MOBILE NO."
                class="contact-info">
                <!-- <b-form-input
                  v-model="forms.organizationSetting.fields.mobileNo"
                  :state="forms.organizationSetting.states.mobileNo"
                  debounce="500"/> -->
                  <masked-input
                    type="text"
                    class="form-control"
                    v-model="forms.organizationSetting.fields.mobileNo"
                    :state="forms.organizationSetting.states.mobileNo"
                    :mask="['(', '+', '6', '3', ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]"
                    :guide="false"
                    :showMask="false"
                    placeholderChar="_">
                  </masked-input>
                <b-form-invalid-feedback>
                  {{forms.organizationSetting.errors.mobileNo}}
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group
                label="TELEPHONE NO."
                class="contact-info">
                <b-form-input
                  v-model="forms.organizationSetting.fields.telephoneNo"
                  :state="forms.organizationSetting.states.telephoneNo"
                    debounce="500"/>
                  <b-form-invalid-feedback>
                    {{forms.organizationSetting.errors.telephoneNo}}
                  </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group
                label="EMAIL ADDRESS"
                class="contact-info">
                <b-form-input
                  v-model="forms.organizationSetting.fields.emailAddress"
                  :state="forms.organizationSetting.states.emailAddress"
                  debounce="500"/>
                <b-form-invalid-feedback>
                  {{forms.organizationSetting.errors.emailAddress}}
                </b-form-invalid-feedback>
              </b-form-group>
            </div>
          </div>
        </div>
        <div class="footer">
          <b-button variant="outline-primary"
            @click="onUpdateSettings"
            :disabled="isProcessing">
            <v-icon
              v-if="isProcessing"
              name="sync"
              class="mr-2"
              spin />
            SAVE CHANGES</b-button>
        </div>
      </div>
    </b-overlay>
  </div>
</template>

<script>

const organizationSettingFields = {
  name: null,
  address: null,
  mobileNo: null,
  telephoneNo: null,
  emailAddress: null
}

import PhotoViewer from "../../components/PhotoViewer";
import { OrganizationSettingApi } from "../../../mixins/api";
import { copyValue } from "../../../helpers/extractor";
import { validate, reset, clearFields, showNotification } from '../../../helpers/forms'
export default {
  name: 'OrganizationSettings',
  components: { PhotoViewer },
  mixins: [ OrganizationSettingApi ],
  data() {
    return {
      isLoading: false,
      isProcessing: false,
      isOrganizationLogoBusy : false,
      organizationLogoUrl : null,
      forms: {
        organizationSetting: {
          fields: { ...organizationSettingFields },
          errors: { ...organizationSettingFields },
          states: { ...organizationSettingFields },
        }
      }
    }
  },
  created() {
    this.isLoading = true
    const { organizationSetting } = this.forms
    const organizationSettingId = 1 //fixed id of organization settings
    this.getOrganizationSetting(organizationSettingId).then(({ data }) =>{
      copyValue(data, organizationSetting.fields )
      this.organizationLogoUrl = `${process.env.VUE_APP_PUBLIC_PHOTO_URL}/organization-logo/${data.organizationLogo.hashName}`
      this.isLoading = false
    }).catch(error => {
      this.isLoading = false
    })
  },
  methods: {
    onUpdateSettings() {
      this.isProcessing = true
      const { organizationSetting } = this.forms
      const organizationSettingId = 1 //fixed id of organization settings
      reset(organizationSetting);
      this.updateOrganizationSetting(organizationSetting.fields, organizationSettingId).then(({ data }) => {
        this.isProcessing = false
        showNotification(this, 'success','Settings has been updated.')
      }).catch(error => {
        const errors = error.response.data.errors
        console.log(errors)
        validate(organizationSetting, errors, this)
        this.isProcessing = false
      })
    },
     onPhotoChange(file) {
      this.organizationLogoUrl = null
      this.isProfilePhotoBusy = true
      const formData = new FormData();
      const organizationSettingId = 1
      formData.append('photo', file);

      this.saveLogo(formData, organizationSettingId).then(({ data }) =>{
        this.organizationLogoUrl = `${process.env.VUE_APP_PUBLIC_PHOTO_URL}/organization-logo/${data.hashName}`
        setTimeout(() => this.isProfilePhotoBusy = false, 3000)
      })

    },
    onPhotoRemove() {
      const organizationSettingId = 1
      this.deletePhoto(organizationSettingId).then(({ data }) =>{
        this.organizationLogoUrl = ""
      })
    },
    onUploadClick(e) {
      this.$refs.photoViewer.onBrowseClick(e)
    }
  }

}
</script>

<style lang="scss">

  @import "../../../assets/scss/_shared.scss";
  .organization-setting__main-container {
    height: 100%;
    width: 100%;
    border: solid 1px lightgray;
  }

  .header-container {
    height: auto;
    width: 100%;
    border-bottom: solid 1px lightgray;
    padding: 20px 40px 0px 40px;
  }

  .content-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 10px 40px 10px 40px;

    .logo-container {
      display: flex;
      height: 160px;
      margin: 20px 0;
      align-items: center;

      .logo {
        height: 100%;
        width: 160px;
        margin-right: 30px;
      }

      .logo-details {
        width: 500px;
      }

      @include for-size(phone-only, 500px) {
        height: 300px;
        flex-direction: column;

        align-items: flex-start;

        .logo-details {
          margin-top: 20px;
        }

      }
    }

    .organization-info-container {
      width: 100%;
      margin: 10px 0;
      border-top: solid 1px lightgray;
      padding-top: 20px;

      .organization-details {
        display: flex;
        flex-direction: column;
        margin-top: 20px;

        .organization-name {
          width: 75%;
        }

        .organization-contact-info {
          display: flex;
          justify-content: space-between;

          .contact-info {
            width: 32%;
            font-weight: bold;;
          }
        }

        @include for-size(phone-only) {
          .organization-contact-info {
            flex-direction: column;

            .contact-info {
              width: 100%;
            }

          }

          .organization-name {
            width: 100%;
          }
        }
      }
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      align-items: center ;
      height: 100px;
    }

  }
</style>