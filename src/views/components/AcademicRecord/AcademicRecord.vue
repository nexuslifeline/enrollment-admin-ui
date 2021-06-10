<template>
  <Card
    title="Academic Record"
    titleSize="m"
    :hasFooter="true">
    <CardNote v-if="showNotes">
      It is recommended to complete the <b>Academic Record</b> section first before 
      adding Subject to be able to find the right subjects for the Student.
    </CardNote>
    <InputGroup>
      <InputContainer>
        <label class="required">School Category</label>
        <v-select
          label="School Category"
          placeholder="School Category"
        />
      </InputContainer>
      <InputContainer>
        <label class="required">School Year</label>
        <v-select
          label="Semester"
          placeholder="Semester"
        />
      </InputContainer>
    </InputGroup>
    <InputGroup>
       <InputContainer>
        <label class="required">Course</label>
        <v-select
          label="Course"
          placeholder="Course"
        />
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <label class="required">Level</label>
        <v-select
          label="Level"
          placeholder="Level"
        />
      </InputContainer>
      <InputContainer>
        <label class="required">Semester</label>
        <v-select
          label="Semester"
          placeholder="Semester"
        />
      </InputContainer>
    </InputGroup>
     <InputGroup>
       <InputContainer>
        <label class="required">Curriculum</label>
        <v-select
          label="Curriculum"
          placeholder="Curriculum"
        />
      </InputContainer>
    </InputGroup>
    <InputGroup>
      <InputContainer>
        <label class="required">Student Type</label>
        <v-select
          label="Student Type"
          placeholder="Student Type"
        />
      </InputContainer>
      <InputContainer>
        <label class="required">Section</label>
        <v-select
          label="Section"
          placeholder="Section"
        />
      </InputContainer>
    </InputGroup>
    <template v-slot:footer>
      <CardFooterRow>
        <b-button variant="primary" @click="onSave" :disabled="isProcessing">
          <v-icon v-if="isProcessing" name="spinner" spin /> Save Changes
        </b-button>
      </CardFooterRow>
    </template>
  </Card>
</template>

<script>
  export default {
    props: {
      data: {
        type: [Object]
      },
      showNotes: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        isProcessing: false
      }
    },
    methods: {
      onSave() {
        console.log('PUT academic record here /academic-records/:id')
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/scss/shared.scss";
</style>