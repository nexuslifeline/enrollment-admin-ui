<template>
  <b-media>
    <template v-slot:aside>
      <AvatarMaker
        :avatarId="data.id"
        :size="33"
        :text="avatarText"
        :src="$options.getFilePath(photoHashName)"
      />
    </template>
    <div class="member-name">
      <b-link @click="callback.loadDetails">
        {{ data.name }}
      </b-link>
    </div>
    <div v-if="!!(data && data.user)" class="text-muted">
      {{ data.user.username }}
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
    }
  },
  components: {
    AvatarMaker,
  },
  computed: {
    avatarText() {
      const { firstName, lastName } = this.data;
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    },
    photoHashName() {
      const { photo } = this.data;
      return photo?.hashName || '';
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';

.member-name {
  display: flex;
  position: relative;
}
</style>
