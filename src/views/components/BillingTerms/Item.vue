<template>
  <div class="term__list-item">
    <div class="item__content">
      <vText size="m" weight="bold">{{ data.name }}</vText>
      <vText size="s" color="light">{{ data.description }}</vText>
      <vText size="s" color="light">{{ data.schoolCategory.name }} <span v-if="data.semester">/ {{  data.semester.name }}</span></vText>
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
  padding: 0;
  margin-top: 10px;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.item__content {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
