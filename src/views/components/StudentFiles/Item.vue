<template>
  <div class="attachment-item">
    <BIconImage scale="1.6" class="attachment-item__icon" />
    <div class="attachment-item__details" @click="$emit('onView', data)">
      <div class="attachment-item__title">{{ data.name }}</div>
      <div class="attachment-item__size">
        <span>{{ data.size }} KB</span>
      </div>
    </div>
    <div class="attachment-item__actions">
      <b-dropdown size="lg"  variant="link" no-caret>
      <template #button-content>
        <v-icon name="ellipsis-v" />
      </template>
      <b-dropdown-item @click.prevent="() => downloadFile(data)">
        Download
      </b-dropdown-item>
      <b-dropdown-item @click.prevent="$emit('onView', data)">
        View
      </b-dropdown-item>
    </b-dropdown>
    </div>
  </div>
</template>

<script>
import { StudentFileApi } from '../../../mixins/api';
import { download } from '../../../helpers/utils';
export default {
  download,
  props: {
    data: [Object]
  },
  mixins: [StudentFileApi],
  methods: {
    downloadFile(data) {
      this.getStudentFilePreview(data.studentId, data.id).then((response) => {
        this.$options.download(response?.data, response?.headers.contentType, data.name);
      });
    },
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .attachment-item {
    flex-grow: 1;
    flex-basis: 33%;
    max-width: calc(33% - 7.5px);
    height: 50px;
    margin: 7.5px 7.5px 7.5px 0;
    padding: 3px;
    background-color: $light-blue-100;
    border-radius: 3px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px 15px;
    border: .5px solid $blue;
    padding-right: 0;
    min-width: 250px;

    @include for-size(tablet-landscape-down) {
      flex-basis: 50%;
      max-width: 50%;
    }

    @include for-size(phone-only) {
      flex-basis: 100%;
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
    color: $blue;
  }

  .attachment-item__details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 15px;
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
    font-size: 12px;

    &:hover {
      cursor: pointer;
    }
  }

  .attachment-item__actions {
    flex: 0;
    background-color: transparent;
    display: inline-flex;
    padding: 0;
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

  .more__action {
    outline: none;
    border: 0;
    background: none;
  }

</style>