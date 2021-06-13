<template>
  <div>
    <div class="subject-code">{{ data.code || '' }}</div>
    <div class="subject-description">{{ data.description ||'' }}</div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: [Object],
    }
  }
}
</script>

<style>

</style>