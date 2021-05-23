<template>
  <div class="approval-view__container">
    <b-overlay :show="isBusy" rounded="sm">
      <div class="approval-view__header">
        <div class="approval-view__header-back">
          <button @click="$emit('onBack')" class="approval-view__header-action-back">
            <BIconChevronLeft scale="1" />
            {{backTitle}}
          </button>
        </div>
        <slot name="header"></slot>
        <div v-if="showOptions" class="approval-view__header-right-actions">
          <button variant="dark" class="btn-action">
            Approve Request
          </button>
        </div>
      </div>
      <div v-if="!!$slots.detail" class="approval-view__side-content">
        <slot name="detail"></slot>
      </div>
      <div class="approval-view__body">
        <div class="approval-view__content">
          <slot name="content"></slot>
        </div>
      </div>
    </b-overlay>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        showDropdown: false
      }
    },
    props: {
      isBusy: {
        type: [Boolean],
        default: false
      },
      showOptions: {
        type: [Boolean],
        default: true
      },
      backTitle: {
        type: [String],
        default: 'Back'
      },
      options: {
        type: [Array],
      },
      showActionBar: {
        type: [Boolean],
        default: true
      }
    },
    mounted() {
      const body = document.querySelector('body');
      if (body) {
        body.style.overflow = 'hidden';
      }
      window.addEventListener('click', this.closeDropdown);
    },
    beforeDestroy() {
      const body = document.querySelector('body');
      if (body) {
        body.style.overflow = 'auto';
      }
      window.removeEventListener('click', this.closeDropdown)
    },
    methods: {
      closeDropdown() {
        this.showDropdown = false;
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .approval-view__container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: $white;
    z-index: 10;
    overflow: auto;
  }

  .approval-view__header {
    position: fixed;
    background-color: $light-gray-100;
    border-bottom: 1px solid $brand-border-color;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 55px;
    background-color: $blue;
    z-index: 2;
  }

  .approval-view__header-back {
    flex: 1;
    display: flex;
    align-items: center;
    height: 100%;

    @include for-size(tablet-landscape-down) {
      display: none;
    }
  }

  .approval-view__header-action-back {
    border: 0;
    outline: 0;
    background: none;
    padding: 0;
    margin: 0;
    color: $white;
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

  .approval-view__body {
    width: 100%;
    display: flex;
    overflow: auto;
    margin-top: 55px;
    position: relative;
    padding-left: 420px;
    min-height: 100vh;
    background-color: $white;
  }

  .approval-view__side-content {
    width: 420px;
    min-height: 100vh;
    position: fixed;
    left: 0;
    top: 55px;
    z-index: 10;
    background-color: $white;
    border-right: 1px solid $brand-border-color;
    padding: 10px;

    @include for-size(tablet-landscape-down) {
      display: none;
    }
  }

  .approval-view__content {
    flex: 1;
    padding: 40px;
    //border-left: 1px solid $brand-border-color;
    background-color: $light-gray;
    position: relative;
    min-height: 100%;
  }

  .approval-view__right-action {
    border: 0;
    background-color: none;
    outline: 0;
    padding: 2px;
    color: $dark-gray;
  }

  .approval-view__header-right-actions {
    flex: 0;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 10px;
    position: relative;
  }

  .approval-view__header-dropdown-container {
    position: absolute;
    top: 40px;
    width: 150px;
    background-color: $white;
    border: 1px solid $gray;
    border-radius: 3px;
    padding: 5px 0;
    right: 15px;
  }

  .approval-view__header-dropdown {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .approval-view__header-dropdown-item {
    padding: 5px 15px;
    cursor: pointer;

    &:hover {
      background-color: $light-gray-100;
    }
  }

  .approval-view__action-bar {
    height: 60px;
    position: sticky;
    bottom: 0;
    background-color: white;
    width: 100%;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 15px;
  }

  .btn-action {
    margin-left: auto;
    padding: 6px 14px;
    background-color: $white;
    border: 0;
    border-radius: 3px;
    outline: none;
    min-width: 150px;

    &:hover {
      background-color: $black;
      color: $white;
    }
  }
</style>