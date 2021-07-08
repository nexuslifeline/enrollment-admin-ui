<template>
  <div>
    <table class="transcript__subjects">
      <thead>
        <tr>
          <th class="header__cell subject-cell">Subject</th>
          <th class="header__cell units-cell">Units</th>
          <th class="header__cell credited-cell">Credited</th>
          <th class="header__cell grade-cell">Grade</th>
          <th class="header__cell remarks-cell">Remarks</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, idx) in subjects">
          <template
            v-if="row.semesterId === semesterId && row.levelId === levelId">
            <tr :key="idx">
              <td class="cell subject-cell">
                {{ row.name }}
                -
                {{ row.description }}
              </td>
              <td class="cell units-cell">
                {{ row.totalUnits }}
              </td>
              <td class="cell credited-cell">
                <Toggle v-model="row.isTaken" />
              </td>
              <td class="cell__input grade-cell">
                <input type="number" v-model="row.grade" />
              </td>
              <td class="cell__input remarks-cell">
                <input type="text" v-model="row.notes" />
              </td>
            </tr>
          </template>
        </template>
      </tbody>
      <tfoot>
        <tr>
          <td class="total-label">Total Units:</td>
          <td class="text-center bold">{{ totalUnits }}</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tfoot>
    </table>
    <div class="action-row">
      <b-button variant="primary" @click="$emit('onSave', subjects)" :disabled="isProcessing">
        <v-icon name="spinner" spin v-if="isProcessing" />  Save Changes
      </b-button>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    subjects: {
      type: [Array]
    },
    semesterId: {
      type: [Number, String],
      default: null
    },
    levelId: {
      type: [Number, String],
      default: null
    },
    isProcessing: {
      type: [Boolean, String],
      default: false
    }
  },
  computed: {
    totalUnits() {
     return this.filteredSubjects.reduce((total, subject) => {
        if(subject.levelId === this.levelId && subject.semesterId === this.semesterId)
          return total += parseFloat(subject.totalUnits)
      }, 0)
    },
    filteredSubjects() {
      return this.subjects.filter(subject => subject.levelId === this.levelId && subject.semesterId === this.semesterId)
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';

.transcript__subjects {
  width: 100%;
}

.header__cell {
  padding: 3px 10px;
  background-color: $light-gray-50;
}

.cell {
  padding: 7px 10px;
  border-bottom: 1px solid $brand-border-color;
}

.cell__input {
  padding: 0 10px;
  border-bottom: 1px solid $brand-border-color;

  input {
    border: 0;
    width: 100%;
    height: 100%;
    outline: none;
  }
}

.action-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  width: 100%;
}

.total-label{
  text-align: right;
  padding-right: 20px;
  font-weight: bold;
}

.text-center {
  text-align: center;
}

.bold {
  font-weight: bold;
}

.subject-cell {
  width: 50%;
}

.units-cell, .credited-cell, .grade-cell{
  width: 10%;
  text-align: center;
}

.remarks-cell {
  width: 20%;
}

</style>
