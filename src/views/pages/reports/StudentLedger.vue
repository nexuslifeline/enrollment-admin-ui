<template>
  <div class="student-ledger__main-container">
    <StudentList
      :showAddButton="false"
      :showRowActionButton="false" />
  </div>
</template>

<script>
import StudentList from "../student/StudentList";
export default {
  components: { StudentList }
}
</script>

<style lang="scss">

  .student-ledger__main-container {
    width: 100%;
    height: 100%;
  }
</style>