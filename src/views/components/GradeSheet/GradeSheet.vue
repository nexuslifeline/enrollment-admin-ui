<template>
  <div class="outer__container">
    <div
      class="table__container"
      v-infinite-scroll="loadMore"
      :infinite-scroll-disabled="isBusy"
      :infinite-scroll-distance="10">
      <table>
        <thead>
          <tr>
            <th class="cell__center">#</th>
            <th class="cell__long">Name</th>
            <template v-for="period in gradingPeriods">
              <th :key="period.id" class="cell__extra-small cell__center">{{ period.name }}</th>
            </template>
            <th class="cell__extra-long">Remarks</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(academicRecord, idx) in academicRecords">
            <tr :key="idx" @click="lastRowIndex = idx" >
              <td class="cell__sticky cell__center">{{ idx + 1 }}</td>
              <td class="cell__sticky" :style="{ zIndex: 0 }">
                <div class="cell__student-headline">
                  <AvatarMaker
                    :avatarId="idx"
                    :size="25"
                    :text="getInitial(academicRecord.student)"
                    :src="getPhotoPath(academicRecord.student)"
                  />
                  <div class="cell__name">
                    <BulletedContent :items="[academicRecord.student && academicRecord.student.name || '', `SN: ${academicRecord.student && academicRecord.student.studentNo || 'N/A'}`]" />
                  </div>
                  <button class="dropdown__toggle" @click.stop="onDropdownShown(idx), makeFront($event)" @blur="makeBehind($event)">
                    <BIconThreeDotsVertical  />
                    <ul v-if="isDropdownShown.includes(idx)" class="dropdown__menu">
                      <li class="dropdown__menu-item" @click="setDropStudent(academicRecord)">Mark as Dropped</li>
                      <li class="dropdown__menu-item" @click="onEditGrade(academicRecord)">Edit Grades</li>
                    </ul>
                  </button>
                </div>
              </td>
              <template v-for="period in gradingPeriods">
                <td :key="period.id" class="cell__input-no-padding">
                  <!-- change second arg to setudent id, temporary I did passed idx for testing -->
                  <input
                    :value="getGrade(period.id, academicRecord)"
                    type="number"
                    class="cell__input"
                    :disabled="isReadOnly"
                    @input="onGradeInput({ gradePeriodId: period.id, academicRecordId: academicRecord.id, rowIndex: idx, grade: $event.target.value, academicRecord })"
                  />
                </td>
              </template>
              <td class="cell__input-no-padding">
                <input
                  type="text"
                  class="cell__input" :style="{ textAlign: 'left' }"
                  :disabled="isReadOnly" />
              </td>
              <template v-if="busyRow.includes(idx)">
                <td class="cell__overlay-row">
                  <b-spinner type="border" small />
                  <span class="ml-2 text-muted">Saving...</span>
                </td>
              </template>
              <template v-if="checkDropStatus(academicRecord)">
                <td class="cell__overlay-row">
                  <span class="ml-2 text-danger">Dropped</span>
                </td>
              </template>
            </tr>
          </template>
          <template v-if="isBusy">
            <tr>
              <td>&nbsp;</td>
              <td class="cell__overlay-row">
                <b-spinner type="border" small />
                <span class="ml-2 text-muted">Loading...</span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <ConfirmationModal
      :isShown.sync="isShowDropStudent"
      @onCancel="isShowDropStudent=false"
      title="Drop Student"
      @onYes="onDropStudent"
      :isConfirmBusy="isProcessing">
      <template #modal-body>
        Are you sure you want to dropped student {{ selectedAcademicRecordStudentName }} ?
      </template>
    </ConfirmationModal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import { AcademicRecordApi, GradingPeriodApi } from '../../../mixins/api';
