<template>
  <b-avatar
    blank
    class="avatar-maker"
    :size="size"
    :text="text"
    :src="src"
    :style="{
      backgroundColor: $options.colorFactory(
        avatarId % $options.constants.COLOR_FACTORY_LENGTH
      ).bg,
      color: $options.colorFactory(
        avatarId % $options.constants.COLOR_FACTORY_LENGTH
      ).font
    }"
  />
</template>
<script>
  import { colorFactory, getColorFactoryLength } from '../../helpers/colors';

  const COLOR_FACTORY_LENGTH = getColorFactoryLength();

  export default {
    constants: {
      COLOR_FACTORY_LENGTH
    },
    colorFactory,
    props: {
      size: {
        type: [Number],
        default: 54
      },
      avatarId: {
        type: [Number],
        default: 0
      },
      src: {
        type: [String]
      },
      text: {
        type: [String]
      }
    }
  }
</script>
<style lang="scss">
  .avatar-maker img {
    border-radius: 50%;
    object-fit: cover;
  }
</style>