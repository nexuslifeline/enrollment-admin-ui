<template>
  <div>
    <table class="transcript__subjects">
      <thead>
        <tr>
          <th class="header__cell">Subject</th>
          <th class="header__cell">Units</th>
          <th class="header__cell">Credited</th>
          <th class="header__cell">Grade</th>
          <th class="header__cell">Remarks</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, idx) in subjects">
          <template
            v-if="row.semesterId === semesterId && row.levelId === levelId">
            <tr :key="idx">
              <td class="cell">
                {{ row.name }}
                -
                {{ row.description }}
              </td>
              <td class="cell">
                {{ row.totalUnits }}
              </td>
              <td class="cell">
                <Toggle v-model="row.isTaken" />
              </td>
              <td class="cell__input">
                <input type="number" v-model="row.grade" />
              </td>
              <td class="cell__input">
                <input type="text" v-model="row.notes" />
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
    <div class="action-row">
      <b-button variant="primary" @click="$emit('onSave', subjects)">
        Save Changes
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

</style>
