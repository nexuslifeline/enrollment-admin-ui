<template>
  <div class="attachment-list-container">
    <Item
      v-for="(item, idx) in items"
      :data="item"
      :key="idx"
    />
    <slot></slot>
  </div>
</template>

<script>
import Item from './Item';
import { StudentFileApi } from '../../../mixins/api';
export default {
  components: {
    Item
  },
  mixins: [StudentFileApi],
  props: {
    studentId: {
      type: [String, Number]
    },
  },
  data() {
    return {
      items: [],
      meta: {}
    }
  },
  created() {
    this.getStudentFileList(this.studentId).then(({ data: { data, meta } }) => {
      this.items = data;
      this.meta = meta;
    });
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