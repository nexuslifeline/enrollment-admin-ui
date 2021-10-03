<template>
  <div class="user-employment__list-item">
    <div class="item__content">
      <vText size="m" weight="bold">{{ data.position }}</vText>
      <vText size="s" color="light">{{ data.company }}</vText>
      <vText size="s" color="light">
        {{ `${$options.convertToMonth(data.startMonth)} ${data.startYear} - ${$options.convertToMonth(data.endMonth)} ${data.endYear}` }}
      </vText>
    </div>
    <div>
      <b-button @click="$emit('onEdit', data)" type="button" variant="primary">
        Edit
      </b-button>
    </div>
  </div>
</template>
<script>
import { convertToMonth } from '../../../helpers/utils';
export default {
  convertToMonth,
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

.user-employment__list-item {
  display: flex;
  flex-direction: row;
  padding: 0;
  margin-top: 10px;
  margin-bottom: 30px;

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
