<template>
  <ApprovalView @onBack="$router.push(previousRoute)" backTitle="Evaluation">
     <template v-slot:detail>
       <div class="mt-2">
         <b-tabs content-class="mt-3">
          <b-tab title="Personal">
            <StudentView
              v-if="data && data.student && data.academicRecord"
              :data="data.student"
              :studentCategory="data.academicRecord.studentCategory"
            />
          </b-tab>
          <b-tab title="Education">
            
          </b-tab>
        </b-tabs>
       </div>
    </template>
     <template v-slot:content>
       <b-tabs content-class="mt-3">
        <b-tab title="Request">
          <div class="tab__content">
            <AcademicView
              v-if="data && data.academicRecord"
              :data="data.academicRecord"
            />
            <SchoolView
              v-if="!!Object.keys(data).length"
              :data="data"
            />
          </div>
        </b-tab>
        <b-tab title="Account History">
          <div class="tab__content">

          </div>
        </b-tab>
        <b-tab title="Academic Record">
          <div class="tab__content">

          </div>
        </b-tab>
      </b-tabs>
     </template>
  </ApprovalView>
</template>

<script>
  import { EvaluationApi } from '../../../mixins/api';
  export default {
    mixins: [EvaluationApi],
    props: {
      previousRoute: {
        type: [Object]
      }
    },
    data() {
      return {
        data: {}
      }
    },
    computed: {
      evaluationId() {
        return this.$route.params.evaluationId;
      }
    },
    created() {
      this.getEvaluation(this.evaluationId).then(({ data }) => {
        this.data = data;
        console.log(data)
      })
      console.log(this.evaluationId)
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";

  .tab__content {
    margin: 50px 0;
  }
</style>