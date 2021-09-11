<template>
  <b-media>
    <template v-slot:aside>
      <AvatarMaker
        :avatarId="userId"
        :size="33"
        :text="avatarText"
        :src="$options.getFilePath(photoHashName)"
      />
    </template>
    <div class="student-name">
      <div>
        <b-link @click="callback.loadDetails">
          {{ studentName }}
        </b-link>
      </div>
      <div class="label__badges-container">
        <span
          v-if="showIsManual && isManual"
          v-b-tooltip.hover
          :title="`Student is manually registered.`"
          class="label__secondary">
          {{ `Manual` }}
        </span>
        <template v-if="data.student">
          <span
            v-if="isProvisional"
            v-b-tooltip.hover
            :title="`Student is still Onboarding. Currently in '${$options.OnBoardingSteps.getEnum(data.student.onboardingStepId).name}' Stage.`"
            class="label__secondary">
            {{ `Provisional` }}
          </span>
        </template>
      </div>
    </div>
    <BulletedContent :items="[userName, `SN: ${data.student.studentNo || 'Awaiting'}`]" />
  </b-media>
</template>

<script>
import AvatarMaker from '../AvatarMaker';
import { getFilePath } from '../../../helpers/utils';
import { OnBoardingSteps } from '../../../helpers/enum';
export default {
  getFilePath,
  OnBoardingSteps,
  props: {
    data: {
      type: [Object],
    },
    callback: {
      type: [Object],
    },
    showIsManual: {
      type: [Boolean]
    },
    isManual: {
      type: [Boolean, Number],
      default: false
    }
  },
  components: {
    AvatarMaker,
  },
  computed: {
    avatarText() {
      const { firstName = '', lastName = '' } = this.data?.student || {};
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    },
    photoHashName() {
      const { photo = {} } = this.data?.student || {};
      return photo?.hashName || '';
    },
    studentName() {
      return this.data?.student?.name?.trim() || 'No Name';
    },
    userName() {
      return this.data?.student?.user?.username || 'No Account';
    },
    userId() {
      return this.data?.student?.id || this.data?.student?.user?.id || 0;
    },
    isProvisional() {
      return this.data?.student?.isOnboarding;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';

.label__badges-container {
  display: flex;
  align-items: center;
  position: absolute;
  right: 10px;
}

.student-name {
  display: flex;
  position: relative;
}

.label__secondary {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 5px;
  color: $dark-gray-300;
  font-weight: 600;
  // border: 1px solid $dark-gray-100;
  background-color: $light-gray-100;
  cursor: pointer;
  line-height: 13px;
}

</style>
