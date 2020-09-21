<template>
  <div class="schedule-view__container">
    <div class="schedule-view__days">
      <div v-for="(day, idx) in days" :key="idx" class="schedule-view__day-item">
        {{day}}
      </div>
    </div>
    <div class="schedule-view__main-area">
      <div class="schedule-view__times">
        <div
          v-for="(item, idx) in times"
          v-if="showExtendedTime || (!showExtendedTime && idx < $options.constants.EXTENDED_TIME_START_INDEX)"
          :key="idx"
          class="schedule-view__time-item"
          :style="{ height: `${cellHeight}px` }">
          {{formatTo12hr(item)}}
        </div>
      </div>
      <div v-for="(day, dayIndex) in Array.from({ length: days.length })" :key="dayIndex" class="schedule-view__column">
        <template
          v-for="(time, idx) in times"
          v-if="showExtendedTime || (!showExtendedTime && idx < $options.constants.EXTENDED_TIME_START_INDEX)">
          <template v-for="dayTimeKey in [`${dayIndex}-${idx}`]">
            <template v-if="hasTimeGroup(dayIndex, time)">
              <template v-for="timeGroup in [...getCurrentTimeGroup(dayIndex, time) || {}]">
                <template v-if="!!timeGroup.data">
                  <template v-for="factory in [$options.colorFactory(timeGroup.data.id % $options.constants.COLOR_FACTORY_LENGTH)]">
                    <div v-if="isFirstSelected(dayIndex, time, timeGroup)"
                      :key="idx"
                      :style="{
                        height: `${computeHeight(timeGroup)}px`,
                        backgroundColor: `${factory.light}`,
                        borderLeft: `4px solid ${factory.bg}`,
                        color: `${factory.bg}`
                      }"
                      class="schedule-view__cell-item selected">
                      <div class="time-group__details">
                        <p class="time-group__title">
                          {{timeGroup.data.title}}
                        </p>
                        <p class="time-group__description">
                          {{timeGroup.data.description}}
                        </p>
                      </div>
                      <p class="time-group__time">
                        <v-icon name="clock" scale=".8" class="mr-2" />
                        {{formatTo12hr(timeGroup.start)}} - {{formatTo12hr(timeGroup.end)}}
                      </p>
                      <button
                        v-if="!!options && !!options.length"
                        @click.stop="toggleDropdown(dayTimeKey)"
                        :style="{
                          color: `${factory.bg}`
                        }"
                        class="time-group__options">
                        <span class="time-group__option-items">
                          <v-icon name="ellipsis-v" scale=".8" />
                          <div v-if="openItems.includes(dayTimeKey)" class="time-group__option-dropdown-area">
                            <ul class="time-group__option-dropdown">
                              <li
                                v-for="(option, optIdx) in options"
                                @click="option.callback(timeGroup)"
                                :key="optIdx"
                                class="time-group__option-dropdown-item">
                                {{option.label}}
                              </li>
                            </ul>
                          </div>
                        </span>
                      </button>
                    </div>
                    <template v-for="formattedTime in [`${time.h}:${time.m}`]">
                      <div
                        v-if="isLastSelected(dayIndex, time, timeGroup) && !hasSelectedWithStartTime(dayIndex, time)"
                        :key="idx"
                        class="schedule-view__cell-item"
                        :class="{ highlighted: highlightedItems.includes(dayTimeKey) }"
                        @click="$emit('onCellItemClick', { dayIndex, time: formattedTime })"
                        @dblclick="$emit('onCellItemDblClick', { dayIndex, time: formattedTime })"
                        @mousedown="onCellMousedown(dayIndex, idx)"
                        @mouseup="onCellMouseup(dayIndex, idx)"
                        @mouseover="onCellMouseover(dayIndex, idx)"
                        :style="{ height: `${cellHeight / 2}px` }"
                      />
                    </template>
                  </template>
                </template>
              </template>
            </template>
            <template v-else>
              <template v-for="formattedTime in [`${time.h}:${time.m}`]">
                <div
                  :key="idx"
                  class="schedule-view__cell-item"
                  :class="{ highlighted: highlightedItems.includes(dayTimeKey) }"
                  @click="$emit('onCellItemClick', { dayIndex, time: formattedTime })"
                  @dblclick="$emit('onCellItemDblClick', { dayIndex, time: formattedTime })"
                  @mousedown="onCellMousedown(dayIndex, idx)"
                  @mouseup="onCellMouseup(dayIndex, idx)"
                  @mouseover="onCellMouseover(dayIndex, idx)"
                  :style="{ height: `${cellHeight}px` }"
                />
              </template>
            </template>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { colorFactory, getColorFactoryLength } from '../../helpers/colors';

