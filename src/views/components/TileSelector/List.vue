<template>
  <div class="tile__list">
    <template v-for="(item, idx) in options">
      <Item
        :key="idx"
        :label="item.label"
        @onSelect="$emit('onSelect', { ...item, index: idx })"
        :isActive="selectedIndex === idx"
        :isBusy="busyIndexes.includes(idx)"
      />
    </template>
  </div>
</template>
<script>
import Item from './Item';

export default {
  components: {
    Item
  },
  props: {
    options: {
      type: Array
    },
    busyIndexes: {
      type: Array
    },
    selectedIndex: {
      type: Number
    }
  },
  methods: {
    onSave() {

    }
  }
};
</script>
<style lang="scss" scoped>
  .tile__list {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
</style>
