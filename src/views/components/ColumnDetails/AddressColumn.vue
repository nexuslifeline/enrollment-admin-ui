<template>
  <div>
    <div>
      {{ $options.formatAddress((data.student && data.student.address) || null) }}
    </div>
  </div>
</template>

<script>
  import { formatAddress } from '../../../helpers/utils';
  export default {
    formatAddress,
    props: {
      data: {
        type: [Object]
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
</style>