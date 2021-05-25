<template>
  <div>
     <ActiveViewItems>
      <ActiveViewItem label="Curriculum" @onEdit="onEditCurriculum" isEditable>
        <p>
          {{ data.curriculum && data.curriculum.name || 'No Curriculum' }}
        </p>
      </ActiveViewItem>
      <ActiveViewItem
        v-if="data.course"
        label="Course"
        @onEdit="onEditCourse"
        isEditable>
        <p>
          {{ data.course && data.course.name || 'No Course' }}
        </p>
      </ActiveViewItem>
      <ActiveViewItem label="Level">
        <p>
          {{ data.level && data.level.name || 'No Level' }}
        </p>
      </ActiveViewItem>
      <ActiveViewItem v-if="data.semester" label="Semester">
        <p>
          {{ data.semester && data.semester.name || 'No Semester' }}
        </p>
      </ActiveViewItem>
    </ActiveViewItems>
    <ChangeCurriculum
      @onCancel="isShowChangeCurriculum = false"
      :data.sync="data.academicRecord"
      :isConfirmBusy="isChangingCurriculum"
      :isShown.sync="isShowChangeCurriculum"
    />
  </div>
</template>
<script>
import { AcademicRecordApi, CurriculumApi } from '../../../mixins/api';
import ChangeCurriculum from './ChangeCurriculum';

export default {
  props: {
    data: {
      type: [Object]
    }
  },
  mixins: [ CurriculumApi, AcademicRecordApi ],
  data() {
    return {
      isCreatingTranscript: false,
      isShowChangeCurriculum: false,
      isChangingCurriculum: false, //processing saving of curriculum
      options: {
        curriculums: {
          items: []
        },
        studentCurriculums: {
          items: []
        }
      }
    }
  },
  components: {
    ChangeCurriculum
  },
  methods: {
    onEditCurriculum() {
      this.isShowChangeCurriculum = true;
    },
    onEditCourse() {

    },
    onAcceptTransferCredit() {
      const { curriculumId } = this.data
      if(!curriculumId) {
        showNotification(this,'danger', 'Curriculum is required before accepting credit.')
        return
      }
      //call active firstcreate transcript
      this.isCreatingTranscript = true
      this.activeFirstOrCreateTranscriptRecord(this.data).then(({ data }) => {
        console.log(data)
        this.data.transcriptRecord = data
        this.data.transcriptRecordId = data.id
        this.isCreatingTranscript = false
        console.log(this.data)
      }).catch((error) => {
        const errors = error.response.data.errors;
        console.log(errors)
        this.isCreatingTranscript = false
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

</style>
