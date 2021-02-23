<template>
  <div class="selected-option">
    <div class="selected-option__avatar-container">
      <img
        v-if="!!data.photo"
        :src="data.photo.hashName"
        class="selected-option__avatar"
      />
      <ProfileMaker
        v-else
        :initials="data.name.charAt(0)"
        :colorIndex="data.id % 8"
        class="selected-option__avatar"
      />
    </div>
    <div class="selected-option__info">
      <span>{{
        data.studentNo || data.email
      }}</span>
    </div>
  </div>
</template>
<script>
import { getFilePath } from '../../../helpers/utils';
import ProfileMaker from '../ProfileMaker';

export default {
  getFilePath,
  props: {
    data: Object
  },
  components: {
    ProfileMaker
  }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';
</style>
