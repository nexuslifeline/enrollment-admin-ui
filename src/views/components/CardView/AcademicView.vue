<template>
  <div>
    <div>
      <InlineItem label="Curriculum" @onEdit="onEditCurriculum" :isEditable="isEditable">
        {{ transcriptRecord.curriculum && transcriptRecord.curriculum.name || 'No Previous Academic Record found' }}
      </InlineItem>
      <InlineItem
        v-if="isCourseVisible"
        label="Course"
        @onEdit="onEditCourse"
        :isEditable="isEditable">
        {{ data && data.course && data.course.name || 'No Course' }}
      </InlineItem>
      <InlineItem label="Level" @onEdit="onEditLevel" :isEditable="isEditable">
        {{ data && data.level && data.level.name || 'No Level' }}
      </InlineItem>
      <InlineItem v-if="isCourseVisible" @onEdit="onEditLevel" label="Semester" :isEditable="isEditable">
        {{ data && data.semester && data.semester.name || 'No Semester' }}
      </InlineItem>
    </div>
    <ChangeCurriculum
      v-if="isShowChangeCurriculum"
      @onCancel="isShowChangeCurriculum = false"
      :data.sync="data.transcriptRecord"
      :isShown.sync="isShowChangeCurriculum"
      :courseId="courseId"
    />
    <!-- <ChangeStudentCurriculum
      v-if="isShowChangeStudentCurriculum"
      @onCancel="isShowChangeStudentCurriculum = false"
      :data.sync="data.transcriptRecord"
      :isShown.sync="isShowChangeStudentCurriculum"
      :courseId="courseId"
    /> -->
    <ChangeAcademicRecord
      @onCancel="isShowChangeLevelCourse = false"
      :data="data"
      @update:data="v => $emit('update:data', v)"
      :isShown.sync="isShowChangeLevelCourse"
      v-if="isShowChangeLevelCourse"
    />
    <!-- <ChangeCourse
      @onCancel="isShowChangeCourse = false"
      :data.sync="data"
      :isShown.sync="isShowChangeCourse"
      v-if="isShowChangeCourse"
    /> -->
  </div>
</template>
<script>
import { AcademicRecordApi, CurriculumApi } from '../../../mixins/api';
import ChangeCurriculum from './ChangeCurriculum';
import ChangeStudentCurriculum from './ChangeStudentCurriculum';
import ChangeLevel from './ChangeLevel';
import ChangeCourse from './ChangeCourse';
import ChangeAcademicRecord from './ChangeAcademicRecord';
import { SchoolCategories } from '../../../helpers/enum'

export default {
  props: {
    data: {
      type: [Object]
    },
    isEditable: {
      type: [Boolean],
      default: true
    }
  },
  components: {
    ChangeCurriculum,
    ChangeStudentCurriculum,
    ChangeLevel,
    ChangeCourse,
    ChangeAcademicRecord
  },
  mixins: [ CurriculumApi, AcademicRecordApi ],
  data() {
    return {
      isCreatingTranscript: false,
      isShowChangeCurriculum: false,
      isShowChangeLevelCourse: false,
      isShowChangeStudentCurriculum: false,
      SchoolCategories,
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
  computed: {
    transcriptRecord() {
      return this.data?.transcriptRecord || {};
    },
    courseId() {
      return this.data?.courseId
    },
    schoolCategoryId() {
      return this.data?.schoolCategoryId
    },
    isCourseVisible() {
      return [
        this.SchoolCategories.SENIOR_HIGH_SCHOOL.id,
        this.SchoolCategories.COLLEGE.id,
        this.SchoolCategories.GRADUATE_SCHOOL.id
      ].includes(this.schoolCategoryId);
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
      this.isShowChangeLevelCourse = true
    },
    onEditLevel() {
      this.isShowChangeLevelCourse = true;
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

</style>
