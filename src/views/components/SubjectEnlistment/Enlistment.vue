<template>
  <div>
    <Card
      title="Subjects"
      titleSize="m"
      actionLabel="Add Subject"
      @onAddNew="showSubjectModal = true"
      showAction
      noPaddingBody
      :hasFooter="true">
      <div>
        <SubjectsTable :data="subjects" @onRemove="onRemoveSubject" />
      </div>
      <template v-slot:footer>
        <CardFooterRow>
          <b-button variant="primary" @click="onSave" :disabled="isProcessing">
            <v-icon v-if="isProcessing" name="spinner" spin /> Save Changes
          </b-button>
        </CardFooterRow>
      </template>
    </Card>
    <SubjectListModal
      :show.sync="showSubjectModal"
      v-if="showSubjectModal"
      @onAddSubject="onAddSubject"
      :levelId="data.levelId"
      :courseId="data.courseId"
      :semesterId="data.semesterId"
      :sectionId="data.sectionId" />
  </div>
</template>
<script>
import { showNotification } from '../../../helpers/forms';
import { AcademicRecordApi } from '../../../mixins/api';
import SubjectsTable from './SubjectsTable';
import SubjectListModal from '../SubjectModal/SubjectList'

export default {
  components: {
    SubjectsTable,
    SubjectListModal
  },
  props: {
    academicRecordId: {
      type: [String, Number]
    },
    data: {
      type: [Object]
    }
  },
  mixins: [ AcademicRecordApi ],
  data() {
    return {
      isProcessing: false,
      subjects: [],
      showSubjectModal: false
    }
  },
  created() {
    //console.log('GET subjects here in /academic-records/:id/subjects based on provided academicRecordId props')
    const params = { paginate: false}
    this.getAcademicRecordSubjects(this.academicRecordId, params).then(({ data }) => {
      console.log(data)
      this.subjects = data
    })
  },
  methods: {
    onSave() {
      this.isProcessing = true
      const data = {
        subjects: this.subjects.map(s => { return { 'subjectId' : s.id, 'sectionId' : s.pivot?.sectionId } })
      }
      this.syncAcademicRecordSubjects(data, this.academicRecordId).then(({ data }) => {
        console.log(data)
        showNotification(this, 'success', 'Subjects has been saved.')
        this.isProcessing = false
      }).catch((error) => {
        const errors = error.response.data.errors;
        this.isProcessing = false;
        console.log(errors)
      });
    },
    onAddSubject(data) {
      const { subject, sectionId } = data
      if(this.isSubjectAdded(subject)) {
        showNotification(this, 'warning', 'Subject Already Added!')
        return
      }
      this.$set(subject, 'pivot', { sectionId })
      this.subjects.push(subject)
    },
    onRemoveSubject(subject) {
      this.subjects = this.subjects.filter(s => s.id !== subject.id)
    },
    isSubjectAdded(subject) {
      return this.subjects.find(s => s.id === subject.id)
    }
  },

};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

</style>
