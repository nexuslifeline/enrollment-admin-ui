<template>
  <ReportContent
    title="Student Ledger"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="previewLedger"
    :isBusy="isLoading"
    :showPlaceholder="!isFileReady"
    :filterVisible="isFilterVisible">
    <template v-slot:filters>
      <v-select
        :options="options.schoolYears.items"
        :value="filters.ledger.schoolYearItem"
        @input="onSchoolYearFilterChange"
        label="name"
        placeholder="School Year"
        class="mt-2"
        :clearable="false"
      />
      <b-form-datepicker
        :date-format-options="{
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          weekday: 'short',
        }"
        class="mt-2"
        placeholder="As of Date"
        v-model="filters.ledger.asOfDate"
      />
      <SelectPaginated
          class="select-paginated mt-2 "
          @input="getStudentInfo($event)"
          :fetchData="getStudentList"
          placeholder="Select Student"
        >
          <template slot="option" slot-scope="data">
            <div class="select-option">
              <div class="select-option__avatar">
                <b-avatar variant="info" :src="getPhoto(data)"></b-avatar>
              </div>
              <div class="select-option__info">
                <span>{{
                  data.studentNo ? data.studentNo : 'Awaiting Confirmation'
                }}</span>
                <span>{{ data.name }}</span>
                <span>{{ data.email }}</span>
              </div>
            </div>
          </template>
          <template slot="loader">
            <b-spinner label="Loading..." class="loader"></b-spinner>
          </template>
      </SelectPaginated>
      <b-button
        class="mt-4"
        variant="outline-primary"
        size="sm"
        block
        @click="previewLedger"
        ><v-icon name="print" /> Preview</b-button>
    </template>
    <template v-slot:content>
      <ReportViewer v-if="isFileReady" :file="file" />
    </template>
  </ReportContent>
</template>

<script>
import ReportViewer from "../../components/ReportViewer/ReportViewer";
import ReportContent from "../../components/PageContainer/ReportContainer"
import { ReportApi, SchoolYearApi, StudentApi } from '../../../mixins/api';
import SelectPaginated from '../../components/SelectPaginated'
import {
  showNotification,
} from '../../../helpers/forms';

export default {
  components: {  ReportContent, ReportViewer, SelectPaginated },
  mixins: [ StudentApi, SchoolYearApi, ReportApi ],
  data() {
    return {
      isFilterVisible: true,
      isFileReady: false,
      selectedStudent: null,
      isLoading: false,
      file: {
        type: null,
        src: null,
        name: null,
        notes: null,
        isLoading: false,
      },
      filters: {
        ledger: {
          schoolYearId: null,
          schoolYearItem: null,
          asOfDate: new Date(),
        },
      },
      options: {
        schoolYears: {
          items: [],
        },
      },
    }
  },
  created() {
    this.loadSchoolYears()
  },
  methods: {
    previewLedger() {
      this.isFileReady = false
      if (!this.selectedStudent) {
        showNotification(this, 'danger', 'Please select a student.');
        return
      }

      const { id: studentId } = this.selectedStudent

      this.file.type = null;
      this.file.src = null;
      this.file.notes = null;
      this.file.isLoading = true;
      this.file.owner = null;
      this.file.name = 'Student Ledger';

      const { schoolYearId, asOfDate } = this.filters.ledger;

      this.showModalFileViewer = true;
      const params = { schoolYearId, asOfDate };
      this.previewStudentLedger(studentId, params).then((response) => {
        this.file.type = response.headers.contentType;
        const file = new Blob([response.data], { type: 'application/pdf' });
        const reader = new FileReader();
        reader.onload = (e) => (this.file.src = e.target.result);
        reader.readAsDataURL(file);
        this.isFileReady = true
        this.file.isLoading = false;
      });
    },
    getStudentInfo(student) {
      this.file.type = null
      this.file.src = null
      this.file.name = null
      this.file.notes = null
      this.file.isLoading = false
      this.selectedStudent = student;
    },
    onSchoolYearFilterChange(item) {
      const { ledger } = this.filters;
      ledger.schoolYearId = item?.id || 0;
      ledger.schoolYearItem = item;
    },
    loadSchoolYears() {
      const { ledger } = this.filters
      const params = { paginate: false };
      const { schoolYears } = this.options;
      this.getSchoolYearList(params).then(({ data }) => {
        schoolYears.items = data;
        const activeSchoolYear = schoolYears.items.find(
          (e) => e.isActive == 1
        );
        ledger.schoolYearId = activeSchoolYear?.id
        ledger.schoolYearItem = activeSchoolYear
      });
    },
    getPhoto(option) {
      const photo = (option && option.photo && option.photo.hashName) || '';
      return !!photo ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${photo}` : '';
    },
  }
}
</script>

<style lang="scss">
  @import '../../../assets/scss/_shared.scss';

  .student-ledger__main-container {
    width: 100%;
    height: 100%;
  }

  .select-paginated {
    width: 100%;

    @include for-size(phone-only) {
      width: 100%;
    }
    .select-option {
      display: flex;
      justify-content: center;
      align-items: center;

      .select-option__avatar {
        width: auto;
      }

      .select-option__info {
        flex: 1;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>