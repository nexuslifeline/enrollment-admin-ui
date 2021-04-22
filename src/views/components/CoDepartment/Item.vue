<template>
  <div class="co-department__list-item">
    <AvatarMaker
      :size="43"
      :avatarId="data.id"
      :text="avatarText"
      :src="$options.getFilePath(photoHashName)"
    />
    <div class="co-department__list-item-detail">
      <vText size="s" weight="bold">{{ data.name }}</vText>
      <vText v-if="!!(data && data.user && data.user.userGroup)" size="s" color="light">
        {{ data.user.userGroup.name }}
      </vText>
    </div>
  </div>
</template>
<script>
import Card from '../Card';
import AvatarMaker from '../AvatarMaker';
import { getFilePath } from '../../../helpers/utils';
export default {
  getFilePath,
  components: {
    Card,
    AvatarMaker
  },
  props: {
    data: {
      type: [Object],
    }
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
@import "../../../assets/scss/shared.scss";

.co-department__list-item {
  display: flex;
  padding: 0;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 8px;
  }
}

.co-department__list-item-detail {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}

.list-item__text-muted {
  color: $dark-gray-200;
  font-size: 13px;
  margin: 0;
}

.list-item__text-bold {
  font-weight: 500;
  margin: 0;
}

</style>
