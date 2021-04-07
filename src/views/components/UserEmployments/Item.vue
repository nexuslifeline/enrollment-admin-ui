<template>
  <div class="user-employment__list-item">
    <div class="item__content">
      <p class="item__title">{{ data.title }}</p>
      <p class="item__text">{{ data.address }}</p>
      <p class="item__text">{{ data.period }}</p>
    </div>
    <div class="item__action">
      <b-button type="button" variant="outline-primary">
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

.user-employment__list-item {
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

.item__action {

}

.item__text {
  color: $dark-gray-200;
  font-size: 14px;
  margin: 0;
}

.item__title {
  font-weight: 500;
  color: $dark-gray-500;
  font-size: 17px;
  margin: 0 0 3px 0;
}

</style>
