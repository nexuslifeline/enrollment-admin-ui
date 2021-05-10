<template>
  <div class="student-subject__list-item">
    <div class="item__content">
      <vText :fontSize="16" weight="bold">{{ 'IT101 - Data Structures' }}</vText>
      <vText size="s" color="light">{{ 'Section 1 * Juan Dela Cruz * 1:00 pm - 3:00pm | 2:00 pm - 4:00pm' }}</vText>
    </div>
    <div>
      <InputGroup>
        <InputInline>
          <Toggle @input="(checked) => $emit('onChange', { data, checked })" />
          <span class="ml-2">Dropped</span>
        </InputInline>
      </InputGroup>
    </div>
  </div>
</template>
<script>


export default {
  components: {

  },
  props: {
    data: {
      type: [Object],
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.student-subject__list-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid $light-gray-10;

  &:last-child {
    margin-bottom: 0;
    border-bottom: 0;
  }
}

.item__content {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
