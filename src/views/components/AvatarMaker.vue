<template>
  <div
    :class="`avatar-maker__container ${enableUpload && 'uploadable' } ${containerClass}`"
    :style="{ height: `${size}px`, width: `${size}px` }"
    @click.stop="onBrowseClick">
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
        ).font,
        border: `${borderSize}px solid ${borderColor}`
      }"
    />
    <button
      v-if="enableUpload"
      @click.stop="onBrowseClick"
      type="button"
      class="action-upload">
      <BIconCameraFill scale="1.2" />
    </button>
    <input
      v-if="enableUpload"
      @change="onInputFileChange"
      ref="fileUploader"
      type="file"
      class="file-uploader__file-input"
      :accept="$options.constants.ACCEPT_FILES"
    />
  </div>
</template>
<script>
  import { colorFactory, getColorFactoryLength } from '../../helpers/colors';

  const COLOR_FACTORY_LENGTH = getColorFactoryLength();
  const ACCEPT_FILES = 'image/*';

  export default {
    constants: {
      COLOR_FACTORY_LENGTH,
      ACCEPT_FILES
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
      },
      borderSize: {
        type: [Number],
        default: 0
      },
      borderColor: {
        type: [String],
        default: 'white'
      },
      enableUpload: {
        type: [Boolean],
        default: false
      },
      containerClass: {
        type: [String],
        default: ''
      }
    },
    methods: {
      onInputFileChange(event) {
        const file = event.target.files.length > 0
        ? event.target.files[0]
        : null;
        this.$emit('onPhotoChange', file);
        this.$refs.fileUploader.value = '';
      },
      onBrowseClick() {
        this.$refs.fileUploader.click();
      },
    }
  }
</script>
<style lang="scss">
  @import '../../assets/scss/shared.scss';
  .avatar-maker__container {
    position: relative;
    width: auto;
    height: auto;
    z-index: 2;

    &.uploadable {
      cursor: pointer;
    }
  }

  .avatar-maker img {
    border-radius: 50%;
    object-fit: cover;
  }

  .action-upload {
    position: absolute;
    background-color: $light-gray-200;
    outline: none;
    border: 0;
    bottom: 10px;
    right: 0;
    height: 25px;
    width: 25px;
    padding: 2px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $black;
  }

  .file-uploader__file-input {
    display: none;
  }

</style>