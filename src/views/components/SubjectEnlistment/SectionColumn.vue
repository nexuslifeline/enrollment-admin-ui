<template>
  <div>
    <template v-if="data">
      <b-link @click="$emit('onSelectSection')"> {{ data.name }} </b-link>
      <v-icon @click="$emit('onClearSection')" name="times" class="remove-icon"></v-icon>
    </template>
    <template v-else>
      <b-link @click="$emit('onSelectSection')"> Select </b-link>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: [Object]
    }
  },
  data() {
    return {

    }
  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.remove-icon {
  margin-left: 8px;
  color:rgb(143, 9, 9);

  &:hover {
    color: red;
    cursor: pointer;
  }
}
</style>
