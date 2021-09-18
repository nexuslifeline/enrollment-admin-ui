<template>
  <div class="outer__container">
    <div class="table__container">
      <table>
        <thead>
          <tr>
            <th class="cell__long">Name</th>
            <th class="cell__long">Course</th>
            <template v-for="period in gradingPeriods">
              <th :key="period.id" class="cell__small">{{ period.name }}</th>
            </template>
            <th class="cell__extra-long">Remarks</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(student, idx) in Array.from({ length: 150 })">
            <tr :key="idx">
              <td class="cell__sticky">
                <div class="cell__student-headline">
                  <AvatarMaker
                    :avatarId="idx"
                    :size="36"
                    :text="'PH'"
                    :src="''"
                  />
                  <div class="cell__name">
                    <span>
                      Paul Christian Rueda
                    </span>
                    <BulletedContent :items="['chrisrueda14@yahoo.com', 'SN: 190121-0111']" />
                  </div>
                </div>
              </td>
              <td>
                <div>
                  Bachelor of Science in Information Technology
                </div>
                <BulletedContent :items="['First Year College', 'First Semester']" />
              </td>
              <template v-for="period in gradingPeriods">
                <td :key="period.id">
                  <input type="number" class="cell__input" @input="() => onGradeInput(period.id, student.id)" />
                </td>
              </template>
               <td>
                <input type="text" class="cell__input" />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
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
      ]
    }
  },
  methods: {
    onGradeInput(gradePeriodId, studentId) {
      console.log('gradePeriodId', gradePeriodId)
      console.log('studentId', studentId)
      // PUT/PATCH grade here
    }
  },
  watch: {
    sectionId: function(nVal, oVal) {
      if (nVal !== oVal) {
        console.log('reload student list')
      }
    },
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .outer__container {
    overflow: hidden;
    width: 100%;
    height: 100%;
    border: 0;
  }

  .table__container {
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 124px);
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
    padding: 6px 10px;
    border-bottom: 1px solid $light-gray-100;
    min-width: 200px;
    color: $dark-gray-500;
    background-color: $white;
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
  }

  thead {
    .cell__long {
      left: 0;
      min-width: 370px;

      &:first-child {
        z-index: 1;
      }
    }

    .cell__extra-long {
      min-width: 470px;
    }

    .cell__medium {
      left: 0;
      min-width: 270px;
    }

    .cell__small {
      left: 0;
      min-width: 180px;
    }
  }

  tbody {
    .cell__sticky {
      position: -webkit-sticky; /* for Safari */
      position: sticky;
      left: 0;
      background: $white;
      border-right: 1px solid #CCC;
    }
  }

  .cell__student-headline {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .cell__name {
    margin-left: 10px;
  }

  .cell__input {
    border-radius: 5px;
    padding: 5px;
    border: 1px solid $light-gray-10;
    text-align: right;
    width: 100%;
  }

</style>