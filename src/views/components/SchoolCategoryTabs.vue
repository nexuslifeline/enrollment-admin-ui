<template>
  <b-tabs class="c-tab-pills" pills>
    <b-tab
      v-if="showAll"
      @click="$emit('clickAll')"
      active
      :disabled="schoolCategoryId !== null"
      title="All Category" />
    <b-tab v-for="schoolCategory in schoolCategories.values"
      :key="schoolCategory.id"
      :title="schoolCategory.name"
      :active="schoolCategoryId === schoolCategory.id"
      :disabled="schoolCategoryId === null ? false : schoolCategoryId !== schoolCategory.id"
      @click="$emit('click', schoolCategory.id)"/>
  </b-tabs>
</template>
<script>
import { SchoolCategories } from '../../helpers/enum'
export default {
  props: {
    showAll: false,
    schoolCategoryId: null,
  },
  data() {
    return {
      schoolCategories: SchoolCategories
    }
  }
}
</script>