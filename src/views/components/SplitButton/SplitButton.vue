<template>
  <b-dropdown
    v-if="actions && actions.length > 0"
    class="split-dropdown"
    split
    :split-variant="splitVariant"
    :variant="variant"
    :text="text"
    @click="$emit('click')"
    no-caret>
    <!-- <template #button-content>
      <v-icon name="ellipsis-v" />
    </template> -->
    <b-dropdown-item v-for="(action, idx) in actions" :key="idx" @click="action.callback">
      {{ action.text }}
    </b-dropdown-item>
  </b-dropdown>
  <b-button v-else :variant="splitVariant" @click="$emit('click')">
    {{ text }}
  </b-button>
</template>

<script>
  export default {
    props: {
      splitVariant: {
        type: [String],
        default: 'primary'
      },
      variant: {
        type: [String],
        default: 'primary'
      },
      text: {
        type: [String],
        default: 'Submit'
      },
      actions: {
        type: [Array],
      }
    }
  }
</script>
<style lang="scss">
  @import "../../../assets/scss/shared.scss";

  .split-dropdown {
    .dropdown-toggle-split {
      padding: 5px 7px !important;
      border-left: 1px solid $white;
    }

    button.btn:first-child {
      min-width: 120px !important;
    }
  }

</style>