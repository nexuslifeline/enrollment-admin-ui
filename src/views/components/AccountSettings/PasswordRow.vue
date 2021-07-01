<template>
  <div class="item__row">
    <div class="item__content">
      <vText size="m" weight="bold">Update Password</vText>
      <vText color="light" size="s">By changing your passwords regularly, you make it harder for someone to compromise your account.</vText>
    </div>
    <div class="item__action">
      <div class="item__details">
        <vText size="s" color="light" type="p" align="right">**********</vText>
        <vText size="s" color="light" type="p" align="right">Last Updated {{ passwordLastUpdateDate  }}</vText>
      </div>
      <b-button @click="$router.push({ name: 'UpdatePassword' })" type="button" variant="outline-primary">
        Update
      </b-button>
    </div>
  </div>
</template>
<script>

import { format } from 'date-fns'
export default {
  format,
  components: {

  },
  props: {
    data: {
      type: [Object],
    }
  },
  computed: {
    passwordLastUpdateDate() {
      if(!this.data)
      return null

      const { updatedAt, createdAt } = this.data

      if(updatedAt) {
        return this.$options.format(new Date(updatedAt), 'MMMM dd yyyy')
      }

      if(createdAt) {
        return this.$options.format(new Date(createdAt), 'MMMM dd yyyy')
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.item__row {
  display: flex;
  flex-direction: row;
  padding: 0;
  margin-top: 10px;
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
}

.item__details {
  margin-bottom: 20px;
}

.item__content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.item__action {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.item__text {
  color: $dark-gray-200;
  font-size: 14px;
  margin: 0;
}

.item__title {
  font-weight: 500;
  color: $dark-gray-500;
  font-size: 17px;
  margin: 0 0 3px 0;
}

</style>
