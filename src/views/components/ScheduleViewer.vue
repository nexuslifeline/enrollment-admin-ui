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
          v-if="showExtendedTime || (!showExtendedTime && idx < 24)"
          :key="idx"
          class="schedule-view__time-item"
          :style="{ height: `${cellHeight}px` }">
          {{formatTo12hr(item)}}
        </div>
      </div>
      <div v-for="(day, dayIdx) in Array.from({ length: days.length })" :key="dayIdx" class="schedule-view__column">
        <template v-for="(time, idx) in times" v-if="showExtendedTime || (!showExtendedTime && idx < 24)">
          <template v-if="!!getCurrentTimeGroup(dayIdx, time).data">
            <div v-if="isFirstSelected(dayIdx, time)"
              :key="idx"
              :style="{
                height: `${computeHeight(getCurrentTimeGroup(dayIdx, time))}px`,
                backgroundColor: `${$options.colorFactory(getCurrentTimeGroup(dayIdx, time).data.id % 16).light}`,
                borderLeft: `4px solid ${$options.colorFactory(getCurrentTimeGroup(dayIdx, time).data.id % 16).bg}`,
                color: `${$options.colorFactory(getCurrentTimeGroup(dayIdx, time).data.id % 16).bg}`
              }"
              class="schedule-view__cell-item"
              :class="{ selected: isSelected(dayIdx, time) }">
              <div class="time-group__details">
                <p class="time-group__title">
                  {{getCurrentTimeGroup(dayIdx, time).data.title}}
                </p>
                <p class="time-group__description">
                  {{getCurrentTimeGroup(dayIdx, time).data.description}}
                </p>
              </div>
              <p class="time-group__time">
                {{formatTo12hr(getCurrentTimeGroup(dayIdx, time).start)}} - {{formatTo12hr(getCurrentTimeGroup(dayIdx, time).end)}}
              </p>
              <button
                v-if="!!options && !!options.length"
                @click.stop="toggleDropdown(`${dayIdx}${idx}`)"
                :style="{
                  color: `${$options.colorFactory(getCurrentTimeGroup(dayIdx, time).data.id % 16).bg}`
                }"
                class="time-group__options">
                <span class="time-group__option-items">
                  <v-icon name="ellipsis-v" scale=".8" />
                  <div v-if="openItems.includes(`${dayIdx}${idx}`)" class="time-group__option-dropdown-area">
                    <ul class="time-group__option-dropdown">
                      <li
                        v-for="(option, optIdx) in options"
                        @click="option.callback(getCurrentTimeGroup(dayIdx, time))"
                        :key="optIdx"
                        class="time-group__option-dropdown-item">
                        {{option.label}}
                      </li>
                    </ul>
                  </div>
                </span>
              </button>
            </div>
          </template>
          <div
            v-else
            :key="idx"
            class="schedule-view__cell-item"
            :class="{ highlighted: highlightedItems.includes(`${dayIdx}-${idx}`) }"
            @click="$emit('onCellItemClick', { dayIdx, time: `${times[idx].h}:${times[idx].m}` })"
            @dblclick="$emit('onCellItemDblClick', { dayIdx, time: `${times[idx].h}:${times[idx].m}` })"
            @mousedown="onCellMousedown(dayIdx, idx)"
            @mouseup="onCellMouseup(dayIdx, idx)"
            @mouseover="onCellMouseover(dayIdx, idx)"
            :style="{ height: `${cellHeight}px` }"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { colorFactory } from '../../helpers/colors';
export default {
  colorFactory,
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
    const offset = 7;
    Array.from({ length: 16 }).forEach((v, idx) => this.addTimeItem(idx + offset));
  },
  mounted() {
    window.addEventListener('click', this.hideDropdownItems)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.hideDropdownItems)
  },
  methods: {
    addTimeItem(h) {
      this.times.push({ h, m: "00" });
      this.times.push({ h, m: "30" });
    },
    formatTo12hr(time) {
      if (time && typeof time === 'string') {
        const h = time.trim().split(':')[0];
        const m = time.trim().split(':')[1];
        return this.formatTo12hr({ h, m });
      }

      const hour = parseInt(time.h);
      return `${(hour + 11) % 12 + 1}:${time.m} ${hour > 12 ? 'pm' : 'am'}`;
    },
    isSelected(cellDay, cellTime) {
      const daySelected = this.getCurrentTimeGroup(cellDay, cellTime);
      if (!!Object.keys(daySelected)?.length) {
        const { start, end } = daySelected;
        return this.isTimeBetween(cellTime, { start, end });
      }
      return false;
    },
    isFirstSelected(cellDay, cellTime) {
      const timeGroup = this.getCurrentTimeGroup(cellDay, cellTime);
      if (!!Object.keys(timeGroup)?.length) {
        return this.isTimeStart(cellTime, timeGroup.start);
      }
      return false;
    },
    isTimeStart(cellTime, timeGroupStart) {
      const iCellTime = parseInt(`${cellTime.h}${cellTime.m}`);
      return iCellTime === this.convertToTimeInt(timeGroupStart);
    },
    isTimeBetween(cellTime, { start, end }) {
      const iCellTime = parseInt(`${cellTime.h}${cellTime.m}`);
      return iCellTime >= this.convertToTimeInt(start) && iCellTime <= this.convertToTimeInt(end);
    },
    getCurrentTimeGroup(cellDay, cellTime) {
      return this.selectedItems.find(v => v.dayIndex === cellDay && this.isTimeBetween(cellTime, { start: v.start, end: v.end })) || {};
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
      return (parseInt(this.cellHeight) * multiplier);
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
    onCellMousedown(dayIdx, timeIdx) {
      this.isMousedown = true;
      this.activeSelectionDayIdx = dayIdx;
      const key = `${dayIdx}-${timeIdx}`;
      if (!!this.highlightedItems.length) {
        this.highlightedItems = [key];
      } else {
        this.highlightedItems.push(key);
      }
    },
    onCellMouseup(dayIdx, timeIdx) {
      this.isMousedown = false;
      if (this.highlightedItems.length > 1) { // should be more than 1 cell to fire the event
        const startIdx = this.highlightedItems[0]?.split('-')[1];
        const endIdx = this.highlightedItems[this.highlightedItems.length - 1]?.split('-')[1];
        const start = this.times[startIdx];
        const end = this.times[endIdx];

        this.$emit('onMultipleCellSelect', {
          dayIdx,
          startTime: `${start?.h}:${start?.m}`,
          endTime: `${end?.h}:${end?.m}`
        });
      }
    },
    onCellMouseover(dayIdx, timeIdx) {
      if (this.isMousedown && this.activeSelectionDayIdx === dayIdx) {
        this.highlightedItems.push(`${dayIdx}-${timeIdx}`);
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