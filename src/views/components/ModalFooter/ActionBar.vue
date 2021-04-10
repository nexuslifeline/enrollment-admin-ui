<template>
  <div class="action-bar__container">
    <b-button
      class="mr-2"
      variant="dark"
      size="sm"
      @click="$emit('onCancel')">
      {{ cancelText }}
    </b-button>
    <b-button
      variant="primary"
      size="sm"
      @click="$emit('onConfirm')">
      {{ confirmText }}
    </b-button>
  </div>
</template>
<script>
export default {
  props: {
    isConfirmBusy: {
      type: [Boolean],
      default: false
    },
    confirmText: {
      type: [String],
      default: 'Save'
    },
    cancelText: {
      type: [String],
      default: 'Cancel'
    },
  },
  methods: {
    onSave() {
      alert('save here')
    }
  }
};
</script>
<style lang="scss" scoped>
  .action-bar__container {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

</style>
