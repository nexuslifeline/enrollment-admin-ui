<template>
  <div class="item__row">
    <div class="item__content">
      <p class="item__title">Change Email</p>
      <p class="item__text">Lorem ipsum dolor itet non sa ba ke rui boa son di yu baka tiya lo rerem di sa.</p>
    </div>
    <div class="item__action">
      <div class="item__details">
        <p class="item__title r-align-text">chrisrueda14@yahoo.com</p>
        <p class="item__text r-align-text">System Administrator</p>
      </div>
      <b-button type="button" variant="outline-primary">
        Change
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

.item__row {
  display: flex;
  flex-direction: row;
  padding: 0;
  margin-top: 10px;
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
}

.item__details {
  margin-bottom: 20px;
}

.item__content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.item__action {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
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
