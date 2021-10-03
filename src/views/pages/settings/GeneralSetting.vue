<template>
  <div class="general-setting_main-container">
    <b-overlay :show="isLoading" rounded="sm">
      <div class="header-container">
        <h4>GENERAL SETTINGS</h4>
        <p>
         In General Settings, the basic configuration for the application can be set.
        </p>
      </div>
      <div class="content-container">
        <div class="general-info-container">
          <b-form-group
            label="MISCELLANEOUS FEE CATEGORY"
            class="general-miscellaneous"
            label-class="font-weight-bold"
          >
            <b-form-select
              v-model="forms.generalSetting.fields.miscellaneousFeeCategoryId"
              :state="forms.generalSetting.states.miscellaneousFeeCategoryId"
            >
              <b-form-select-option
                v-for="sfc in options.schoolFeeCategories.items"
                :key="sfc.id"
                :value="sfc.id"
              >
                {{ sfc.name }}
              </b-form-select-option>
            </b-form-select>
            <b-form-invalid-feedback>
              {{ forms.generalSetting.errors.miscellaneousFeeCategoryId }}
            </b-form-invalid-feedback>
          </b-form-group>
        </div>
        <div class="footer">
          <b-button
            variant="primary"
            @click="onUpdateSettings"
            :disabled="isProcessing"
          >
            <v-icon v-if="isProcessing" name="sync" class="mr-2" spin />
            SAVE CHANGES</b-button
          >
        </div>
      </div>
    </b-overlay>
  </div>
</template>

<script>
const generalSettingFields = {
  miscellaneousFeeCategoryId: null,
};

import { GeneralSettingApi, SchoolFeeCategoryApi } from '../../../mixins/api';
import { copyValue } from '../../../helpers/extractor';
import { validate, reset, showNotification } from '../../../helpers/forms';
export default {
  name: 'GeneralSettings',
  mixins: [GeneralSettingApi, SchoolFeeCategoryApi],
  data() {
    return {
      isLoading: false,
      isProcessing: false,
      isOrganizationLogoBusy: false,
      organizationLogoUrl: null,
      forms: {
        generalSetting: {
          fields: { ...generalSettingFields },
          errors: { ...generalSettingFields },
          states: { ...generalSettingFields },
        },
      },
      options: {
        schoolFeeCategories: {
          items: [],
        },
      },
    };
  },
  created() {
    this.isLoading = true;
    const { generalSetting } = this.forms;
    const generalSettingId = 1; //fixed id of organization settings
    this.getGeneralSetting(generalSettingId)
      .then(({ data }) => {
        copyValue(data, generalSetting.fields);
        this.isLoading = false;
      })
      .catch((error) => {
        this.isLoading = false;
      });
    this.loadSchoolFeeCategories();
  },
  methods: {
    loadSchoolFeeCategories() {
      const params = { paginate: false };
      const { schoolFeeCategories } = this.options;
      this.getSchoolFeeCategoryList(params)
        .then(({ data }) => {
          schoolFeeCategories.items = data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onUpdateSettings() {
      this.isProcessing = true;
      const { generalSetting } = this.forms;
      const generalSettingId = 1; //fixed id of organization settings
      reset(generalSetting);
      this.updateGeneralSetting(generalSetting.fields, generalSettingId)
        .then(({ data }) => {
          this.isProcessing = false;
          showNotification(this, 'success', 'Settings has been updated.');
        })
        .catch((error) => {
          const errors = error.response.data.errors;
          console.log(errors);
          validate(generalSetting, errors, this);
          this.isProcessing = false;
        });
    },
  },
};
</script>

<style lang="scss">
@import '../../../assets/scss/_shared.scss';
.general-setting_main-container {
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

  .general-info-container {
    width: 100%;
    margin: 10px 0;
    padding-top: 10px;

    .general-miscellaneous {
      width: 50%;
    }
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100px;
  }
}
</style>
