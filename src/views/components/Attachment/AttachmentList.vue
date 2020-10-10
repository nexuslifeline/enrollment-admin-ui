<template>
  <div class="attachment-list-container">
    <AttachmentItem
      v-for="(item, idx) in items"
      :data="item"
      :key="idx"
      :titleKey="titleKey"
      :descriptionKey="descriptionKey"
      @onDownload="(v) => onAttachmentItemDownload(idx, v)"
      @onView="(v) => onAttachmentItemView(idx, v)"
    />
    <slot></slot>
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
    },
    items: {
      type: [Array]
    },
    titleKey: {
      type: [String],
      default: 'title'
    },
    descriptionKey: {
      type: [String],
      default: 'description'
    },
  },
  methods: {
    onAttachmentItemDownload(index, item) {
      this.$emit('onAttachmentItemDownload', { index, item });
    },
    onAttachmentItemView(index, item) {
      this.$emit('onAttachmentItemView', { index, item });
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