<template>
  <div class="action-row">
    <b-button v-if="showBack" variant="dark" @click="$emit('onBack')">
      Back
    </b-button>
    <b-button variant="primary" class="ml-auto" @click="$emit('onContinue')" :disabled="isDisabled || isBusy">
      <v-icon name="spinner" spin v-if="isBusy"></v-icon>
      {{ nextLabel }}
    </b-button>
  </div>
</template>

<script>
import { SchoolCategories } from '../../../helpers/enum';
import Toggle from '../../components/Form/Toggle';

export default {
  SchoolCategories,
  props: {
    nextLabel: {
      type: String,
      default: 'Next'
    },
    showBack: {
      type: Boolean,
      default: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isBusy: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Toggle
  },
  data() {
    return {

    };
  }
}
</script>
<style lang="scss">
  @import "../../../assets/scss/shared.scss";

  .action-row {
    display: flex;
    justify-content: flex-start;
    background-color: $white;
    padding: 20px;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

</style>
