<template>
  <b-modal
    :visible="true"
    size="l"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    @hidden="$router.push({ name: 'Profile' })">
    Change username
  </b-modal>
</template>
<script>
export default {
  props: {
    
  },
};
</script>
<style lang="scss" scoped>


</style>
