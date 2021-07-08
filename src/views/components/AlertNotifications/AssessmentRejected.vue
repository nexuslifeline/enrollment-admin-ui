<template>
  <b-alert :show="show" variant="danger" class="mb-3">
    <b> Assessment is rejected.</b>
    <br>
    Reason :
    <br>
    <b>{{ data && data.disapprovalNotes }}</b>
  </b-alert>
</template>

<script>
export default {
  props: {
    data: {
      type: [Object],
    },
    show: {
      type: [Boolean],
      default: false
    }
  }

}
</script>

<style>

</style>