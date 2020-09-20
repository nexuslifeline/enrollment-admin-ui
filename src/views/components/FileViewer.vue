<template>
  <div>
    <b-modal
      :visible="show"
      size="xl"
      :noCloseOnEsc="true"
      @hidden="$emit('close')"
      :noCloseOnBackdrop="true">
      <template v-if="!!owner && !!Object.keys(owner).length" slot="modal-title">
        <div class="preview-file__header">
          <div class="preview-file__owner">
            <b-avatar
              rounded
              blank
              size="56"
              :text="avatarText"
              :src="avatarSource"
            />
            <div class="preview-file__details">
              <div class="preview-file__file-name">{{file.name || 'Untitled'}}</div>
              <div class="preview-file__uploader">Uploaded by
                <span class="ml-1 font-weight-bold">{{owner.name || 'No name'}}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else slot="modal-title">
        {{title || file.name || 'Preview File'}}
      </template>
      <b-overlay :show="isBusy">
        <div v-if="!isBusy && !!file.src"
          class="file-container"
          :class="{ fullscreen: isFullScreen }">
          <template v-if="enableArrowNav">
            <button @click="$emit('onNavLeft')" class="preview-file__navs preview-file__nav-left">
              <v-icon name="chevron-left" scale="1.7" />
            </button>
            <button @click="$emit('onNavRight')" class="preview-file__navs preview-file__nav-right">
              <v-icon name="chevron-right" scale="1.7" />
            </button>
          </template>

          <div v-if="isFullScreen" class="file-container__header">
            <h4 class="file-container__header-title">
              {{file.name}}
            </h4>
            <div class="file-container__fullscreen-actions">
              <button
                @click="isFullScreen = false"
                class="file-container__fullscreen-action">
                <v-icon name="compress" scale="1.2" />
              </button>
              <button
                @click="$emit('close'), isFullScreen = false"
                class="file-container__fullscreen-action">
                <v-icon name="times" scale="1.4" />
              </button>
            </div>
          </div>
          <div class="file-content" :class="{ scrollable: isImage }">
            <b-img
              v-if="isImage"
              :src="file.src"
              class="preview-file__image"
              :class="{ maximize: isMaximize }"
              @click="onImageClick"
            />
            <b-embed
              v-else
              type="iframe"
              aspect="16by9"
              allowfullscreen
              :src="file.src"
              class="preview-file__embed"
            />
          </div>
        </div>
        <div v-else class="file-container" />
      </b-overlay>
      <div slot="modal-footer" class="w-100 preview-file__footer">
        <div v-if="!isFullScreen && navCount > 1" class="nav-dots__container">
          <ul class="nav-dots">
            <li
              v-for="(v, idx) in Array.from({ length: navCount })"
              :key="idx"
              class="nav-dots__item"
              :class="{ active: idx === navActiveIndex}"
            />
          </ul>
        </div>
        <p v-if="!isFullScreen" class="font-weight-bold">{{file.notes}}</p>
      </div>
    </b-modal>
  </div>
</template>
<script>
export default {
  props: {
    show: Boolean,
    file: Object,
    owner: Object,
    isBusy: Boolean,
    enableArrowNav: {
      type: Boolean,
      default: false
    },
    title: String,
    navCount: {
      type: Number,
      default: 0
    },
    navActiveIndex: Number
  },
  data() {
    return {
      isFullScreen: false,
      isMaximize: false
    }
  },
  computed: {
    isImage() {
      const type = this.file?.type;
      return type?.substr(0, type.indexOf('/')) === 'image';
    },
    avatarText() {
      const { owner } = this;
      return (owner?.firstName?.charAt(0) + owner?.lastName?.charAt(0)) || ''
    },
    avatarSource() {
      const { owner } = this;
      return owner?.photo ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${owner?.photo?.hashName}` : '';
    }
  },
  methods: {
    onImageClick() {
      if (this.isFullScreen) {
        this.isMaximize = !this.isMaximize;
      } else {
        this.isFullScreen = true;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/shared.scss";
  .preview__modal-description {
    z-index: 5000;
    position: fixed;
    height: 50px;
    background-color: white;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 30px;
  }

  .preview-file__header {
    margin: -1rem; // offset modal body padding
    padding: 10px;
  }

  .preview-file__image {
    width: 100%;
    height: auto;
    cursor: nesw-resize;
  }

  .preview-file__embed {
    width: 100%;
    height: 100%;
  }

  .preview-file__owner {
    display: flex;
    flex-direction: row;
  }

  .preview-file__title-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .preview-file__title {
    font-size: 18px;
    margin: 0;
  }

  .preview-file__details {
    padding: 0 15px;
  }
  .preview-file__file-name {
    font-size: 19px;
    font-weight: 600;
  }

  .preview-file__uploader {
    font-size: 14px;
  }

  .file-content {
    height: 100%;
    width: 100%;
    //display: flex;
    //flex-direction: column;
    //align-items: center;
    //justify-content: center;

    &.scrollable {
      overflow: auto;
    }

    .embed-responsive {
      height: 100%;
    }
  }

  .file-container {
    height: calc(100vh - 200px);
    margin: -1rem; // offset modal body padding
    display: flex;
    flex-direction: column;
    position: relative;

    &.fullscreen {
      position: fixed;
      background-color: $black;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      margin: 0;

      .preview-file__image {
        height: 100%;
        width: auto;
      }

      .file-content {
        //height: calc(100% - 50px);
        display: block;
        text-align: center;
        flex: 1;
      }

      .preview-file__image {
        height: calc(100% - 40px);
        cursor: zoom-in;
        max-height: none;

        &.maximize {
          width: 100%;
          height:  auto;
          cursor: zoom-out;
        }
      }
    }
  }

  .file-container__header {
    padding: 10px 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 50px;
  }

  .file-container__fullscreen-actions {
    margin-left: auto;
  }

  .file-container__fullscreen-action {
    border: 0;
    outline: 0;
    background: none;
    color: $white;
  }

  .file-container__header-title {
    color: $white;
    font-size: 20px;

    @include for-size(phone-only) {
      font-size: 18px;
    }
  }

  .preview-file__navs  {
    position: absolute;
    border: 0;
    outline: 0;
    top: 30%;
    background: none;
    color: $white;
  }

  .preview-file__nav-left {
    left: -40px;
  }

  .preview-file__nav-right {
    right: -40px;
  }

  .nav-dots__container {
    width: 100%;
    position: absolute;
    z-index: 2;
    bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    top: -35px;
    height: 20px;
  }

  .nav-dots {
    list-style: none;
    display: flex;
    flex-direction: row;
  }

  .nav-dots__item {
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background-color: $gray;
    border: 3px solid $brand-primary;
    margin: 0 4px;
    opacity: .85;

    &.active {
      border-radius: 5px;
      background-color: $brand-primary;
      border: 0;
      opacity: 1;
    }
  }

  .preview-file__footer {
    position: relative;
  }

</style>