import { showNotification, formatNumber, validate } from '../../../helpers/forms';
import ConfirmationModal from '../ConfirmationModal'
import { getFilePath } from '../../../helpers/utils'
export default {
  formatNumber,
  getFilePath,
  components: { ConfirmationModal },
  mixins: [
    AcademicRecordApi, GradingPeriodApi
  ],
  props: {
    subjectId: {
      type: [String, Number]
    },
    sectionId: {
      type: [String, Number]
    },
    section: {
      type: [Object]
    },
    isReadOnly: {
      type: [Boolean],
      default: false
    }
  },
  data() {
    return {
      lastRowIndex: null,
      busyRow: [],
      currentPage: 1,
      hasMore: true,
      isBusy: false,
      gradingPeriods: [],
      academicRecords: [],
      isDropdownShown: [],
      selectedAcademicRecord: {},
      isShowDropStudent: false,
      isProcessing: false
    }
  },
  created() {
    if(this.sectionId || this.subjectId) {
      this.loadMore()
    }
    this.loadGradingPeriods()
  },
  mounted() {
    window.addEventListener('click', this.hideDropdown);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.hideDropdown);
  },
  computed: {
    selectedAcademicRecordStudentName() {
      return this.selectedAcademicRecord?.student?.name || ''
    }
  },
  methods: {
    hideDropdown() {
      this.isDropdownShown = [];
    },
    setDropStudent(academicRecord) {
      this.isShowDropStudent = true
      this.selectedAcademicRecord = academicRecord
    },
    onDropStudent() {
      // console.log('academicRecord', academicRecord)
      const { id:academicRecordId } = this.selectedAcademicRecord
      const payload = {
        isDropped: 1
      }
      this.isProcessing = true
      this.updateAcademicRecordSubject(academicRecordId, this.subjectId, payload).then(({ data }) => {
        const subject = this.selectedAcademicRecord.subjects.find( ({ pivot: v }) => v.subjectId === this.subjectId && v.sectionId === this.sectionId)
        // console.log(subject)
        subject.pivot.isDropped = 1
        this.isProcessing = false
        this.isShowDropStudent = false
      }).catch((error) => {
        const errors = error.response.data.errors
        validate(null, errors, this)
        this.isProcessing = false
        this.isShowDropStudent = false
      });
    },
    onEditGrade() {
      console.log('skip this first, no ui yet')
    },
    makeFront(e) {
      const elem = e.target.closest('td');
      if (elem) {
        elem.style.zIndex = 99999;
      }
    },
    makeBehind(e) {
      const elem = e.target.closest('td');
      if (elem) {
        elem.style.zIndex = 0;
      }
    },
    onDropdownShown(idx) {
      if (this.isDropdownShown.includes(idx)) {
        this.isDropdownShown = [];
      } else {
        this.isDropdownShown = [idx];
      }
    },
    loadMore: debounce(function (reset) {
      if (!this.sectionId && !this.subjectId) {
        return;
      }

      if (!this.hasMore || this.isBusy) {
        return;
      }

      this.isBusy = true;

      // NOTE! FIX ME!
      // for the meantime, I just set it to 20 records per page just to make sure scroll is visible if there are multiple pages
      const params = { paginate: true, perPage: 20 };

      this.getAcademicRecordsOfSubjectOfSection(this.sectionId, this.subjectId, params).then(({ data }) => {
        if (reset) { // we need to reset if section id has changed
          // passed data here without pushing/concat to academicRecords
          this.currentPage = data.meta.currentPage;
          this.academicRecords = data.data
        } else {
          // concat/append data here to academicRecords
          this.currentPage = this.currentPage + 1;
           this.academicRecords.push(...data.data)
        }
        this.hasMore = this.currentPage !== data.meta.lastPage;
        this.isBusy = false;
      }).catch(() => {
        this.isBusy = false;
        showNotification(this, 'danger', 'Error in fetching data.')
      });
    }, 250),
    onGradeInput(payload) {
      if (payload.rowIndex === this.lastRowIndex || this.lastRowIndex === null) {
        this.debounceGradeInput(payload);
        this.lastRowIndex = payload.rowIndex;
        return;
      }

      this.saveGrade(payload);
      this.lastRowIndex = payload.rowIndex;

    },
    saveGrade({ gradePeriodId, academicRecordId, rowIndex, grade, academicRecord }) {
      // before the request, make the row busy
      this.busyRow = [rowIndex];
      this.updateAcademicRecordSubjectGrade(this.sectionId, this.subjectId, academicRecordId, gradePeriodId, { grade }).then(({ data }) => {
        // academicRecord.studentGrades[0] = data\]

        const g = academicRecord.grades.find(g => g.pivot.gradingPeriodId === gradePeriodId && g.subjectId === this.subjectId )
        if(g) {
          this.$set(g, 'pivot', { gradingPeriodId: gradePeriodId, grade: this.$options.formatNumber(grade) })
          //update grade on array
        }
        else{
          //push on array
          academicRecord.grades.push({ ...data, pivot: { gradingPeriodId: gradePeriodId, grade: this.$options.formatNumber(grade) }})
        }

        this.busyRow = []
      }).catch((error) => {
        this.busyRow = []
        const errors = error.response.data.errors
        Object.keys(errors).forEach((key) => {
          showNotification(this, 'danger', errors[key][0])
        });

      });
    },
    debounceGradeInput: debounce(function (payload) {
      this.saveGrade(payload)
    }, 650),
    loadGradingPeriods: debounce(function () {
      if(!this.section){
        return
      }

      const { schoolYearId, schoolCategoryId, semesterId } = this.section
      const params = { paginate: false, schoolYearId, schoolCategoryId, semesterId }
      this.getGradingPeriodList(params).then(({ data }) => {
        this.gradingPeriods = data
      })
    }, 250),
    getGrade(periodId, academicRecord) {
      const grades = academicRecord?.grades || null
      if(grades) {
        //find if has grade on period
        const g = grades.find(g => g.pivot.gradingPeriodId === periodId)
        if(g) {
          //return grade)
          return g?.pivot?.grade || null
        }
      }
      return null
    },
    checkDropStatus(academicRecord) {
      console.log('academicRecord', academicRecord)
      return academicRecord?.subjects?.some(
        ({ pivot: v }) => v.sectionId === this.sectionId && v.subjectId === this.subjectId && v.isDropped
      );
    },
    getInitial(student) {
      const { firstName, lastName } = student
      return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`
    },
    getPhotoPath(student) {
      const { photo } = student
      if(!photo) {
        return ''
      }

      return this.$options.getFilePath(photo.hashName)
    }
  },
  watch: {
    sectionId: {
      // immediate: true,
      handler() {
        this.hasMore = true
        this.loadMore(true);
        this.loadGradingPeriods();
      }
    },
    subjectId: {
      // immediate: true,
      handler() {
        this.hasMore = true
        this.loadMore(true);
        this.loadGradingPeriods();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .dropdown__toggle {
    background: none;
    border: 0;
    outline: none;
    margin-left: auto;
    position: relative;
  }

  .dropdown__menu {
    list-style: none;
    position: absolute;
    background-color: $white;
    padding: 3px 0;
    min-width: 150px;
    border-radius: 4px;
    border: 1px solid $light-gray-10;
  }

  .dropdown__menu-item {
    text-align: left;
    border-bottom: 1px solid $light-gray-100;
    padding: 3px 10px;

    &:last-child {
      border-bottom: 0;
    }

    &:hover {
      background-color: $light-gray-100;
    }
  }

  .outer__container {
    // overflow: hidden;
    width: 100%;
    height: 100%;
    border: 1px solid $light-gray-10;
  }

  .table__container {
    max-width: 100%;
    max-height: 100%;
    height: calc(100vh - 165px);
    // max-height: calc(100vh - 150px);
    overflow: scroll;
    position: relative;
    border: 0;
  }

  table {
    position: relative;
    border-collapse: collapse;
    min-width: 100%;
    border: 0;
  }

  td,
  th {
    padding: 5px 10px;
    border-bottom: 1px solid $light-gray-100;
    color: $dark-gray-500;
    background-color: $white;
    border-right: 1px solid $light-gray-10;

    &.cell__center {
      text-align: center;
    }
  }


  thead {
    th {
      position: -webkit-sticky; /* for Safari */
      position: sticky;
      top: 0;
      background-color: $light-gray;
      // color: $white;
      font-weight: normal;
    }

    td, th {
      padding: 3.5px 10px;
      font-weight: 500;
    }

  }

  thead {
    .cell__long {
      left: 0;
      min-width: 410px;
    }

    .cell__extra-long {
      min-width: 490px;
    }

    .cell__medium {
      left: 0;
      min-width: 270px;
    }

    .cell__small {
      left: 0;
      min-width: 190px;
    }

    .cell__extra-small {
      left: 0;
      min-width: 150px;
    }

    :nth-child(-n + 2) { // first 2 child
      z-index: 1;
    }


  }

  tr {
    position: relative;
  }

  tbody {
    .cell__sticky {
      position: -webkit-sticky; /* for Safari */
      position: sticky;
      left: 0;
      background: $white;
      border-right: 1px solid $light-gray-10;
    }

    .cell__sticky-action {
      position: -webkit-sticky; /* for Safari */
      position: sticky;
      top: 0;
      background: $white;
      border-left: 1px solid $light-gray-10;
    }

    tr:nth-child(even) {
      td, th {
        background-color: $light-gray-100;
      }
    }

    // tr:focus-within {
    //   td, th {
    //     background-color: $light-blue;
    //   }
    // }
  }

  .cell__student-headline {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .cell__name {
    margin-left: 5px;
  }

  .cell__input {
    border: 0;
    text-align: center;
    width: 100%;
    outline: none;
    min-height: 30px;
    background-color: transparent;
    font-weight: 500;
    min-width: none;
    padding: 0 12px;
  }


  input.cell__input::-webkit-outer-spin-button,
  input.cell__input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input.cell__input[type=number] {
    -moz-appearance: textfield;
  }

  .cell__input-no-padding {
    padding: 0;
  }

  .cell__overlay-row {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: $white;
    opacity: .7;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 35px;
  }

</style>