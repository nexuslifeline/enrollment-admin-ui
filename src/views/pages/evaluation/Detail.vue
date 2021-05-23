<template>
  <ActiveRowViewer @onBack="$router.push(previousRoute)">
     <template v-slot:navigation>
      <ActiveViewLinks
        :items="[
          {
            text: 'Student Information',
            target: 'header-student-information',
          },
          {
            text: 'Educational Background',
            target: 'header-educational-background',
          },
          {
            text: 'Application & Evaluation',
            target: 'header-current-application',
          },
        ]"
      />
    </template>
     <template v-slot:content>
       <StudentView
        v-if="data && data.student && data.academicRecord"
        :data="data.student"
        :studentCategory="data.academicRecord.studentCategory"
      />
      <SchoolView
        v-if="!!Object.keys(data).length"
        :data="data"
      />
      <AcademicView
        v-if="data && data.academicRecord"
        :data="data.academicRecord"
      />
     </template>
  </ActiveRowViewer>
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
</style>