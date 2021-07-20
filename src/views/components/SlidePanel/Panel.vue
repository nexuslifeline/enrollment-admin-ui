<template>
  <transition name="slide-fade" appear>
    <div class="slide-panel__container">
      <div class="slide-panel__header">
        <slot name="header"></slot>
        <div class="slide-panel__header-actions">
          <slot name="actions"></slot>
          <button @click="$emit('onClose')" class="action-close">
            <BIconX scale="1.3" />
          </button>
        </div>
      </div>
      <div class="slide-panel-content__container">
        <div class="slide-panel-content__main">
          <slot name="content"></slot>
        </div>
        <div class="slide-panel-content__bottom">
          <slot name="bottom"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {

    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .slide-panel__container {
    position: fixed;
    top: 84px;
    right: 0;
    height: calc(100vh - 84px);
    border-left: 1px solid $light-gray-10;
    width: 100%;
    max-width: 650px;
    background: $white;
    z-index: 9;
    display: flex;
    flex-direction: column;

    @include for-size(tablet-landscape-down) {
      top: 0;
      height: 100vh;
      z-index: 11;
    }
  }

  .slide-fade-enter-active {
    transition: all 1s ease;
  }


  .slide-fade-leave-active {
    transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }

  .slide-panel__header {
    min-height: 37px;
    border-bottom: 1px solid $light-gray-10;
    display: flex;
    align-items: center;
  }

  .slide-panel__header-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
  }

  .slide-panel-content__container {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .slide-panel-content__main {
    flex: 1;
    overflow: auto;
  }

  .slide-panel-content__bottom {
    height: 50px;
    background-color: $light-gray-50;
    border-top: 1px solid $light-gray-10;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 25px;
  }

  .action-close {
    height: 100%;
    width: 30px;
    border: 0;
    border-left: 1px solid $light-gray-10;
    margin: 0;
    background: none;
  }

</style>