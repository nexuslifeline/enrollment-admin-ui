<template>
  <div class="page-content__slide-panel" :class="{ isCollapse }">
    <button
      v-b-tooltip.hover
      :title="`${notificationCount} pending request`"
      class="action-toggle__slide"
      @click="isCollapse = !isCollapse">
      <BIconChevronDoubleLeft v-if="isCollapse" />
      <BIconChevronDoubleRight v-else />
      <span
        v-if="notificationCount > 0"
        class="slide-panel__notification-count" >
        {{ notificationCount }}
      </span>
    </button>
    <slot name="panel-content" />
  </div>
</template>
<script>
export default {
  props: {
    notificationCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isCollapse: true
    };
  }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';

.page-content__slide-panel {
  position: fixed;
  width: 490px;
  top: 0;
  right: 0;
  height: 100vh;
  z-index: 10;
  background-color: $white;
  border-left: 1px solid $light-gray-10;
  transition: right .8s;

  &.isCollapse {
    right: -490px;
  }
}

.action-toggle__slide {
  height: 33px;
  width:  30px;
  background: $white;
  outline: none;
  position: absolute;
  left: -30px;
  top: 85px;
  border: 1px solid $light-gray-10;
  border-right: 0;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}

.slide-panel__notification-count {
  background-color: $red;
  position: absolute;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  font-size: 11px;
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  top: -16px;
  right: 5px;
  font-weight: 500;
}
</style>
