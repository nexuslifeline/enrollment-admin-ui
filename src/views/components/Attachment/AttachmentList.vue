<template>
  <div class="attachment-list-container">
    <AttachmentItem
      v-for="(v, k) in Array.from({ length: 5 })"
      :data="{ title: 'Statement of Account.pdf', description: '114 KB', id: k}"
      @onDownload="onAttachmentItemDownload"
      @onView="onAttachmentItemView"
    />
  </div>
</template>

<script>
import AttachmentItem from './Attachment';
export default {
  components: {
    AttachmentItem
  },
  props: {
    isBusy: {
      type: [Boolean],
      default: false
    }
  },
  methods: {
    onAttachmentItemDownload(data) {
      this.$emit('onAttachmentItemDownload', data);
    },
    onAttachmentItemView(data) {
      this.$emit('onAttachmentItemView', data);
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .attachment-list-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

</style>