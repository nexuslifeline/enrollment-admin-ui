<template>
  <ReportContent
    title="Collection Report"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="previewCollection"
    :isBusy="isLoading"
    :showPlaceholder="!isFileReady"
    :filterVisible="isFilterVisible">
    <template v-slot:filters>
      <b-form-input
        type="text"
        placeholder="Search"
        v-model="filters.payment.criteria"
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
        placeholder="Period Start Date"
        v-model="filters.payment.dateFrom"
      />
      <b-form-datepicker
        :date-format-options="{
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          weekday: 'short',
        }"
        class="mt-2"
        placeholder="Period End Date"
        v-model="filters.payment.dateTo"
      />
       <b-button
          class="mt-4"
          variant="primary"
          size="sm"
          block
          @click="previewCollection"
          ><v-icon name="print" /> Preview</b-button
        ></b-button>
    </template>
    <template v-slot:content>
      <ReportViewer v-if="isFileReady" :file="file" />
    </template>
  </ReportContent>
</template>

<script>
import PaymentList from '../payment/PaymentList';
import ReportContent from '../../components/PageContainer/ReportContainer';
import ReportViewer from '../../components/ReportViewer/ReportViewer';
import { ReportApi } from '../../../mixins/api';

export default {
  name: 'Collection',
  mixins: [ReportApi],
  components:{
    PaymentList,
    ReportContent,
    ReportViewer
  },
  data() {
    return {
      file: {},
      isLoading: false,
      isFileReady: false,
      isFilterVisible: true,
      filters: {
        payment: {
          criteria: null,
          dateFrom: new Date(),
          dateTo: new Date(),
        },
      },
    };
  },
  methods: {
    previewCollection() {
      const { dateFrom, dateTo, criteria } = this.filters.payment;
      this.isLoading = true;
      this.isFileReady = false;
      this.previewCollectionReport({ dateFrom, dateTo, criteria }).then((response) => {
        this.file.type = response.headers.contentType;
        const file = new Blob([response.data], { type: 'application/pdf' });
        const reader = new FileReader();
        reader.onload = (e) => {
          this.file.src = e.target.result;
          this.isLoading = false;
          this.isFileReady = true;
        }
        reader.readAsDataURL(file);
      });
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