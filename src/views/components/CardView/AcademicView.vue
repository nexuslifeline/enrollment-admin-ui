<template>
  <Card title="Student Academic Application" titleSize="m" noPaddingBody>
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
  </Card>
</template>
<script>

export default {
  props: {
    data: {
      type: [Object]
    }
  },
  methods: {
    onEditCurriculum() {

    },
    onEditCourse() {

    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

</style>
