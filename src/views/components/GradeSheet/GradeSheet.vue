<template>
  <div class="outer__container">
    <div class="table__container">
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
          <template v-for="(student, idx) in Array.from({ length: 150 })">
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
                  <input type="number" class="cell__input" @input="() => onGradeInput(period.id, student.id)" />
                </td>
              </template>
               <td class="cell__input-no-padding">
                <input type="text" class="cell__input" :style="{ textAlign: 'left' }" />
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
        console.log('reload student list in GET /sections/:id/subjects/:id/subjects')
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
    border: 1px solid $light-gray-10;
  }

  .table__container {
    width: 100%;
    height: 100%;
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

    tr:focus-within {
      td, th {
        background-color: $light-blue;
      }
    }
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

</style>