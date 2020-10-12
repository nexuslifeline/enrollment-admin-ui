<template>
  <div class="active-view__container">
    <b-overlay :show="isBusy" rounded="sm">
      <div class="active-view__header">
        <div class="active-view__header-actions">
          <button @click="$emit('onBack')" class="active-view__header-action-back">
            <BIconArrowLeftCircle scale="2" />
            {{backTitle}}
          </button>
        </div>
        <slot name="header"></slot>
        <div class="active-view__header-right-actions">
          <button class="active-view__right-action">
            Save
            <BIconCheckCircle />
          </button>
          <button class="active-view__right-action">
            Back
            <BIconArrowLeftCircle  />
          </button>
        </div>
      </div>
      <div class="active-view__body">
        <div class="active-view__side-nav">
          <slot name="navigation"></slot>
        </div>
        <div class="active-view__content">
          <slot name="content"></slot>
        </div>
      </div>
    </b-overlay>
  </div>
</template>

<script>
  export default {
    props: {
      isBusy: {
        type: [Boolean],
        default: false
      },
      backTitle: {
        type: [String],
        default: 'Back'
      }
    },
    mounted() {
      const body = document.querySelector('body');
      if (body) {
        body.style.overflow = 'hidden';
      }
    },
    beforeDestroy() {
      const body = document.querySelector('body');
      if (body) {
        body.style.overflow = 'auto';
      }
    },
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .active-view__container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: $white;
    z-index: 3;
    overflow: scroll;
  }

  .active-view__header {
    background-color: $light-gray-100;
    //padding: 10px 20px;
    border-bottom: 1px solid $brand-border-color;
    display: flex;
    flex-direction: row;
    margin-bottom: 30px;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    //background-color: $white;
    z-index: 2;
  }

  .active-view__header-actions {
    width: 260px;
    padding-left: 20px;
    //border-right: 1px solid $brand-border-color;
    height: 100%;

    @include for-size(tablet-landscape-down) {
      display: none;
    }
  }

  .active-view__header-action-back {
    border: 0;
    outline: 0;
    //background-color: $white;
    padding: 0;
    margin: 0;
    color: $dark-gray;
    margin: auto 15px;
    font-size: 16px;
    font-weight: 500;

    svg {
      margin-right: 20px;
    }

    &:hover {
      color: $dark-gray-500;
    }
  }

  .active-view__body {
    //@error: 10px 60px;
    //padding-top: 100px;
    width: 100%;
    display: flex;
    overflow: auto;
    margin-top: 69px;
  }

  .active-view__side-nav {
    width: 260px;
    min-height: 100vh;
    //border-right: 1px solid $brand-border-color;
    //background-color: $light-gray-50;

    @include for-size(tablet-landscape-down) {
      display: none;
    }
  }

  .active-view__content {
    flex: 1;
    padding: 40px;
    border-left: 1px solid $brand-border-color;
    background-color: $light-gray;
  }

  .active-view__right-action {
    border: 0;
    background-color: none;
    outline: 0;
    padding: 2px;
    color: $dark-gray;
  }

  .active-view__header-right-actions {
    flex: 0;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 150px;
    margin-right: 10px;
  }

</style>