<template>
  <div>
    Skip this for the meantime, need to review first the Section & Schedule management.

    <ActionRow
      :showBack="true"
      nextLabel="Finish"
      @onContinue="onContinue"
      @onBack="onBack"
    />
  </div>
</template>

<script>
import ActionRow from './ActionRow';
export default {
  components: {
    ActionRow
  },
  data() {
    return {
    };
  },
  methods: {
    onSelectStage(idx) {
      if (idx < this.selectedIndex) {
        this.selectedIndex = idx;
      }
    },
    onContinue() {

    },
    onBack() {
      this.$emit('onBack')
    }
  }
}
</script>
<style lang="scss">
  @import "../../../assets/scss/shared.scss";

</style>
