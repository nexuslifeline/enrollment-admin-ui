<template>
  <ReportContent
    title="Collection Report">
    <template v-slot:filters>
      <b-form-input
        type="text"
        placeholder="Search"
      >
      </b-form-input>
      <b-form-datepicker
        :date-format-options="{
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          weekday: 'short',
        }"
        class="mt-2"
      />
      <b-form-datepicker
        :date-format-options="{
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          weekday: 'short',
        }"
        class="mt-2"
      />
       <b-button
          class="mt-2"
          variant="outline-primary"
          size="sm"
          block
          @click="previewCollection()"
          ><v-icon name="print" /> Preview</b-button
        ></b-button>
    </template>
    <template v-slot:content>
      <!--<PaymentList
        :showAddButton="false"
        :showRowActionButton="false"
        :showPrintPreviewButton="true"
        />-->
    </template>
  </ReportContent>
</template>

<script>
import PaymentList from '../payment/PaymentList';
import ReportContent from '../../components/PageContainer/ReportContainer';

export default {
  name: 'Collection',
  components:{
    PaymentList,
    ReportContent
  },
  methods: {
    previewCollection() {

    }
  }
}
</script>

<style lang="scss">
  .collection__main-container {
    width: 100%;
    height: 100%;
  }
</style>