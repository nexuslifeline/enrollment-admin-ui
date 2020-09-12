<template>
  <div class="wave-bg-container">
    <div class="wave-small">
      <WaveSmall />
    </div>
    <div class="wave-medium">
      <WaveMedium />
    </div>
  </div>
</template>

<script>
import WaveSmall from '../../assets/backgrounds/wave-sm.inline.svg';
import WaveMedium from '../../assets/backgrounds/wave-md.inline.svg';

export default {
  components: {
    WaveSmall,
    WaveMedium
  }
}
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/shared.scss";

  .wave-bg-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .wave-small {
    position: absolute;
    //background: $brand-primary;
    width: 100%;
    height: 100%;
    overflow: hidden;

    svg {
      width: 100%;
      height: auto;
      opacity: .65;

      path {
        width: 100%;
        fill: #40acdb;
      }
    }
  }

  .wave-medium {
    position: absolute;
    //background: $brand-primary;
    width: 100%;
    height: 100%;
    overflow: hidden;

    svg {
      width: 100%;
      height: auto;
      opacity: .38;

      path {
        width: 100%;
        fill: #40acdb;
      }
    }
  }
</style>