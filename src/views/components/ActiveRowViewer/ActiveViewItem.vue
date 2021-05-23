<template>
  <div class="active-view__detail-item">
    <div class="mr-2 font-weight-bold">
      {{label}}
    </div>
    <div class="active-view__content-container">
      <div class="active-view__detail-item-content">
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
  .active-view__detail-item {
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

  .active-view__detail-item-content {
    display: flex;
    flex-direction: column;
  }

.active-view__content-container {
    display: flex;
    flex-direction: row;
  }


</style>