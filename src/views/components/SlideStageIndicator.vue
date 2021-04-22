<template>
  <div class="group-stage__container">
    <div class="group-stage__overview">
      <carousel :navigateTo="activeSubHeaderIndex" :autoplay="false" :perPage="1">
        <template v-for="(stage, idx) in stages">
          <template v-if="idx === activeHeaderIndex">
            <slide v-for="(item, index) in stage.children" :key="item.id">
              <div class="group-stage__slide">
                <h4 class="group-stage__number">Stage {{idx + 1}} - {{stage.header}}</h4>
                <h4 class="group-stage__title">{{item.slideTitle || item.subHeader}}</h4>
                <p  class="group-stage__description">
                  {{item.overview || item.description}}
                </p>
                <div class="group-stage__image">
                  <img :src="item.image" />
                </div>
              </div>
            </slide>
          </template>
        </template>
      </carousel>
    </div>
    <div class="indicator__container">
      <ul class="indicator">
        <li
          v-for="(stage, index) in stages"
          class="indicator__item"
          :class="{
            'completed': index < activeHeaderIndex,
            'active': index === activeHeaderIndex
          }">
          <div class="indicator__line"></div>
          <div class="indicator__header">
            <span class="indicator__circle">
              <span class="indicator__inner-circle">
                <transition name="bounce" mode="out-in">
                  <v-icon
                    v-if="index < activeHeaderIndex"
                    name="check"
                    scale="1.1"
                    class="indicator__check-icon"
                  ></v-icon>
                  <span v-else class="indicator__number">
                    {{index + 1}}
                  </span>
                </transition>
              </span>
            </span>
            <!--<span class="indicator__header-text">{{stage.header}}</span>-->
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel';

export default {
  components: {
    Carousel,
    Slide
  },
  props: {
    stages: {
      type: [Array]
    },
    activeId: {
      type: [Number]
    }
  },
  computed: {
    activeHeaderIndex() {
      return this.stages.findIndex((item) => {
        return item.children.map(({ id }) => id).includes(this.activeId);
      });
    },
    activeSubHeaderIndex() {
      const header = this.stages[this.activeHeaderIndex];
      if (!header) return 0;
      return header.children.findIndex(
        (item) => item.id === this.activeId
      )
    }
  },
  mounted() {
    console.log(this.activeHeaderIndex);
  }
}
</script>
<style lang="scss">
  @import "../../assets/scss/shared.scss";

  .group-stage__container .VueCarousel-dot {
    background-color: $dark-blue !important;
    padding: 3px !important;
    height: 10px !important;
    opacity: .4;
    pointer-events: none;
  }

  .group-stage__container .VueCarousel-dot--active {
    background-color: $dark-blue !important;
    width: 35px !important;
    border-radius: 10px !important;
    opacity: 1;
  }

  .group-stage__container .VueCarousel-pagination {
    margin-top: 50px;
  }
</style>
<style lang="scss" scoped>
  @import "../../assets/scss/shared.scss";
  @import "../../assets/scss/animations.scss";

  $size: 37px;

  .group-stage__container {
    width: 100%;
    min-height: 550px;
    height: 100%;
    max-height: 100vh;
    background-color: $light-gray-50;
    display: flex;
    position: relative;
    padding: 30px;
    display: flex;
    justify-content: center;

    @include for-size(desktop-up) {
      padding: 60px;
    }
  }

  .group-stage__overview {
    width: 100%;

    @include for-size(big-desktop-up) {
      max-width: 600px;
    }

  }

  .group-stage__slide {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .group-stage__image {
    margin: 30px 0 50px 0;
    height: 200px;

    @include for-size(big-desktop-up) {
      height: 280px;
    }

    img {
      height: 100%;
      max-width: 100%;
      width: auto;
    }
  }

  .group-stage__description {
    text-align: center;
    font-size: 14px;
    margin: 30px 0 50px 0;
    color: $black;
  }

  .group-stage__number {
    font-size: 14px;
    font-weight: 600;
    color: $dark-blue;
    text-align: center;
    margin: 0;

    @include for-size(big-desktop-up) {
      font-size: 16px;
    }
  }

  .group-stage__title {
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    margin: 5px 0 10px 0;
    color: $black;

    @include for-size(big-desktop-up) {
      font-size: 26px;
      margin: 10px 0;
    }
  }

  .indicator__container {
    position: absolute;
    right: calc(37px / 2 * -1);
    width: $size;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
  }

  .indicator__line {
    position: absolute;
    width: 2px;
    border-left: 1.5px dashed $green;
    top: 50%;
  }

  .indicator {
    list-style: none;
    display: inline-flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0;
    margin: 0;
    box-sizing: border-box;

    & .indicator__item:last-child {
      .indicator__line {
        display:  none;
      }
    }
  }

  .indicator__circle {
    height: $size;
    width: $size;
    overflow: hidden;
    border-radius: 50%;
    background-color: $white;
    padding: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

   .indicator__inner-circle {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 600;
      border-radius: 50%;
      background-color: $gray;
    }

  .indicator__number {
    color: $white;
    font-size: 15px;
    font-weight: 600;
  }

  .indicator__item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 10px;

    &.active {
      .indicator__line {
        height: 50%;
      }

      .indicator__circle {
        border: 1px dashed $green;
      }

      .indicator__inner-circle {
        border: 1px solid $green;
        background-color: $green;
      }
    }

    &.completed {
      .indicator__line {
        height: 100%;
      }

      .indicator__circle {
        border: 0;
        background-color: $white;
      }

      .indicator__inner-circle {
        border: 1px solid $green;
        background-color: $green;
      }
    }
  }

  .indicator__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin: 40px 0;
    z-index: 1;
  }

  .indicator__check-icon {
    color: $white;
  }
</style>