<template>
  <div class="attachment-list-container">
    <template v-if="items.length > 0">
      <Item
        v-for="(item, idx) in items"
        :data="item"
        :key="idx"
        @onView="(item) => onView(item, idx)"
      />
      <ShowMore
        v-if="meta.currentPage !== meta.lastPage"
        @onShowMore="onShowMore"
        :style="{ background: 'none' }"
      />
      <FileViewer
        :show="isShown"
        :file="file"
        :owner="owner || {}"
        :isBusy="file.isLoading"
        @close="isShown = false"
        @onNavLeft="onFileNavLeft"
        @onNavRight="onFileNavRight"
        :navCount="items.length"
        :navActiveIndex="activeNavIndex"
        :enableArrowNav="true"
      />
    </template>
    <template v-else>
      <BSpinner v-if="!isLoaded" class="m-auto" type="grow" />
    </template>
  </div>
</template>

<script>
import Item from './Item';
import { preview } from '../../../helpers/utils';
import { StudentFileApi } from '../../../mixins/api';
export default {
  preview,
  components: {
    Item
  },
  mixins: [StudentFileApi],
  props: {
    studentId: {
      type: [String, Number]
    },
    owner: {
      type: [Object]
    },
  },
  data() {
    return {
      isLoaded: false,
      items: [],
      meta: {},
      file: {},
      isShown: false,
      activeNavIndex: 0
    }
  },
  created() {
    this.loadFiles();
  },
  methods: {
    loadFiles(params, isReset = false) {
      this.getStudentFileList(this.studentId, { ...params }).then(({ data: { data, meta } }) => {
        this.items = [...this.items, ...data];
        this.meta = meta;
        this.isLoaded = true;
      });
    },
    onAttachmentItemDownload(index, item) {
      this.$emit('onAttachmentItemDownload', { index, item });
    },
    onAttachmentItemView(index, item) {
      this.$emit('onAttachmentItemView', { index, item });
    },
    onView(item, idx) {
      this.activeNavIndex = idx;
      this.previewFile(item);
    },
    onFileNavLeft() {
      this.activeNavIndex = this.activeNavIndex === 0 ? this.items.length - 1 : this.activeNavIndex - 1;
      const item = this.items?.[this.activeNavIndex];
      console.log(item)
      this.previewFile(item);
    },
    onFileNavRight() {
      this.activeNavIndex = this.activeNavIndex === this.items.length - 1 ? 0 : this.activeNavIndex + 1;
      const item = this.items?.[this.activeNavIndex];
      this.previewFile(item);
    },
    previewFile(item) {
      this.file.isLoading = true;
      this.getStudentFilePreview(item.studentId, item.id).then(({ data }) => {
        this.file.isLoading = false;
        this.$options.preview(data, data.type, (src) => {
          this.file = { type: data.type, src, name: item.name };
          this.isShown = true;
        });
      });
    },
    onShowMore() {
      this.loadFiles({ page: this.meta.currentPage + 1 });
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