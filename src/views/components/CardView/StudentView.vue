<template>
  <div>
    <InlineItem label="Student No">
      {{ data.studentNo || 'Awaiting Confirmation' }}
    </InlineItem>
    <InlineItem label="Student">
      <div class="student-name">
        <AvatarMaker
          :avatarId="userId"
          :size="33"
          :text="studentAvatarText"
          :src="studentPhoto"
          :borderSize="3"
          class="m-auto"
        />
        <span class="ml-1">{{ data.name }}</span>
      </div>
    </InlineItem>
    <InlineItem
      v-if="!!data.email"
      label="Email:">
      {{ data.email }}
    </InlineItem>
    <InlineItem
      v-if="!!data.mobileNo"
      label="Mobile Number:">
      {{ data.mobileNo }}
    </InlineItem>
    <InlineItem label="Address:">
      {{ data.currentAddress || data.address }}
    </InlineItem>
    <InlineItem label="Category:" v-if="studentCategory">
      <b-badge
        :variant="studentCategory.id === $options.StudentCategories.NEW.id
          ? 'success'
          : studentCategory.id === $options.StudentCategories.OLD.id
          ? 'primary'
          : 'warning'">
        {{ studentCategory.name }}
      </b-badge>
    </InlineItem>
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
  },
  computed: {
    studentPhoto() {
      const path = this.data?.photo?.hashName || '';
      return path ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${path}` : '';
    },
    studentAvatarText() {
      return this.data && `${this.data?.firstName?.charAt(0)}${this.data?.lastName?.charAt(0)}` || '';
    },
    userId() {
      return this.data?.id || this.data?.user?.id || 0;
    },
  }
};
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .student-name {
    display: flex;
    align-items: center;
  }

</style>
