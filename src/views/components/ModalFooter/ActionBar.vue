<template>
  <div class="action-bar__container">
    <div class="action-left__area">
      <b-button
        class="mr-2"
        v-if="showDelete"
        variant="dark"
        size="sm"
        @click="$emit('onDelete')"
        :disabled="isConfirmBusy || isDeleteBusy">
        <v-icon name="spinner" spin v-if="isDeleteBusy" />
        {{ deleteText }}
      </b-button>
    </div>

    <b-button
        class="mr-2"
        v-if="showCancel"
        variant="dark"
        size="sm"
        @click="$emit('onCancel')"
        :disabled="isConfirmBusy || isDeleteBusy">
        {{ cancelText }}
    </b-button>

    <b-button
      variant="primary"
      size="sm"
      @click="$emit('onConfirm')"
      :disabled="isConfirmBusy || isDeleteBusy">
      <v-icon name="spinner" spin v-if="isConfirmBusy" />
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
    isDeleteBusy: {
      type: [Boolean],
      default: false
    },
    showCancel: {
      type: [Boolean],
      default: true
    },
    showDelete: {
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
    deleteText: {
      type: [String],
      default: 'Delete'
    },
    mode: {
      type: [String],
      default: 'edit'
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
    width: 100%;
    justify-content: flex-end;
  }

  .action-left__area {
    flex: 1;
  }

</style>
