<template>
  <div>
    <div>
      {{ $options.formatAddress(((data.student && data.student.address) || data.address) || null) }}
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
    },
    created() {
      console.log('created', this.data)
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
</style>