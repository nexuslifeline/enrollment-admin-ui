<template>
  <div class="co-department__list-item">
    <AvatarMaker
      :size="45"
      :avatarId="data.id"
      text="PR"
    />
    <div class="co-department__list-item-detail">
      <p class="list-item__text-bold">{{data.name}}</p>
      <p class="list-item__text-muted">{{data.group}}</p>
    </div>
  </div>
</template>
<script>
import Card from '../Card';
import AvatarMaker from '../AvatarMaker';
export default {
  components: {
    Card,
    AvatarMaker
  },
  props: {
    data: {
      type: [Object],
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.co-department__list-item {
  display: flex;
  padding: 0;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
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
