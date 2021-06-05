<template>
  <ApprovalView
    :showOptions="false"
    :showFooter="true"
    @onBack="$router.push(previousRoute)"
    backTitle="Enrollment List">
    <template v-slot:content>
      <div class="quick-enroll__body">
        <div class="quick-enroll__side-panel">
          <StageIndicator
            :stages="stages"
            :activeIndex="selectedIndex"
            @selectedItem="onSelectStage"
          />
        </div>
        <div v-if="!!Object.keys(data).length" class="quick-enroll__content-area">
          <template v-if="selectedIndex === 0">
            <Personal :data="data.student || {}" />
            <Account :data="data.student.user || {}" />
          </template>
          <template v-else-if="selectedIndex === 1">

          </template>
          <template v-else-if="selectedIndex === 2">

          </template>
        </div>
      </div>
    </template>
  </ApprovalView>
</template>

<script>
import Personal from '../../components/Student/Personal';
import Account from '../../components/Student/Account';
import { AcademicRecordApi } from '../../../mixins/api';

export default {
  mixins: [AcademicRecordApi],
  props: {
    previousRoute: {
      type: [Object]
    }
  },
  components: {
    Personal,
    Account
  },
  data() {
    return {
      selectedIndex: 0,
      data: {},
      stages: [
        {
          header: 'Profile and Account',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.'
        },
        {
          header: 'Academic Info',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        },
        {
          header: 'Subject Enlistment',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        }
      ]
    }
  },
  computed: {
    academicRecordId() {
      return this.$route.params.academicRecordId;
    }
  },
  created() {
    this.getAcademicRecord(this.academicRecordId).then(({ data }) => {
      this.data = data;
      console.log('data', data)
    });
  },
  methods: {
    onSelectStage(idx) {
      this.selectedIndex = idx;
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

   .approval__content {
    margin: 0;
    width: 100%;
    position: relative;
  }

  .quick-enroll__body {
    display: flex;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    flex: 1;
  }

  .quick-enroll__side-panel {
    width: 300px;
    //border-right: 1px solid $light-gray-10;
    padding: 30px;

    @include for-size(phone-only) {
      display: none;
    }
  }

  .quick-enroll__content-area {
    padding: 30px;
    flex: 1;
  }
</style>