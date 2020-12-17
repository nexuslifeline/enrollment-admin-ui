<template>
  <div class="attachment-item">
    <div class="attachment-item__icon-container">
      <BIconPaperclip scale="1.6" rotate="40" class="attachment-item__icon" />
    </div>
    <div class="attachment-item__details" @click="$emit('onView', data)">
      <div class="attachment-item__title">{{data[titleKey]}}</div>
      <div class="attachment-item__size">
        <span> {{data[descriptionKey]}}</span>
        <b-badge variant="dark" class="document-type">{{data[documentTypeKey]? data[documentTypeKey].name : '' }}</b-badge>
      </div>
    </div>
    <div class="attachment-item__actions">
      <button @click="$emit('onDownload', data)" class="attachment-item__action">
        <BIconCloudDownload scale="1.3" />
      </button>
      <button @click="$emit('onView', data)" class="attachment-item__action">
        <BIconFolderSymlink scale="1.3" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: [Object],
    titleKey: {
      type: [String],
      default: 'title'
    },
    descriptionKey: {
      type: [String],
      default: 'description'
    },
    documentTypeKey: {
      type: [String],
      default: 'documentType'
    },
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .attachment-item {
    flex: 50%;
    max-width: calc(50% - 15px);
    height: 50px;
    margin: 7.5px 7.5px 7.5px 0;
    padding: 3px;
    background-color: $light-blue-100;
    border-radius: 4px;
    display: flex;
    flex-direction: row;

    @include for-size(tablet-portrait-down) {
      flex: 100%;
      max-width: 100%;
    }
  }

  .attachment-item__icon-container {
    background-color: $blue;
    width: 48px;
    height: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
  }

  .attachment-item__icon {
    color: $white;
  }

  .attachment-item__details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 10px;
  }

  .attachment-item__title {
    color: $blue;
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;

    &:hover {
      cursor: pointer;
    }
  }

  .attachment-item__size {
    color: $dark-gray;
    font-size: 13px;

    &:hover {
      cursor: pointer;
    }
  }

  .attachment-item__actions {
    flex: 0;
    background-color: transparent;
    display: inline-flex;
    padding: 5px 10px;
  }

  .attachment-item__action {
    background-color: transparent;
    outline: 0;
    border: 0;
    margin: 0 4px;
    color: $dark-gray-500;
  }

  .document-type {
    margin-left: 10px;
  }

</style>