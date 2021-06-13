<template>
  <table class="subjects__table">
    <thead>
      <tr>
        <th>
          Subject
        </th>
        <th>
          Section
        </th>
        <th class="align-right">
          Units
        </th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(v, idx) in data" :key="idx">
        <td>
          {{ v.description }}
        </td>
        <td>
          <SectionColumn />
        </td>
        <td class="align-right">
          {{ v.totalUnits }}
        </td>
        <td>
          <button class="action__trash" @click="$emit('onRemove', v)">
            <BIconTrash />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import SectionColumn from './SectionColumn';

export default {
  props: {
    data: {
      type: [Array]
    }
  },
  components: {
    SectionColumn
  },
  data() {
    return {
    }
  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.subjects__table {
  width: 100%;

  th {
    padding: 6px 12px;
    background-color: $light-gray;
    text-transform: uppercase;
  }

  td {
    border-top: 1px solid $light-gray-10;
    padding: 12px;

    &:last-child {
      width: 30px;
    }
  }
}

.align-right {
  text-align: right;
}

.action__trash {
  border: 0;
  outline: none;
  background: none;
  height: 35px;
  width: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;

  &:hover {
    background-color: black;
    color: $white;
  }
}

</style>
