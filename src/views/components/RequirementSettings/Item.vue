<template>
  <div class="term__list-item">
    <div class="item__content">
      <vText :fontSize="18" weight="bold">
        {{ (data.documentType &&  data.documentType.name) || 'No Name' }}
      </vText>
      <vText v-if="data.documentType && data.documentType.description" size="s" color="light">
        {{ data.documentType.description }}
      </vText>
      <vText size="s" color="light">
        {{ (data.schoolCategory &&  data.schoolCategory.name) || 'No School Category' }}
      </vText>
    </div>
    <div>
      <b-button @click="$emit('onEdit', data)" type="button" variant="outline-primary">
        Edit
      </b-button>
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

.term__list-item {
  display: flex;
  flex-direction: row;
  padding-top: 5px;
  margin-top: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid $light-gray-10;

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
}

.item__content {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
