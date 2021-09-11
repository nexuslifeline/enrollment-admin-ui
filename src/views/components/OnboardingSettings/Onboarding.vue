<template>
  <Card
    title="Academic Status & Onboarding Settings"
    titleSize="m"
    :hasFooter="true">
    <CardNote>
      If student is mark as <b>Onboarding</b>,
      the student will not be able to access the Dashboard and will be require to complete the Onboarding process.
    </CardNote>
    <InputGroup :style="{ marginBottom: '10px' }">
      <InputContainer>
        <InputInline>
          <Toggle v-model="isOnboarding" />
          <span class="ml-2">Onboarding</span>
        </InputInline>
      </InputContainer>
      <InputContainer :style="{ minWidth: '65%' }">
        <InputInline>
          <span class="inline-label">Onboarding Stage</span>
          <SelectOnboardingSteps
            v-model="onboardingStepId"
            :reduce="option => option.id"
            :clearable="false"
            label="name"
            :disabled="!isOnboarding"
            :style="{ flex: 1 }"
          />
        </InputInline>
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer />
      <InputContainer :style="{ minWidth: '65%' }">
        <InputInline>
          <span class="inline-label">Academic Record Status</span>
          <SelectAcademicStatus
            :value="academicRecordStatusId"
            @input="academicRecordStatusId = $event"
            :reduce="option => option.id"
            label="name"
            :disabled="false"
            :clearable="false"
            :style="{ flex: 1 }"
          />
        </InputInline>
      </InputContainer>
    </InputGroup>
    <template v-slot:footer>
      <CardFooterRow>
        <b-button variant="primary" @click="onSave" :disabled="isProcessing">
          <v-icon v-if="isProcessing" name="spinner" spin /> Save Changes
        </b-button>
      </CardFooterRow>
    </template>
  </Card>
</template>
<script>
import { showNotification } from '../../../helpers/forms';
  import { StudentApi } from '../../../mixins/api';
  export default {
    mixins: [StudentApi],
    props: {
      data: {
        type: [Object]
      }
    },
    data() {
      return {
        isProcessing: false,
        isOnboarding: false,
        onboardingStepId: 1,
        academicRecordStatusId: 1,
        academicRecordId: null,
      }
    },
    created() {
      this.onboardingStepId = this.data?.onboardingStepId || 1;
      this.isOnboarding = this.data?.isOnboarding;
      this.academicRecordStatusId = this.data?.latestAcademicRecord?.academicRecordStatusId || null;
      this.academicRecordId = this.data?.latestAcademicRecord?.id
    },
    methods: {
      onSave() {
        this.isProcessing = true;
        const { isOnboarding, onboardingStepId, academicRecordStatusId, academicRecordId  } = this;
        const payLoad = {
          isOnboarding,
          onboardingStepId,
          academicRecord: {
            id: academicRecordId,
            academicRecordStatusId
          }
        }
        this.patchStudent(payLoad, this.data?.id).then(() => {
          this.isProcessing = false;
          showNotification(this,'success', 'Academic Status & Onboarding Settings has been saved.', )
        }).catch((error) => {
          console.warn(error);
        });
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .inline-label {
    margin-right: 15px;
    text-align: left;
    min-width: 160px;
  }
</style>