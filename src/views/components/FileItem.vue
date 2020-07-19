<template>
  <div class="file-item">
    <template v-if="!isBusy">
      <v-icon name="file-image" scale="2.7" class="file-item__icon" />
      <div class="file-item__details" @click="$emit('onFileItemSelect', fileIndex)">
        <p v-if="!!title" class="file-item__title">{{title}}</p>
        <p v-if="!!description" class="file-item__description">{{description}}</p>
      </div>
      <div class="file-item__actions">
        <button class="file-item__btn-action" @click="$emit('onFileItemRemove', fileIndex)">
          <v-icon
            name="trash"
            class="file-item__icon-action file-item__icon-trash"
            scale="1.3"
          />
        </button>
        <button class="file-item__btn-action" @click="$emit('onFileItemPreview', fileIndex)">
          <v-icon
            name="search"
            class="file-item__icon-action file-item__icon-preview"
            scale="1.3"
          />
        </button>
        <!--<v-icon
          name="check"
          scale="1.5"
          class="file-item__icon-check"
        />-->
      </div>
    </template>
    <div v-else class="file-item__spinner-container">
      <v-icon
        name="spinner"
        pulse />
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
    title: {
      type: [String]
    },
    description: {
      type: [String]
    },
    fileIndex: {
      type: [Number]
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/shared.scss";

  .file-item {
    margin: 15px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;

    &:hover {
      cursor: pointer;
      background-color: $light-gray;

      .file-item__actions {
        display: flex;
      }
    }
  }

  .file-item__spinner-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }

  .file-item__title {
    margin: 0;
    font-weight: 500;
    color: $dark-gray;
  }

  .file-item__description {
    margin: 0;
    color: $gray;
  }

  .file-item__details {
    margin-left: 18px;
  }

  .file-item__icon {
    color: $gray;
  }

  .file-item__icon-preview {
    color: $gray;
    &:hover {
      color: $dark-gray;
    }
  }

  .file-item__icon-trash {
    color: $gray;
    &:hover {
      color: $dark-gray;
    }
  }

  .file-item__icon-action {
    margin: 0 5px;
  }

  .file-item__icon-check {
    color: $green;
    margin: 0 5px;
  }

  .file-item__actions {
    display: none;
    flex-direction: row;
    margin-left: auto;
  }

  .file-item__btn-action {
    border: 0;
    background-color: transparent;
    outline: 0;
    padding: 0;
    margin: 0;
  }
</style>