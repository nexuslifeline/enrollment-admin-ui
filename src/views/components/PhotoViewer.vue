<template>
  <div class="photo-viewer" @click="onBrowseClick">
    <div class="photo-viewer__action-top">
      <button v-if="!!imageUrl" @click="$emit('onPhotoRemove')" class="photo-viewer__remove">
        <v-icon class="photo-viewer__remove-icon" name="times-circle" scale="1.2" />
      </button>
    </div>
    <img
      v-if="!!imageUrl"
      class="photo-viewer__image"
      :src="imageUrl"
    />
    <div v-if="isBusy" class="photo-viewer__spinner">
      <v-icon
        name="spinner"
        pulse />
    </div>
    <div class="photo-viewer__action">
      <input
        @change="onInputFileChange"
        ref="photoViewerFile"
        type="file"
        class="photo-viewer__file"
        accept="image/*"
      />
      <button
        @click="onBrowseClick"
        class="photo-viewer__browse">
        <span class="photo-viewer__browse-caption">
          {{!!imageUrl ? 'Browse' : 'Change'}}
        </span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageUrl: {
      type: [String]
    },
    isBusy: {
      type: [Boolean],
      default: false
    }
  },
  methods: {
    onBrowseClick(e) {
      e.stopPropagation();
      this.$refs.photoViewerFile.click();
    },
    onInputFileChange(event) {
      const file = event.target.files.length > 0
        ? event.target.files[0]
        : null;
      this.$emit('onPhotoChange', file);
      this.$refs.photoViewerFile.value = ''
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/shared.scss";

  .photo-viewer {
    width: 100%;
    height: 100%;
    border: 1px solid $gray;
    position: relative;
    border-radius: 3px;
    overflow: hidden;

    &:hover {
      cursor: pointer;
    }
  }

  .photo-viewer__spinner {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $light-gray;
    opacity: .6;
  }

  .photo-viewer__image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .photo-viewer__action {
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    height: 32px;
    background-color: transparent;

    &:hover {
      .photo-viewer__browse {
        display: block;
      }
    }
  }

  .photo-viewer__action-top {
    position: absolute;
    top: 0;
    width: 100%;
    left: 0;
    height: auto;
    min-height: 20px;
    background-color: transparent;
    display: flex;
    justify-content: flex-end;

    &:hover {
      .photo-viewer__remove {
        display: inline-block;
      }
    }
  }

  .photo-viewer__browse {
    width: 100%;
    height: 100%;
    border: none;
    background-color: $light-gray;
    opacity: .7;
    outline: none;
    display: none;
  }

  .photo-viewer__browse-caption {
    font-weight: 500;
    color: $dark-gray;
  }

  .photo-viewer__file {
    display: none;
  }

  .photo-viewer__remove {
    outline: none;
    border: none;
    background-color: transparent;
    display: none;
  }

  .photo-viewer__remove-icon {
    color: $red;
  }
</style>