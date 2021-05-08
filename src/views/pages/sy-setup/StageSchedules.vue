<template>
  <div>
    Feature not available.

    <ActionRow
      :showBack="true"
      nextLabel="Finish and Set as Active"
      @onContinue="onContinue"
      @onBack="onBack"
      :isBusy="isProcessing"
    />
  </div>
</template>

<script>
import ActionRow from './ActionRow';
import { SchoolYearApi } from '../../../mixins/api';
export default {
  components: {
    ActionRow
  },
  mixins: [SchoolYearApi],
  props: {
    schoolYearId: {
      type: [Number, String]
    }
  },
  data() {
    return {
      isProcessing: false
    };
  },
  methods: {
    onSelectStage(idx) {
      if (idx < this.selectedIndex) {
        this.selectedIndex = idx;
      }
    },
    onContinue() {
      this.isProcessing = true
      const { schoolYearId } = this
      this.patchSchoolYear({ isActive: true }, schoolYearId).then(({ data }) => {
        this.isProcessing = false
        this.$router.push({ name: 'School Year' });
      }).catch((error) => {
        const errors = error.response.data.errors;
        showNotification(this, 'danger', 'Error!')
        this.isProcessing = false
      });
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
