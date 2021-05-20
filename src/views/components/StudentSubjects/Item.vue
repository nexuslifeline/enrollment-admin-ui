<template>
  <div class="student-subject__list-item">
    <div class="item__content">
      <vText :fontSize="16" weight="bold">{{ `${data.code || 'N/A' } - ${data.description}` }}</vText>
      <vText size="s" color="light" v-if="data.section" class="item__sub-text">
        <span>
          {{ `${data.section ? data.section.name : ''}` }}
        </span>
        <span>
          {{ instructor }}
        </span>
        <span>
          {{ subjectSchedule }}
        </span>
      </vText>
    </div>
    <div>
      <InputGroup>
        <InputInline>
          <Toggle :value="data.pivot.isDropped" @input="checked => $emit('onChange', { data, checked })" />
          <span class="ml-2">Dropped</span>
        </InputInline>
      </InputGroup>
    </div>
  </div>
</template>
<script>

import { Days } from "../../../helpers/enum";

export default {
  Days,
  components: {

  },
  props: {
    data: {
      type: [Object],
    }
  },
  methods: {
    onChange() {
      
    }
  },
  computed: {
    subjectSchedule() {
      const schedule = []
      const { sectionSchedule } = this.data
      if(sectionSchedule) {
        sectionSchedule.forEach(sched => {
          schedule.push(`${this.$options.Days.getEnum(sched.dayId).abbrev}  ${sched.startTime} - ${sched.endTime}`)
        });
      }
      return schedule.join(' | ')
    },
    instructor() {
      let instructor = ''
      const { sectionSchedule } = this.data
      if(sectionSchedule) {
        instructor = sectionSchedule[0].personnel.name
      }
      return instructor
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

.student-subject__list-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid $light-gray-10;

  &:last-child {
    margin-bottom: 0;
    border-bottom: 0;
  }
}

.item__content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.item__sub-text {
  span {
    &::after {
      content: '\25CF';
      margin: 0 7px;
    }

    &:last-child::after {
      content: '';
      margin: 0;
    }
  }
}
</style>
