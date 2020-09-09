<template>
  <div>
    <b-card class="school-category__card">
      <b-form-group>
        <label class="school-category__label">Allow access to School Categories :</label>
        <v-select
          v-model="selectedSchoolCategories"
          :reduce="item => item.id"
          multiple
          label="name"
          :options="schoolCategories.values" />
      </b-form-group>
    </b-card>
  </div>
</template>
<script>
import { SchoolCategories } from '../../../helpers/enum'
export default {
  data() {
    return {
      schoolCategories: SchoolCategories,
      selectedSchoolCategories: []
    }
  }
}
</script>
<style lang="scss" scoped>
  .school-category__card {
    min-height: 300px
  }
  .school-category__label {
    font-weight: bold;
  }
</style>