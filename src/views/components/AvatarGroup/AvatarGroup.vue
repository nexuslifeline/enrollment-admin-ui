<template>
  <div class="avatar-group__container" :id="`avatar-group-tooltip_${uniqId}`">
    <template v-for="(item, idx) in data.slice(0, maxVisible)">
      <template v-if="data.length > maxVisible && idx === (maxVisible - 1)">
        <AvatarMaker
          :key="idx"
          :avatarId="25"
          :size="24"
          :text="`+${data.length - maxVisible}`"
          :borderSize="2"
          :borderColor="'white'"
          containerClass="avatar__container"
          :style="{ right: `calc(${offsetter * (maxVisible - 1)}px - ${(idx * offsetter)}px)`, zIndex: maxVisible - idx }"
        />
      </template>
      <template v-else>
        <AvatarMaker
          :key="idx"
          :avatarId="item.id"
          :size="24"
          :text="getStudentInitial(item)"
          :borderSize="2"
          :borderColor="'white'"
          containerClass="avatar__container"
          :style="{ right: `calc(${offsetter * (maxVisible - 1)}px - ${(idx * offsetter)}px)`, zIndex: maxVisible - idx }"
        />
      </template>
    </template>
    <b-tooltip :target="`avatar-group-tooltip_${uniqId}`">
      <template v-for="(item, idx) in data">
        <div :key="idx" class="avatar-group__tooltip-item">
          <AvatarMaker
            :avatarId="item.id"
            :size="22"
            :text="getStudentInitial(item)"
          />
          <span class="avatar-group__tooltip-item-text">
            {{ item.name }}
          </span>
        </div>
      </template>
      <!-- <p>
      test
      </p>I will stay open when hovered-->
    </b-tooltip> 
  </div>
</template>
<script>

export default {
  props: {
    data: {
      type: [Array]
    },
    maxVisible: {
      type: [Number],
      default: 3
    },
    offsetter: {
      type: [Number],
      default: 17
    }
  },
  created() {
    this.uniqId = Date.now();
  },
  methods: {
    getStudentInitial(data){
      const { firstName, lastName } = data
      return `${firstName && firstName.charAt(0) || ''}${lastName && lastName.charAt(0) || ''}`
    }
  }
};
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/_shared.scss';

  .avatar-group__container {
    display: flex;
    flex-direction: row;
    width: 100%;
    position: relative;
    padding: 2px;
  }

  .avatar__container {
    position: absolute;
  }

  .avatar-group__tooltip-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 5px 0;
  }

  .avatar-group__tooltip-item-text {
    color: $white;
    margin-left: 6px;
  }
</style>