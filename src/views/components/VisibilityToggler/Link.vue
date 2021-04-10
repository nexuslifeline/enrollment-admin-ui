<template>
  <div>
    <button @click="onLinkClick" v-if="isLinkShown" class="btn-link" type="button">
      <BIconArrowLeft v-if="isShown" scale="1.2" class="mr-1"/>
      <BIconPlus v-else scale="1.2" class="mr-1" />
      {{ isShown ? hideLinkText : linkText }}
    </button>
    <template v-if="isShown">
      <slot></slot>
    </template>
  </div>
</template>

<script>

export default {
  props: {
    linkText: {
      type: [String],
      default: 'Add New'
    },
    hideLinkText: {
      type: [String],
      default: 'Hide Options'
    },
    hideOnContentShow: {
      type: [Boolean],
      default: true
    }
  },
  data() {
   return {
     isShown: false,
     isLinkShown: true
   }
  },
  methods: {
    onLinkClick() {
      this.isShown = !this.isShown;

      if (this.hideOnContentShow) {
        this.isLinkShown = false;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .btn-link {
    border: 0;
    outline: none;
    background: none;
    color: $blue;
    padding: 0;
    margin: 10px 0 15px 0;
  }

</style>