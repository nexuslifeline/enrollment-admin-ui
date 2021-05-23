<template>
  <div class="approval-view__detail-item">
    <div class="approval-item__title">
      {{ label }}
    </div>
    <div class="approval-view__content-container">
      <div class="approval-view__detail-item-content">
        <slot></slot>
      </div>
      <button v-if="isEditable" class="btn-action" @click="$emit('onEdit')">
        <BIconPencil />
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      label: {
        type: [String]
      },
      isEditable: {
        type: [Boolean],
        default: false
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
  .approval-view__detail-item {
    flex: 50%;

    @include for-size(phone-only) {
      flex: 100%;
    }
  }

  .btn-action {
    outline: none;
    border: 0;
    background: none;
    margin-bottom: auto;
    margin-left: 20px;
    border-radius: 50%;
    height: 23px;
    width: 23px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: black;
      svg {
        color: $white;
      }
    }
  }

  .approval-view__detail-item-content {
    display: flex;
    flex-direction: column;
    padding: 10px 15px;
    border-bottom: 1px solid $light-gray-100;
    width: 100%;
  }

  .approval-view__content-container {
    display: flex;
    flex-direction: row;
  }

  .approval-item__title {
    color: $blue;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 600;
    padding: 10px 15px;
    border-bottom: 1px solid $light-gray-100;
  }


</style>