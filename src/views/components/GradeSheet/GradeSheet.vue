<template>
  <div class="outer__container">
    <div class="table__container" ref="infiniteScroll">
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
            <tr :key="idx" @click="lastRowIndex = idx">
              <td class="cell__sticky cell__center">{{ idx + 1 }}</td>
              <td class="cell__sticky">
                <div class="cell__student-headline">
                  <AvatarMaker
                    :avatarId="idx"
                    :size="25"
                    :text="'PH'"
                    :src="''"
                  />
                  <div class="cell__name">
                    <BulletedContent :items="[academicRecord.student && academicRecord.student.name || '', `SN: ${academicRecord.student && academicRecord.student.studentNo || 'N/A'}`]" />
                  </div>
                </div>
              </td>
              <template v-for="period in gradingPeriods">
                <td :key="period.id" class="cell__input-no-padding">
                  <!-- change second arg to setudent id, temporary I did passed idx for testing -->
                  <input
                    :value="getGrade(period.id, academicRecord)"
                    type="number"
                    class="cell__input"
                    @input="onGradeInput({ gradePeriodId: period.id, academicRecordId: academicRecord.id, rowIndex: idx, grade: $event.target.value, academicRecord })"
                  />
                </td>
              </template>
              <td class="cell__input-no-padding">
                <input type="text" class="cell__input" :style="{ textAlign: 'left' }" />
              </td>
              <template v-if="busyRow.includes(idx)">
                <td class="cell__loader">
                  <b-spinner type="border" small />
                  <span class="ml-2 text-muted">Saving...</span>
                </td>
              </template>
            </tr>
          </template>
          <template v-if="isLoadingMore">
            <tr>
              <td>&nbsp;</td>
              <td class="cell__loader">
                <b-spinner type="border" small />
                <span class="ml-2 text-muted">Loading...</span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import { AcademicRecordApi, GradingPeriodApi } from '../../../mixins/api';
import { showNotification } from '../../../helpers/forms';
export default {
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
    }
  },
  data() {
    return {
      lastRowIndex: null,
      busyRow: [],
      currentPage: 1,
      hasMore: true,
      isLoadingMore: false,
      gradingPeriods: [],
      academicRecords: []
    }
  },
  created() {
    if(this.sectionId || this.subjectId) {
      this.loadMore()
    }
    this.loadGradingPeriods()
  },
  mounted() {
    const infiniteScroll = this.$refs.infiniteScroll;
    infiniteScroll.addEventListener('scroll', () => {
      this.doScrollCheck();
    });

    if (!this.isVerticalScrollVisible()) {
      this.makeScrollable();
    }
  },
  methods: {
    isVerticalScrollVisible() {
      const infiniteScroll = this.$refs.infiniteScroll;
      return infiniteScroll.scrollHeight > infiniteScroll.clientHeight;
    },
    makeScrollable() {
      setTimeout(() => {
        if (this.isVerticalScrollVisible()) return;
        if (!this.hasMore) return;
        this.doScrollCheck();
        //commented the next line it cause infinite loop
        // this.makeScrollable();
      }, 250);
    },
    doScrollCheck() {
      const infiniteScroll = this.$refs.infiniteScroll;
      if(infiniteScroll.scrollTop + infiniteScroll.clientHeight >= infiniteScroll.scrollHeight) {
        if(this.sectionId && this.subjectId)
        this.loadMore();
      }
    },
    loadMore(reset) {

      if (!this.hasMore || this.isLoadingMore) {
        return;
      }

      this.isLoadingMore = true;

      console.log('reload student list in GET /sections/:id/subjects/:id/academic-records')
      // setTimeout(() => { // this is just to replicate the GET http request, change this to actual http request once api is available
      //   if (reset) { // we need to reset if section id has changed
      //     // passed data here without pushing/concat to academicRecords
      //     this.currentPage = 1;
      //   } else {
      //     // concat/append data here to academicRecords
      //     this.currentPage = this.currentPage + 1;
      //   }

      //   this.academicRecords = Array.from({ length: 25 * this.currentPage }); // this is for test purpose only, remove this line if GET request is already added
      //   const meta = { lastPage: 10 }; // this is for test purpose only, remove this line if GET request is already added

      //   this.hasMore = this.currentPage !== meta.lastPage;
      //   this.isLoadingMore = false;
      // }, 1000);

      const params = { paginate: true }

      this.getAcademicRecordsOfSubjectOfSection(this.sectionId, this.subjectId, params).then(({ data }) => {
        console.log(data)
        if (reset) { // we need to reset if section id has changed
          // passed data here without pushing/concat to academicRecords
          this.currentPage = data.meta.currentPage;
        } else {
          // concat/append data here to academicRecords
          this.currentPage = this.currentPage + 1;
        }

        this.academicRecords = data.data
        this.hasMore = this.currentPage !== data.meta.lastPage;
        this.isLoadingMore = false;
      }).catch((error) => {
        this.isLoadingMore = false;
        showNotification(this, 'danger', 'Error in fetching data.')
      });
    },
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
      // console.log('gradePeriodId', gradePeriodId)
      // console.log('studentId', studentId)
      // console.log('rowIndex', rowIndex)
      // PUT/PATCH grade here

      // before the request, make the row busy
      this.busyRow = [rowIndex];
      // PUT /sections/:id/subjects/:id/academic-records/:id/grade-periods/:id
      // after the request remove busy state
      // just to replicate the request delay, will use setTimeout here
      this.updateAcacdemicRecordSubjectGrade(this.sectionId, this.subjectId, academicRecordId, gradePeriodId, { grade }).then(({ data }) => {
        academicRecord.studentGrades[0] = data
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
    loadGradingPeriods() {
      if(!this.section){
        return
      }

      const { schoolYearId, schoolCategoryId, semesterId } = this.section
      const params = { paginate: false, schoolYearId, schoolCategoryId, semesterId }
      this.getGradingPeriodList(params).then(({ data }) => {
        this.gradingPeriods = data
      })
    },
    getGrade(periodId, academicRecord) {
      //get grades array of student grades array
      //structure on response

      //  studentgrades: [
      //    0: {
      //           id,
      //         grades: [
      //             {
      //               id,
      //               pivot: {
      //                 gradingperiodid,
      //                 grade
      //               }
      //             }
      //         ]
      //   }
      // ]

      const grades = academicRecord?.studentGrades[0]?.grades || null
      if(grades) {
        //find if has grade on period
        const g = grades.find(g => g.id === periodId)
        if(g) {
          //return grade
          return g?.pivot?.grade || null
        }
      }
      return null
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

  .outer__container {
    overflow: hidden;
    width: 100%;
    height: 100%;
    border: 1px solid $light-gray-10;
  }

  .table__container {
    width: 100%;
    height: calc(100vh - 150px);
    max-height: calc(100vh - 150px);
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
      background: $dark-gray-500;
      color: $white;
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
      min-width: 350px;
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

  .cell__loader {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: $white;
    opacity: .85;
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>