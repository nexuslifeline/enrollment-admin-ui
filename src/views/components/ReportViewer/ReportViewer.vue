<template>
  <div class="report-viewer__container">
    <b-embed
      v-if="file && file.src"
      type="iframe"
      aspect="16by9"
      allowfullscreen
      :src="file.src"
      class="preview-file__embed"
    />
  </div>
</template>
<script>
export default {
  props: {
    file: Object
  },
  data() {
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .report-viewer__container {
    height: 100%;
    width: 100%;
  }

  .preview-file__embed {
    width: 100%;
    height: 100%;
  }

  .embed-responsive  {
    height: 100%;
  }

</style>
