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
      :isShown="isShown"
      :academicRecordId="data.id"
      @onCancel="isShown = false"
    />
  </div>
</template>
<script>
import ChangeCurriculum from './ChangeCurriculum';

export default {
  props: {
    data: {
      type: [Object]
    }
  },
  data() {
    return {
      isShown: false
    }
  },
  components: {
    ChangeCurriculum
  },
  methods: {
    onEditCurriculum() {
      this.isShown = true;
    },
    onEditCourse() {

    },
    onSaveCurriculum() {

    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

</style>
