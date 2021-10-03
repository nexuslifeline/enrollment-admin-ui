<template>
  <div class="item__row">
    <div class="item__content">
      <vText size="m" weight="bold">Change Password</vText>
      <vText color="light" size="s">You might need to change account password for security reasons or if the student forget it. </vText>
    </div>
    <div class="item__action">
      <div class="item__details">
        <vText size="s" color="light" type="p" align="right">**********</vText>
        <vText size="s" color="light" type="p" align="right">Last Updated {{ passwordLastUpdateDate  }}</vText>
      </div>
      <b-button @click="onUpdatePassword" type="button" variant="primary">
        Change
      </b-button>
    </div>
  </div>
</template>
<script>

import { format } from 'date-fns'
export default {
  format,
  props: {
    data: {
      type: [Object],
    }
  },
  methods: {
    onUpdatePassword() {
      this.$router.push({
        name: 'Change Member Password',
        params: { ...this.$route.params }
      });
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
