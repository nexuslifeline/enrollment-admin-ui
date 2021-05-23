<template>
  <Card title="Student Information" titleSize="m" noPaddingBody>
    <ActiveViewItems>
      <ActiveViewItem label="Student Number">
        <p>
          {{ data.studentNo || 'Awaiting Confirmation' }}
        </p>
      </ActiveViewItem>
      <ActiveViewItem label="Name">
        <p>
          {{ data.name }}
        </p>
      </ActiveViewItem>
      <ActiveViewItem
        v-if="!!data.email"
        label="Email:">
        <p>
          {{ data.email }}
        </p>
      </ActiveViewItem>
      <ActiveViewItem
        v-if="!!data.mobileNo"
        label="Mobile Number:">
        <p>
          {{ data.mobileNo }}
        </p>
      </ActiveViewItem>
      <ActiveViewItem label="Address:">
        <p>
          {{ data.currentAddress || data.address }}
        </p>
      </ActiveViewItem>
      <ActiveViewItem label="Category:">
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
      </ActiveViewItem>
    </ActiveViewItems>
  </Card>
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

</style>
