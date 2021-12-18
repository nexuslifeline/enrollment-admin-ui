<template>
  <div>
    <div class="grade-list__container">
      <div class="list__overlay"  v-if="isLoading" >
        <BSpinner />
      </div>
      <template v-for="(item, idx) in billingItems">
        <div :key="idx" class="grade-list__row">
          <div class="grade-list__cell grade-list__cell-name">
            <template v-if="item.term" >
              {{ item.term.name }}
            </template>
            <template v-else-if="item.schoolFee">
              {{ item.schoolFee.name }}
            </template>
            <template v-else>
              {{ item.item }}
            </template>
          </div>
          <div class="grade-list__cell grade-list__cell-grade">
            {{ item.amount }}
          </div>
          <template v-if="busyRow.includes(idx)">
            <div class="grade-list__row-overlay">
              <b-spinner type="border" small />
            </div>
          </template>
        </div>
      </template>
      <!-- <button v-if="hasMore && !isLoading" @click="onShowMore" class="grade-list__more">
        Show more
      </button> -->
    </div>
    <div class="total-items">
      Total: {{ $options.formatNumber(totalAmount) }}
    </div>
  </div>
</template>
<script>
import { AcademicRecordApi, BillingApi, StudentGradeApi } from '../../../mixins/api';
import { getFilePath } from '../../../helpers/utils'
import debounce from 'lodash/debounce'
import ConfirmationModal from '../../components/ConfirmationModal'
import { formatNumber } from '../../../helpers/forms';
export default {
  getFilePath,
  formatNumber,
  components: { ConfirmationModal },
  props: {
    billingId: {
      type: [String, Number]
    },
  },
  mixins: [AcademicRecordApi, StudentGradeApi, BillingApi],
  data() {
    return {
      visibleDropdown: [],
      busyRow: [],
      billingItems: [],
      nextPage: 1,
      perPage: 15,
      hasMore: true,
      isLoading: false,
      isShowDropStudent: false,
      selectedAcademicRecord: null,
      isProcessing: false
    }
  },
  created() {
    this.loadMore()
  },
  mounted() {
    window.addEventListener('click', this.hideDropdown);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.hideDropdown);
  },
  methods: {
    loadMore: debounce(function () {
      const { billingId } = this
      const params = { paginate: false}

      this.isLoading = true
      this.getBillingItemsOfBilling(billingId).then(({ data }) => {
        this.billingItems = data
        this.isLoading = false
      }).catch((error) => {
        const errors = error.response.data.errors
        console.log(errors)
        this.isLoading = false
      });
    },500),
 
    onEditGrade() {
      // no ui yet, just skip for the meantime
    },
    onDropdownSelect(idx) {
      if (this.visibleDropdown.includes(idx)) {
        this.visibleDropdown = [];
      } else {
        this.visibleDropdown = [idx];
      }
    },
    hideDropdown() {
      this.visibleDropdown = [];
    },
    onShowMore() {
      this.loadMore(false)
    },
    getStudentInitial(data) {
      const { firstName, lastName } = data
      return `${firstName && firstName.charAt(0) || ''}${lastName && lastName.charAt(0) || ''}`
    },
    getStudentPhoto(data) {
      const { photo } = data
      if(!photo) {
        return ''
      }

      return this.$options.getFilePath(photo.hashName)
    },
    checkDropStatus(academicRecord) {
      return academicRecord?.subjects?.some(
        ({ pivot: v }) => v.sectionId === this.sectionId && v.subjectId === this.subjectId && v.isDropped
      );
    },
    setDropStudent(academicRecord) {
      this.isShowDropStudent = true
      this.selectedAcademicRecord = academicRecord
    },
    getCurrentGrade(academicRecord) {
      const { grades } = academicRecord
      if(!grades.length > 0) {
        return 'N/A'
      }
      const current = grades.reduce((prev, current) => {
        if(!prev) {
          return current
        }
        return current.pivot.gradingPeriodId > prev.pivot.gradingPeriodId ? current : prev
      }, null)

      return current.pivot.grade
    }
  },
  computed: {
    selectedAcademicRecordStudentName() {
      return this.selectedAcademicRecord?.student?.name || ''
    },
    totalAmount() {
      return this.billingItems.reduce((total, current) => {
        total = total + parseFloat(current.amount)
        return total
      }, 0)
    }
  },
};
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/_shared.scss';

  .grade-list__container {
    width: 100%;
    border: 1px solid $light-gray-10;
    border-radius: 3px;
    position: relative;
    // min-height: 100px;

    .grade-list__row:last-child {
      border-bottom: 0;
    }
  }

  .list__overlay {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0.7;
    background-color: whitesmoke;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .grade-list__row {
    display: flex;
    width: 100%;
    border-bottom: 1px solid $light-gray-10;
    position: relative;
  }

  .grade-list__cell {
    padding: 7px 10px;
  }

  .grade-list__cell-name {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
  }

  .grade-list__cell-grade {
    width: 120px;
    text-align: right;
    border-left: 1px solid $light-gray-10;
  }

  .grade-list__more {
    border: 0;
    background: none;
    outline: none;
    padding: 7px 10px;
    text-align: center;
    color: $blue;
    width: 100%;

    &:hover {
      background-color: $light-blue-10;
    }
  }

  .grade-list__dropdown {
    margin: 0;
    margin-left: auto;
    padding: 0;
    background: none;
    outline: none;
    border: 0;
    position: relative;
  }

  .grade-list__menu {
    position: absolute;
    min-width: 140px;
    border-radius: 4px;
    border: 1px solid $light-gray-10;
    background-color: $white;
    top: 8px;
    right: 12px;
    list-style: none;
    padding: 3px 0;
    z-index: 2;
  }

  .grade-list__menu-item {
    margin-left: 0;
    text-align: left;
    padding: 5px 10px;
    border-bottom: 1px solid $light-gray-100;

    &:hover {
      background-color: $light-gray-100;
    }

    &:last-child {
      border-bottom: 0;
    }
  }

  .grade-list__row-overlay {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    height: 100%;
    background-color: $white;
    opacity: .8;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .total-items {
    display: flex;
    justify-content: flex-end;
    padding: 0 10px;
    margin-top: 10px;
    font-weight: bold;
  }
</style>