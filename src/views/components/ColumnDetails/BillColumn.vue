<template>
  <div :style="{ position: 'relative' }">
    <div>
      <b-link @click="callback.loadDetails">
        {{ data.billingNo }}
      </b-link>
    </div>
    <div class="label__badges-container">
      <span
        class="label__secondary">
        {{ $options.BillingStatuses.getEnum(data.billingStatusId).name }}
      </span>
      <span
        v-if="data.isForwarded"
        v-b-tooltip.hover
        :title="data.systemNotes"
        class="label__secondary">
        Forwarded
      </span>
    </div>
    <BulletedContent
      :items="[
        `Due: ${$options.toReadableDate(data.dueDate)}`,
        level,
        semester,
        term,
      ]" />
  </div>
</template>

<script>
  import { toReadableDate } from '../../../helpers/utils';
  import { BillingTypes, BillingStatuses } from '../../../helpers/enum';
  export default {
    BillingTypes,
    BillingStatuses,
    toReadableDate,
    props: {
      data: {
        type: [Object]
      },
      callback: {
        type: [Object],
      },
    },
    computed: {
      term() {
        return this.data?.term?.name || '';
      },
      schoolYear() {
        return this.data?.academicRecord?.schoolYear?.name || 'No School Year';
      },
      level() {
        return this.data?.academicRecord?.level?.name || 'No Level';
      },
      semester() {
        return this.data?.academicRecord?.semester?.name || '';
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .label__badges-container {
    display: flex;
    align-items: center;
    position: absolute;
    right: 10px;
    top: 0;

    .label__secondary ~ .label__secondary {
      margin-left: 5px;
    }
  }

  .label__secondary {
    font-size: 10.5px;
    padding: 2px 6px;
    border-radius: 5px;
    color: $dark-gray-300;
    font-weight: 600;
    background-color: $light-gray-100;
    cursor: pointer;
    line-height: 13px;
  }
</style>