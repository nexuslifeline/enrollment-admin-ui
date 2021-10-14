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
          :text="'PR'"
          :borderSize="3"
          class="m-auto"
        />
        <span class="ml-1">Paul Christian Rueda</span>
      </div>
    </InlineItem>
    <InlineItem label="Group: ">
      Instructor
    </InlineItem>
    <InlineItem label="Department: ">
      CIT
    </InlineItem>
    <InlineItem label="Email: ">
      chrisrueda14@yahoo.com
    </InlineItem>
    <InlineItem label="Address: ">
      San Jose, San Simon, Pampanga, PH
    </InlineItem>
    <br />
    <div>
      <h4 class="grade-view__title">
        Grades
      </h4>
      <GradeList />
    </div>
    <br />
  </div>
</template>
<script>
  import GradeList from './GradesList';
  export default {
    props: {
      gradeId: {
        type: [String, Number]
      }
    },
    components: {
      GradeList
    },
    created() {
      // GET /student-grades/:id
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