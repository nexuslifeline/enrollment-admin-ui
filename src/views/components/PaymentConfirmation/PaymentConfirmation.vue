<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Confirm"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    @hidden="$emit('update:isShown', false)"
    :centered="true">
    <div class="modal-field-container overflow-visible">
      <template v-for="(item, idx) in data">
        <template v-if="!!item.description">
          <div class="underline" :key="`l-${idx}`" v-if="item.underline" />
          <ContentItem
            :key="idx"
            :label="item.label"
            :description="item.description"
            :blue="item.blue"
            :red="item.red"
            :medium="item.medium"
            :column="item.column"
          />
        </template>
      </template>
    </div>
    <template v-slot:modal-footer>
      <b-button variant="primary" @click="$emit('onConfirm')" :disabled="isConfirming" block>
        <v-icon name="spinner" spin v-if="isConfirming"/>
        Confirm Payment
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import ContentItem from './ContentItem';
export default {
  components: {
    ContentItem
  },
  props: {
    isConfirming: {
      type: [Boolean],
      default: false
    },
    isShown: {
      type: [Boolean]
    },
    isConfirmBusy: {
      type: [Boolean]
    },
    data: {
      type: [Array]
    }
  },
  mixins: [],
  data() {
    return {}
  },
  created() {

  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/_shared.scss';

  .underline {
    border-top: 1px solid $light-gray-200;
    margin: 15px 0;
  }
</style>