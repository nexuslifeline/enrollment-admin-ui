<template>
  <div class="c-page-content">
    <div class="main-container">
      <div class="main-container__content-area">
        <div class="main-container__main-panel">
          <HeaderProfileCard
            :user="$store.state.user"
          />
          <router-view></router-view>
        </div>
        <div class="main-container__side-panel">
          <CoDepartmentList />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderProfileCard from '../../containers/HeaderProfileCard';
import CoDepartmentList from '../components/CoDepartment/List';
export default {
  components: {
    HeaderProfileCard,
    CoDepartmentList
  },
  data() {
    return {

    };
  },
  created() {
    console.log(this.$store.state)
  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/shared.scss';

.main-container__content-area {
  flex: 1;
  display: flex;
  flex-direction: row;
}

.main-container__side-panel {
  width: 320px;
  height: auto;
  margin-left: 15px;

  @include for-size(tablet-landscape-down) {
    display: none;
  }
}

.main-container {
  height: 100%;
  width: 100%;
  max-width: calc(#{$header-details-row-max-width} + 70px);
  margin: 30px auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  @include for-size(phone-only) {
    flex-direction: column;
    padding: 20px 20px 0 20px;
  }
}

.main-container__main-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
}

</style>
