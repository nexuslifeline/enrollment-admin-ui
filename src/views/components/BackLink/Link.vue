<template>
  <button class="back__link" @click="$router.push(previousRoute ||  { name: 'Student List' })">
    <BIconArrowLeft scale="1.5" class="mr-2" />
    Return to List
  </button>
</template>

<script>
  export default {
    props: {
      previousRoute: {
        type: [Object]
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .back__link {
    border: 0;
    outline: none;
    color: $blue;
    text-decoration: underline;
    background: none;
    margin-bottom: 10px;
  }
</style>