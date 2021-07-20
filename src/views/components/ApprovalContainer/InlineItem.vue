<template>
  <div class="inline-item">
    <span class="inline-item__label">
      {{ label }}
    </span>
    <div class="inline-item__content">
      <slot></slot>
    </div>
    <button v-if="isEditable" class="btn-action" @click="$emit('onEdit')">
      <BIconPencil />
    </button>
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

  .inline-item {
    display: flex;
    width: 100%;
    margin-bottom: 15px;
  }

  .inline-item__label {
    flex: 25%;
    max-width: 110px;
    font-size: 13px;
    color: $gray;
  }

  .inline-item__content {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    font-size: 14px;
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

</style>