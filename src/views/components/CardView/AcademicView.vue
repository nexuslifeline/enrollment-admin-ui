<template>
  <div>
     <ActiveViewItems>
      <ActiveViewItem label="Curriculum" @onEdit="onEditCurriculum" isEditable>
        <p>
          {{ transcriptRecord.curriculum && transcriptRecord.curriculum.name || 'No Curriculum' }}
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
      <ActiveViewItem label="Level" @onEdit="onEditLevel" isEditable>
        <p>
          {{ data.level && data.level.name || 'No Level' }}
        </p>
      </ActiveViewItem>
       <ActiveViewItem label="Student Curriculum" @onEdit="onEditStudentCurriculum" isEditable>
        <p>
          {{ transcriptRecord.studentCurriculum && transcriptRecord.studentCurriculum.name || 'No Curriculum' }}
        </p>
      </ActiveViewItem>
      <ActiveViewItem v-if="data.semester" label="Semester">
        <p>
          {{ data.semester && data.semester.name || 'No Semester' }}
        </p>
      </ActiveViewItem>
    </ActiveViewItems>
    <ChangeCurriculum
      v-if="isShowChangeCurriculum"
      @onCancel="isShowChangeCurriculum = false"
      :data.sync="data.transcriptRecord"
      :isShown.sync="isShowChangeCurriculum"
      :courseId="courseId"
    />
    <ChangeStudentCurriculum
      v-if="isShowChangeStudentCurriculum"
      @onCancel="isShowChangeStudentCurriculum = false"
      :data.sync="data.transcriptRecord"
      :isShown.sync="isShowChangeStudentCurriculum"
      :courseId="courseId"
    />
    <ChangeLevel
      @onCancel="isShowChangeLevel = false"
      :data.sync="data"
      :isShown.sync="isShowChangeLevel"
    />
    <ChangeCourse
      @onCancel="isShowChangeCourse = false"
      :data.sync="data"
      :isShown.sync="isShowChangeCourse"
    />
  </div>
</template>
<script>
import { AcademicRecordApi, CurriculumApi } from '../../../mixins/api';
import ChangeCurriculum from './ChangeCurriculum';
import ChangeStudentCurriculum from './ChangeStudentCurriculum';
import ChangeLevel from './ChangeLevel';
import ChangeCourse from './ChangeCourse';

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
      isShowChangeLevel: false,
      isShowChangeStudentCurriculum: false,
      isShowChangeCourse: false,
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
    ChangeCurriculum,
    ChangeStudentCurriculum,
    ChangeLevel,
    ChangeCourse
  },
  computed: {
    transcriptRecord() {
      return this.data?.transcriptRecord || {};
    },
    courseId() {
      return this.data?.courseId
    }
  },
  methods: {
    onEditCurriculum() {
      this.isShowChangeCurriculum = true;
    },
    onEditStudentCurriculum() {
      this.isShowChangeStudentCurriculum = true;
    },
    onEditCourse() {
      this.isShowChangeCourse = true
    },
    onEditLevel() {
      this.isShowChangeLevel = true;
    }
    // onAcceptTransferCredit() {
    //   const { curriculumId } = this.data
    //   if(!curriculumId) {
    //     showNotification(this,'danger', 'Curriculum is required before accepting credit.')
    //     return
    //   }
    //   //call active firstcreate transcript
    //   this.isCreatingTranscript = true
    //   this.activeFirstOrCreateTranscriptRecord(this.data).then(({ data }) => {
    //     console.log(data)
    //     this.data.transcriptRecord = data
    //     this.data.transcriptRecordId = data.id
    //     this.isCreatingTranscript = false
    //     console.log(this.data)
    //   }).catch((error) => {
    //     const errors = error.response.data.errors;
    //     console.log(errors)
    //     this.isCreatingTranscript = false
    //   });
    // }
  },
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

</style>
