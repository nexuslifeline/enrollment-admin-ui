<template>
  <b-media>
    <template v-slot:aside>
      <AvatarMaker
        :avatarId="data.student.id"
        :size="33"
        :text="avatarText"
        :src="$options.getFilePath(photoHashName)"
      />
    </template>
    <div class="student-name">
      <b-link @click="callback.loadDetails">
        {{ data.student && data.student.name }}
      </b-link>
      <span
        v-if="data.student.studentNo"
        v-b-tooltip.hover
        :title="`Student Number: ${data.student.studentNo}`"
        class="label__student-no">
        {{data.student.studentNo}}
      </span>
    </div>
    <div class="text-muted">
      {{ data.student.email }}
    </div>
  </b-media>
</template>

<script>
import AvatarMaker from '../AvatarMaker';
import { getFilePath } from '../../../helpers/utils';
export default {
  getFilePath,
  props: {
    data: {
      type: [Object],
    },
    callback: {
      type: [Object],
    },
  },
  components: {
    AvatarMaker,
  },
  computed: {
    avatarText() {
      const { firstName, lastName } = this.data.student;
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    },
    photoHashName() {
      const { photo } = this.data.student;
      return photo?.hashName || '';
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';

.student-name {
  display: flex;
  position: relative;
}

.label__student-no {
  font-size: 10px;
  padding: 0 6px;
  border-radius: 5px;
  color: $dark-gray-300;
  font-weight: 600;
  border: 1px solid $dark-gray-100;
  background-color: $light-gray-100;
  height: 15px;
  display: flex;
  align-items: center;
  position: absolute;
  right: 10px;
  cursor: pointer;
}
</style>
