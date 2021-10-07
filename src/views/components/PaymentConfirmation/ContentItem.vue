<template>
  <div class="payment__content-item" :class="{ column: column }">
    <div class="payment__label">
      {{ label }}
    </div>
    <div class="payment__text" :class="{ blue, medium, red }">
      {{ description }}
    </div>
  </div>
</template>
<script>

export default {
  props: {
    label: {
      type: [String]
    },
    description: {
      type: [String]
    },
    blue: {
      type: [Boolean]
    },
    medium: {
      type: [Boolean]
    },
    red: {
      type: [Boolean]
    },
    column: {
      type: [Boolean]
    }
  }
};
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/_shared.scss';

  .payment__label {
    color: $dark-gray-100;
    flex: 1;
  }

  .payment__text {
    font-weight: 500;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;

    &.blue {
      color: $blue;
    }

    &.red {
      color: $red;
    }

    &.medium {
      font-size: 24px;
      font-weight: 600;
    }
  }

  .payment__content-item {
    margin-bottom: 5px;
    display: flex;

    &.column {
      flex-direction: column;

      .payment__label {
        text-align: right;
      }
    }
  }
</style>