<template>
  <div class="collection__main-container">
    <PaymentList
      :showAddButton="false"
      :showRowActionButton="false"
      :showPrintPreviewButton="true" />
  </div>
</template>

<script>
import  PaymentList  from "../payment/PaymentList";
export default {
  name: 'Collection',
  components:{
    PaymentList
  }

}
</script>

<style lang="scss">
  .collection__main-container {
    width: 100%;
    height: 100%;
  }
</style>