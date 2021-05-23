<template>
  <div>
    <ApprovalItem label="Student Number">
      <p>
        {{ data.studentNo || 'Awaiting Confirmation' }}
      </p>
    </ApprovalItem>
    <ApprovalItem label="Name">
      <p>
        {{ data.name }}
      </p>
    </ApprovalItem>
    <ApprovalItem
      v-if="!!data.email"
      label="Email:">
      <p>
        {{ data.email }}
      </p>
    </ApprovalItem>
    <ApprovalItem
      v-if="!!data.mobileNo"
      label="Mobile Number:">
      <p>
        {{ data.mobileNo }}
      </p>
    </ApprovalItem>
    <ApprovalItem label="Address:">
      <p>
        {{ data.currentAddress || data.address }}
      </p>
    </ApprovalItem>
    <ApprovalItem label="Category:">
      <p>
        <b-badge
          :variant="studentCategory.id === $options.StudentCategories.NEW.id
            ? 'success'
            : studentCategory.id === $options.StudentCategories.OLD.id
            ? 'primary'
            : 'warning'">
          {{ studentCategory.name }}
        </b-badge>
      </p>
    </ApprovalItem>
  </div>
</template>
<script>

import { StudentCategories } from '../../../helpers/enum';
export default {
  StudentCategories,
  props: {
    data: {
      type: [Object]
    },
    studentCategory: {
      type: [Object]
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.container {

}

</style>
