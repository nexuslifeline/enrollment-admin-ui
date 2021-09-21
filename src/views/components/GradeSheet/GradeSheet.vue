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
          <template v-for="(student, idx) in students">
            <tr :key="idx">
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
                    <BulletedContent :items="['Paul Christian Rueda', 'SN: 190121-0111']" />
                  </div>
                </div>
              </td>
              <template v-for="period in gradingPeriods">
                <td :key="period.id" class="cell__input-no-padding">
                  <!-- change second arg to setudent id, temporary I did passed idx for testing -->
                  <input
                    type="number"
                    class="cell__input"
                    @input="() => onGradeInput({ gradePeriodId: period.id, studentId: idx, rowIndex: idx })"
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
export default {
  props: {
    subjectId: {
      type: [String, Number]
    },
    sectionId: {
      type: [String, Number]
    }
  },
  data() {
    return {
      lastRowIndex: null,
      busyRow: [],
      currentPage: 1,
      hasMore: true,
      isLoadingMore: false,
      gradingPeriods: [ // this is for demo only, should change this to actual data from api response
        {
          id: 1,
          name: 'Prelim'
        },
        {
          id: 2,
          name: 'Midterm'
        },
        {
          id: 3,
          name: 'Finals'
        }
      ],
      students: []
    }
  },
  mounted() {
    const infiniteScroll = this.$refs.infiniteScroll;
    infiniteScroll.addEventListener('scroll', () => {
      if(infiniteScroll.scrollTop + infiniteScroll.clientHeight >= infiniteScroll.scrollHeight) {
        this.loadMore();
      }
    });

  },
  methods: {
    loadMore(reset) {
      if (!this.hasMore || this.isLoadingMore) {
        return;
      }

      this.isLoadingMore = true;

      console.log('reload student list in GET /sections/:id/subjects/:id/academic-records')
      setTimeout(() => { // this is just to replicate the GET http request, change this to actual http request once api is available
        if (reset) { // we need to reset if section id has changed
          // passed data here without pushing/concat to students
          this.currentPage = 1;
        } else {
          // concat/append data here to students
          this.currentPage = this.currentPage + 1;
        }

        this.students = Array.from({ length: 150 * this.currentPage }); // this is for test purpose only, remove this line if GET request is already added
        const meta = { lastPage: 5 }; // this is for test purpose only, remove this line if GET request is already added

        this.hasMore = this.currentPage !== meta.lastPage;
        this.isLoadingMore = false;
      }, 1000);
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
    saveGrade({ gradePeriodId, studentId, rowIndex }) {
      console.log('gradePeriodId', gradePeriodId)
      console.log('studentId', studentId)
      console.log('rowIndex', rowIndex)
      // PUT/PATCH grade here

      // before the request, make the row busy
      this.busyRow = [rowIndex];
      // PUT /sections/:id/subjects/:id/academic-records/:id/grade-periods/:id

      // after the request remove busy state
      // just to replicate the request delay, will use setTimeout here
      setTimeout(() => this.busyRow = [], 450);
    },
    debounceGradeInput: debounce(function (payload) {
      this.saveGrade(payload)
    }, 650)
  },
  watch: {
    sectionId: {
      immediate: true,
      handler() {
        this.loadMore(true);
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