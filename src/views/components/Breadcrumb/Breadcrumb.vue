<template>
  <ul class="breadcrum-container">
    <li class="crumb" v-for="(item, index) in items" :key="index" @click="onItemClicked(item, index)" >
      {{ item.text }}
      <v-icon class="right-icon" name="chevron-right" />
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    items: {
      type: [Array],
      default: []
    }
  },
  methods: {
    onItemClicked(item, index) {
      if(index === this.items.length - 1) {
        return
      }
      this.$router.push(item.path)
    }
  }
}
</script>

<style lang="scss" scoped>
  .breadcrum-container{
    display: flex;
    align-items: center;
    list-style-type: none; /* Remove bullets */
    padding: 0; /* Remove padding */
    margin: 0; /* Remove margins */
  }

  ul > li {
    display: flex;
    align-items: center;
    font-size: 12pt;
  }

  ul > li:not(:last-child):hover {
    cursor: pointer;
    text-decoration: underline;
    color: lightblue;

  }

  .right-icon {
    color: lightgray;
    margin: 0 10px;
  }

  ul li:last-child {
    color: lightgray;
    .right-icon {
      display: none;
    }
  }


</style>