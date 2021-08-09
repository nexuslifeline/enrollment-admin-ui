<template>
  <div class="student-subject__list-item">
    <div class="item__content">
      <vText :fontSize="18" weight="bold">
        {{ data.documentType && data.documentType.name }}
      </vText>
      <vText v-if="data.documentType && data.documentType.description" size="s" color="light" class="item__sub-text">
        {{ data.documentType.description }}
      </vText>
      <vText size="s" color="light" class="item__sub-text">
        {{ data.schoolCategory.name }}
      </vText>
    </div>
    <div>
      <InputGroup>
        <InputInline>
          <Toggle :value="data.isSubmitted" @input="checked => $emit('onChange', { data, checked })" />
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
  computed: {

  }
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

.item__sub-text {
  span {
    &::after {
      content: '\25CF';
      margin: 0 7px;
    }

    &:last-child::after {
      content: '';
      margin: 0;
    }
  }
}
</style>
