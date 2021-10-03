<template>
  <div class="item__row">
    <div class="item__content">
      <vText size="m" weight="bold">Manage Account</vText>
      <vText color="light" size="s">
        It is important to use existing email address as username to properly linked account. 
        The right user group is also important to make sure the correct authorization is given to the user.
      </vText>
    </div>
    <div class="item__action">
      <div class="item__details">
        <vText size="s" weight="bold" type="p" align="right">{{ user.username || '' }}</vText>
        <vText size="s" weight="bold" color="light" type="p" align="right">
          {{ user.userGroup && user.userGroup.name || '' }}
        </vText>
      </div>
      <b-button @click="onChangeUsername" type="button" variant="primary">
        Change
      </b-button>
    </div>
  </div>
</template>
<script>


export default {
  props: {
    user: {
      type: [Object]
    }
  },
  created() {
    console.log(this.user)
  },
  methods: {
    onChangeUsername() {
      this.$router.push({
        name: 'Change Member Username',
        params: { ...this.$route.params }
      });
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
  flex-basis: 67%;
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
