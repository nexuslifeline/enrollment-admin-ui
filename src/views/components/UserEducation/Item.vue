<template>
  <div class="user-education__list-item">
    <div class="item__content">
      <vText size="m" weight="bold">{{ data.school }}</vText>
      <vText size="s" color="light">{{ data.degree || data.field || data.societies }}</vText>
      <vText size="s" color="light">{{ data.address }}</vText>
      <vText size="s" color="light">{{ data.period }}</vText>
    </div>
    <div>
      <b-button @click="$emit('onEdit', data)" type="button" variant="outline-primary">
        Edit
      </b-button>
    </div>
  </div>
</template>
<script>


export default {
  components: {

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

.user-education__list-item {
  display: flex;
  flex-direction: row;
  padding: 0;
  margin-top: 10px;
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
}

.item__content {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
