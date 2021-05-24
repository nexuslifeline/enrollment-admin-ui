<template>
  <div class="attachments__container">
    attachments component here
  </div>
</template>
<script>

export default {
  props: {
    data: {
      type: [Object]
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.attachments__container {
  padding: 20px;
}

</style>
