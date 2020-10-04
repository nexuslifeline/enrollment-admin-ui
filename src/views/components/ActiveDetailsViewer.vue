<template>
  <div class="active-view__container">
    <b-overlay :show="isBusy" rounded="sm">
      <div class="active-view__header">
        <div class="active-view__header-actions">
          <button @click="$emit('onBack')" class="active-view__header-action-back">
            <BIconArrowLeftCircle scale="2" />
            {{backTitle}}
          </button>
        </div>
        <slot name="header"></slot>
      </div>
      <div class="active-view__body">
        <div class="active-view__side-nav">
          <slot name="navigation"></slot>
        </div>
        <div class="active-view__content">
          <slot name="content"></slot>
        </div>
      </div>
    </b-overlay>
  </div>
</template>

<script>
  export default {
    props: {
      isBusy: {
        type: [Boolean],
        default: false
      },
      backTitle: {
        type: [String],
        default: 'Back'
      }
    },
    mounted() {
      const body = document.querySelector('body');
      if (body) {
        body.style.overflow = 'hidden';
      }
    },
    beforeDestroy() {
      const body = document.querySelector('body');
      if (body) {
        body.style.overflow = 'auto';
      }
    },
  }
</script>
<style>

</style>