const COLOR_FACTORY_LENGTH = getColorFactoryLength();
const TIME_OFFSET = 7;
const TIME_LENGTH = 16;
const EXTENDED_TIME_START_INDEX = 24;

export default {
  colorFactory,
  constants: {
    COLOR_FACTORY_LENGTH,
    TIME_OFFSET,
    TIME_LENGTH,
    EXTENDED_TIME_START_INDEX
  },
  props: {
    showExtendedTime: {
      type: Boolean,
      default: false
    },
    cellHeight: {
      type: Number,
      default: 40
    },
    selectedItems: [Array],
    options: [Array]
  },
  data() {
    return {
      times: [],
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      openItems: [],
      highlightedItems: []
    }
  },
  created() {
    const offset = this.$options.constants.TIME_OFFSET;
    const length = this.$options.constants.TIME_LENGTH;
    Array.from({ length }).forEach((v, idx) => this.addTimeItem(idx + offset));
  },
  mounted() {
    window.addEventListener('click', this.hideDropdownItems)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.hideDropdownItems)
  },
  methods: {
    addTimeItem(h) {
      this.times.push({ h, m: "00" }, { h, m: "30" });
    },
    formatTo12hr(time) {
      if (time && typeof time === 'string') {
        const h = time.trim().split(':')[0];
        const m = time.trim().split(':')[1];
        return this.formatTo12hr({ h, m });
      }

      const hour = parseInt(time.h);
      return `${(hour + 11) % 12 + 1}:${time.m} ${hour > 11 && hour < 24 ? 'pm' : 'am'}`;
    },
    isFirstSelected(cellDay, cellTime, timeGroup) {
      if (!!Object.keys(timeGroup)?.length) {
        return this.isEqualToTimeStart(cellTime, timeGroup.start);
      }
      return false;
    },
    isLastSelected(cellDay, cellTime, timeGroup) {
      if (!!Object.keys(timeGroup)?.length) {
        return this.isEqualToTimeEnd(cellTime, timeGroup.end);
      }
      return false;
    },
    hasSelectedWithStartTime(cellDay, cellTime) {
      return this.selectedItems.some(v => v.dayIndex === cellDay && this.isEqualToTimeStart(cellTime, v.start));
    },
    isEqualToTimeStart(cellTime, timeGroupStart) {
      const iCellTime = parseInt(`${cellTime.h}${cellTime.m}`);
      return iCellTime === this.convertToTimeInt(timeGroupStart);
    },
    isEqualToTimeEnd(cellTime, timeGroupEnd) {
      const iCellTime = parseInt(`${cellTime.h}${cellTime.m}`);
      return iCellTime === this.convertToTimeInt(timeGroupEnd);
    },
    isTimeBetween(cellTime, { start, end }) {
      const iCellTime = parseInt(`${cellTime.h}${cellTime.m}`);
      return iCellTime >= this.convertToTimeInt(start) && iCellTime <= this.convertToTimeInt(end);
    },
    getCurrentTimeGroup(cellDay, cellTime) {
      return this.selectedItems.filter(v =>
        v.dayIndex === cellDay && this.isTimeBetween(cellTime, { start: v.start, end: v.end })
      ) || {};
    },
    hasTimeGroup(cellDay, cellTime) {
      return this.selectedItems.some(v =>
        v.dayIndex === cellDay && this.isTimeBetween(cellTime, { start: v.start, end: v.end })
      );
    },
    isFirstOnHalfCell(timeGroup) {
      return this.selectedItems.some(v => v.dayIndex === timeGroup.dayIndex && this.convertToTimeInt(v.end) === this.convertToTimeInt(timeGroup.start))
    },
    convertToTimeInt(v) {
      return parseInt(v?.replace(':', '')?.trim());
    },
    getRowSpan({ start, end }) {
      const occurrences = this.times.filter(v => this.isTimeBetween(v, { start, end }));
      return occurrences.length || 0;
    },
    computeHeight(timeGroup) {
      const multiplier = parseInt(this.getRowSpan(timeGroup));
      const cellHeight = parseInt(this.cellHeight);
      const computedHeight = (cellHeight * multiplier) - (this.isFirstOnHalfCell(timeGroup) ? cellHeight : (cellHeight / 2));
      return computedHeight;
    },
    toggleDropdown(key) {
      if (this.openItems.length) {
        this.openItems = [];
      } else {
        this.openItems = [key];
      }
    },
    hideDropdownItems() {
      this.openItems = [];
    },
    isAlreadyHighlighted(key) {
      return this.highlightedItems.includes(key);
    },
    onCellMousedown(dayIndex, timeIdx) {
      this.isMousedown = true;
      this.activeSelectiondayIndex = dayIndex;
      const key = `${dayIndex}-${timeIdx}`;
      if (!!this.highlightedItems.length) {
        this.highlightedItems = [key];
      } else {
        this.highlightedItems.push(key);
      }
    },
    onCellMouseup(dayIndex, timeIdx) {
      this.isMousedown = false;
      if (this.highlightedItems.length > 1) { // should be more than 1 cell to fire the event
        const startIdx = this.highlightedItems[0]?.split('-')[1];
        const endIdx = this.highlightedItems[this.highlightedItems.length - 1]?.split('-')[1];
        const start = this.times[startIdx];
        const end = this.times[endIdx];

        this.$emit('onMultipleCellSelect', {
          dayIndex,
          startTime: `${start?.h}:${start?.m}`,
          endTime: `${end?.h}:${end?.m}`
        });
      }
    },
    onCellMouseover(dayIndex, timeIdx) {
      if (this.isMousedown && this.activeSelectiondayIndex === dayIndex) {
        this.highlightedItems.push(`${dayIndex}-${timeIdx}`);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../assets/scss/shared.scss";

  .schedule-view__container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    border: 1px solid $light-gray-10;
  }

  .schedule-view__days {
    display: flex;
    padding-left: 80px;
    border-bottom: 1px solid $light-gray-10;
  }

  .schedule-view__day-item {
    flex: 1;
    padding: 5px;
    text-align: center;
    font-weight: 500;
    font-size: 14px;
  }

  .schedule-view__main-area {
    display: flex;
  }

  .schedule-view__times {
    display: flex;
    flex-direction: column;
    border-right: 1px solid $light-gray-10;
    width: 80px;
  }

  .schedule-view__time-item {
    width: 100%;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px dashed $light-gray-10;


    &:last-child {
      border: 0;
    }
  }

  .schedule-view__column {
    flex: 1;
    border-right: 1px solid $light-gray-10;
    display: flex;
    flex-direction: column;

    &:last-child {
      border: 0;
    }
  }

  .schedule-view__cell-item {
    //flex: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px dashed $light-gray-10;
    position: relative;

    &:last-child {
      border: 0;
    }

    &:hover {
      cursor: pointer;
      background-color: $light-blue-gray;
    }

    &.selected {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      //background-color: $blue;
      //border: 1px solid red;
    }

    &.highlighted {
      background-color: $light-blue;
    }

  }

  .time-group__details {
    padding: 5px;
    flex: 1;
  }

  .time-group__title {
    margin: 0;
    font-weight: 500;
    font-size: 13px;
  }

  .time-group__description {
    margin: 0;
    font-weight: normal;
    font-size: 12px;
  }

  .time-group__time {
    margin-top: auto;
    font-size: 12px;
    margin: 0;
    padding: 5px;
    font-weight: 500;
    display: flex;
    align-items: center;
  }

  .time-group__options {
    border: 0;
    margin: 0;
    position: absolute;
    top: 0;
    right: 0;
    background: none;
    padding: 4px;
    outline: 0;
    color: $dark-gray-100;
  }

  .time-group__option-items {
    position: relative;
  }

  .time-group__option-dropdown-area {
    position: absolute;
    background-color: $white;
    border: 1px solid $light-gray-10;
    min-width: 130px;
    border-radius: 3px;
    padding: 5px 0;
    z-index: 2;
  }

  .time-group__option-dropdown {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .time-group__option-dropdown-item {
    text-align: left;
    //border-bottom: 1px solid $light-gray-10;
    padding: 3px 15px;
    font-size: 13px;
    color: $dark-gray-300;

    &:last-child {
      border: 0;
    }

    &:hover {
      background-color: $light-gray-50;
    }
  }

</style>