<template>
  <div>
    <Card
      title="Manage Requirements"
      titleSize="m">
      <template v-slot:header-action>
        <div class="header__action-dropdown">
          <SelectCategory
            :value="filters.schoolCategory"
            label="name"
            @input="onSchoolCategoryChanged"
            :clearable="false"
            appendToBody/>
        </div>
      </template>
      <div v-if="items.length > 0" class="subjects__list">
        <template v-for="(item, idx) in items">
          <Item :data="item" :key="idx" @onChange="onSubmitChange" />
        </template>
      </div>
      <div v-else>
        <vText size="s" weight="light">No record(s) found.</vText>
      </div>
    </Card>
  </div>
</template>
<script>
import { RequirementApi, StudentApi } from '../../../mixins/api';
import { SchoolCategories } from '../../../helpers/enum'

import Card from '../Card';
import Item from './Item';
import { showNotification } from '../../../helpers/forms';

export default {
  SchoolCategories,
  components: {
    Card,
    Item
  },
  mixins: [ StudentApi, RequirementApi ],
  props: {
    studentId: {
      type: [String, Number],
    },
    data: {
      type: [Object]
    }
  },
  data() {
    return {
      filters: {
        schoolCategory: this.data && this.data.latestAcademicRecord && this.data.latestAcademicRecord.schoolCategory || SchoolCategories.PRE_SCHOOL,
        schoolCategoryId: this.data && this.data.latestAcademicRecord && this.data.latestAcademicRecord.schoolCategoryId || SchoolCategories.PRE_SCHOOL.id
      },
      items: [
        // {
        //   id: 1,
        //   documentType: {
        //     name: 'Form 138', description: 'Lorem ipsum dolor isetit misaned kuniparamiya delae.'
        //   },
        //   isSubmitted: true,
        //   schoolCategory: { name: 'College' }
        // },
      ],
    }
  },
  created() {
    // load student requirements here using the property student id provided
    this.loadRequirements()
  },
  methods: {
    loadRequirements() {
      const { schoolCategoryId } = this.filters
      const params = { paginate: false }
      this.getStudentRequirements(this.studentId, schoolCategoryId, params).then(({ data }) => {
        this.items = data
      })
    },
    onSubmitChange(item) {
      console.log('item', item)
      const { checked: isSubmitted, data: { id: requirementId, schoolCategoryId } } = item
      const payload = {
        isSubmitted
      }
      this.updateStudentRequirement(this.studentId,schoolCategoryId,requirementId,payload).then(({ data }) => {
        showNotification(this, 'success', 'Record has been updated.')
      }).catch((error) => {
        const errors = error.response.data.errors;
        console.log(errors)
      });
      // PATCH /requirements/:id
    },
    onSchoolCategoryChanged(schoolCategory) {
      this.filters.schoolCategory = schoolCategory
      this.filters.schoolCategoryId = schoolCategory?.id || null
      this.loadRequirements()
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.subjects__list {
  width: 100%;
  min-height: 120px;
  background-color: $white;
  margin: -20px 0;
}

.header__action-dropdown {
  min-width: 40%;
}

</style>
