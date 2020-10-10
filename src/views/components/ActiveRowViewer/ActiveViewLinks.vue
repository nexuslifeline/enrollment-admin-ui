<template>
  <div class="active-view__quick-links-container">
    <ul class="active-view__quick-links">
      <li v-for="(item, idx) in items"
        class="active-view__quick-links-item"
        :class="{ active: activeIndex === idx }"
        @click="handleLinkSelect(idx)">
        {{item.text}}
        <BIconArrowRightCircle scale="1.3" class="ml-auto" />
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      items: {
        type: [Array]
      }
    },
    data() {
      return {
        activeIndex: 0
      }
    },
    methods: {
      handleLinkSelect(idx) {
        this.activeIndex = idx;
        const target = this.items[idx].target;
        const elem = document.querySelector(`#${this.items[idx].target}`);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
  .active-view__quick-links-container {
    position: fixed;
    width: 260px;
    min-height: 100vh;
    left: 0;
    bottom: 0;
    top: 100px;
    padding: 5px 10px;
  }

  .active-view__quick-links {
    list-style: none;
    padding: 0;
  }

  .active-view__quick-links-item {
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
    padding: 6px 15px;
    border-radius: 3px;
    margin-bottom: 4px;

    &.active {
      background-color: $light-gray-100;
      color: $dark-gray-600;
      font-weight: 500;
    }

    &:hover {
      background-color: $light-gray-50;
    }

  }
</style>