<template>
   <div>
     <vText type="h2" size="m" weight="bold">
       Open Enrollment
     </vText>
     <vText size="s" color="light">
       To notify student that the enrollment is now ongoing, open enrollment for each school category.
     </vText>

    <table class="setup__table-category">
      <thead>
        <tr>
          <th>School Category</th>
          <template v-for="sem in $options.Semesters.values">
            <th :key="sem.id">{{ sem.name }}</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="category in $options.SchoolCategories.values">
          <template v-if="[
            $options.SchoolCategories.SENIOR_HIGH_SCHOOL.id,
            $options.SchoolCategories.COLLEGE.id,
            $options.SchoolCategories.VOCATIONAL.id,
          ].includes(category.id)">
            <tr :key="category.id">
              <td>{{ category.name }}</td>
              <template v-for="sem in $options.Semesters.values">
                <td :key="sem.id">
                  <Toggle @input="(v) => onToggleChange(v, category.id, sem.id)" />
                </td>
              </template>
            </tr>
          </template>
        </template>
      </tbody>
    </table>

    <table class="setup__table-category">
      <thead>
        <tr>
          <th>School Category</th>
          <th>Open</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="category in $options.SchoolCategories.values">
          <template v-if="![
            $options.SchoolCategories.SENIOR_HIGH_SCHOOL.id,
            $options.SchoolCategories.COLLEGE.id,
            $options.SchoolCategories.VOCATIONAL.id,
          ].includes(category.id)">
            <tr :key="category.id">
              <td>{{ category.name }}</td>
              <td><Toggle @input="(v) => onToggleChange(v, category.id)" /></td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
   </div>
</template>

<script>
import Card from '../../components/Card';
import { SchoolCategories, Semesters } from '../../../helpers/enum';
import Toggle from '../../components/Form/Toggle';

export default {
  SchoolCategories,
  Semesters,
  components: {
    Toggle,
    Card,
  },
  data() {
    return {

    };
  },
  methods: {
    onToggleChange(status, schoolCategoryid, semesterId) {
      alert('update(PUT) here ===> ' + schoolCategoryid + ' MODE is ==> ' + status + ' SEM ===> ' + semesterId)
    }
  }
}
</script>
<style lang="scss">
  @import "../../../assets/scss/shared.scss";

  .setup__table-category {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    border: 1px solid $light-gray-10;
    background-color: $white;

    th {
      text-transform: uppercase;
      font-size: 13px;
      background-color: $light-gray-50;
    }

    td {
      font-size: 15px;
    }

    td, th {
      padding: 13px 20px;
      border-bottom: 1px solid $light-gray-10;
      text-align: center;

      &:first-child {
        text-align: left;
      }
    }
  }
</style>
