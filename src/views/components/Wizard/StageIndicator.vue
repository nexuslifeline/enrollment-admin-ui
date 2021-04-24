<template>
  <ul class="indicator">
    <li
      v-for="(stage, index) in stages"
      :class="{'indicator__item': true, 'active': [activeIndex].includes(index) }"
      @click="$emit('selectedItem', index)">
      <span class="indicator__number">{{index + 1}}</span>
      <div class="indicator__text-container">
        <span class="indicator__headline">{{stage[headerKey]}}</span>
        <p v-if="[activeIndex].includes(index)" class="indicator__description fade-in">
          {{stage[descriptionKey]}}
        </p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    stages: {
      type: [Array]
    },
    activeIndex: {
      type: [Number],
      default: 0
    },
    headerKey: {
      type: [String],
      default: 'header'
    },
    descriptionKey: {
      type: [String],
      default: 'description'
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .indicator {
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0;
    margin: 0;
  }

  .indicator__item {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: 15px;

    &:hover {
      cursor: pointer;
    }

    &.active {
      .indicator__number {
        background-color: $blue;
      }
      .indicator__headline {
        color: $blue;
      }
    }
  }

  .indicator__text-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 5px 0;
  }

  .indicator__headline {
    font-size: 16px;
    font-weight: 500;
    color:  $light-blue;
  }

  .indicator__description {
    color: $gray;
    margin: 0;
    opacity: 0;
    -webkit-transition: all 2s;
    -moz-transition: all 2s;
    transition: all 2s;

    &.fade-in {
      opacity: 1;
    }
  }

  .indicator__number {
    background-color: $light-blue;
    color: $white;
    height: 33px;
    width: 33px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    border-radius: 50%;
    font-size: 16px;
    font-weight: 500;
  }
</style>