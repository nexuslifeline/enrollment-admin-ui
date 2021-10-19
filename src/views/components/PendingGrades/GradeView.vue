<template>
  <div class="container">
    <h4 class="grade-view__title">
      Publisher
    </h4>
    <InlineItem label="Name: ">
      <div class="inline-contents">
        <AvatarMaker
          :avatarId="1"
          :size="33"
          :text="personnelInitials"
          :borderSize="3"
          class="m-auto"
          :src="photo"
        />
        <span class="ml-1">{{ personnel && personnel.name || '' }}</span>
      </div>
    </InlineItem>
    <InlineItem label="Group: ">
       {{ user && user.userGroup && user.userGroup.name || '' }}
    </InlineItem>
    <InlineItem label="Department: ">
      {{ personnel && personnel.department && personnel.department.name || '' }}
    </InlineItem>
    <InlineItem label="Email: ">
      {{ user && user.username || '' }}
    </InlineItem>
    <InlineItem label="Address: ">
      {{ personnel && personnel.completeAddress || '' }}
    </InlineItem>
    <br />
    <div>
      <h4 class="grade-view__title">
        Grades
      </h4>
      <GradeList :sectionId="studentGrade.sectionId" :subjectId="studentGrade.subjectId"/>
    </div>
    <br />
  </div>
</template>
<script>
import { validate } from '../../../helpers/forms';
import { StudentGradeApi } from '../../../mixins/api';
import GradeList from './GradesList';
import { getFilePath } from '../../../helpers/utils';
export default {
  getFilePath,
  props: {
    gradeId: {
      type: [String, Number]
    }
  },
  mixins: [StudentGradeApi],
  components: {
    GradeList
  },
  data() {
    return {
      studentGrade: {}
    }
  },
  created() {
    // GET /student-grades/:id
    this.getStudentGrade(this.gradeId).then(({ data }) => {
      this.studentGrade = data
    }).catch((error) => {
      const errors = error.response.data.errors
      validate(null, errors, this)
    });
  },
  computed: {
    personnel() {
      return this.studentGrade?.personnel || {}
    },
    personnelInitials() {
      const { firstName, lastName } = this.personnel
      return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`
    },
    photo() {
      const { photo } = this.personnel
      if(!photo) {
        return ''
      }
      return this.$options.getFilePath(photo.hashName)
    },
    user() {
      return this.studentGrade?.personnel?.user || null
    },
  }
};
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/_shared.scss';

  .container {
    padding: 20px;
    width: 100%;
    height: 100%;
  }

  .inline-contents {
    display: flex;
    align-items: center;
  }

  .grade-view__title {
    font-size: 18px;
    margin-bottom: 15px;
  }
</style>