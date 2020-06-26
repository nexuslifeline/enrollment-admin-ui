<template>
  <div
    class="profile-maker"
    :style="{ 'background-color': colorFactory.bg }">
    <div
      class="profile-maker__initials"
      :style="{
        'color': colorFactory.font,
        'font-size': `${fontSize}px`,
        'font-weight': fontWeight
      }">
      {{initials}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isBusy: {
      type: [Boolean],
      default: false
    },
    initials: {
      type: [String]
    },
    colorIndex: {
      type: [Number]
    },
    fontSize: {
      type: [Number],
      default: 50
    },
    fontWeight: {
      type: [Number],
      default: 700
    }
  },
  computed: {
    colorFactory() {
      const colors = [
        { bg: '#fcfcfc', font: '#7c7c7c' },
        { bg: '#0080FF', font: '#FFFFFF' },
        { bg: '#00cc45', font: '#FFFFFF' },
        { bg: '#7908CF', font: '#FFFFFF' },
        { bg: '#DE193F', font: '#FFFFFF' },
        { bg: '#FFA33A', font: '#FFFFFF' },
        { bg: '#aa4ced', font: '#FFFFFF' },
        { bg: '#ed4cca', font: '#FFFFFF' },
        { bg: '#4cede2', font: '#FFFFFF' }
      ];
      return colors[this.colorIndex];
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/shared.scss";

  .profile-maker {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-maker__initials {
    font-weight: 700;
  }
</style>