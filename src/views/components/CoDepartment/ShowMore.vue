<template>
  <div class="show-more__container">
    <button class="action__show-more" @click="$emit('onShowMore')">
      Show More
    </button>
  </div>
</template>
<script>
export default {

};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.show-more__container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  width: 100%;
  background-color: $light-gray-100;
  margin-top: 10px;
}

.action__show-more {
  border: 0;
  outline: none;
  color: $blue;
  background: none;
  text-decoration: underline;
}

</style>
