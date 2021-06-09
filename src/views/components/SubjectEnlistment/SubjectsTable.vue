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
      <tr v-for="(v, idx) in Array.from({ length: 4 })" :key="idx">
        <td>
          Data Structure
        </td>
        <td>
          <SectionColumn />
        </td>
        <td class="align-right">
          3
        </td>
        <td>

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
      type: [Object]
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
    padding: 12px;
    background-color: $light-gray;
    text-transform: uppercase;
  }

  td {
    border-top: 1px solid $light-gray-10;
    padding: 15px;
  }
}

.align-right {
  text-align: right;
}

</style>
