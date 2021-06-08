<template>
  <div>
    <Card
      title="Subject Enlistment"
      titleSize="m"
      :hasFooter="true">
      <div>

      </div>
      <template v-slot:footer>
        <CardFooterRow>
          <b-button variant="primary" @click="onSave" :disabled="isProcessing">
            <v-icon v-if="isProcessing" name="spinner" spin /> Save Changes
          </b-button>
        </CardFooterRow>
      </template>
    </Card>
  </div>
</template>
<script>
export default {
  props: {
    academicRecordId: {
      type: [String, Number]
    }
  },
  data() {
    return {
      isProcessing: false
    }
  },
  created() {
    console.log('GET subjects here in /academic-records/:id/subjects based on provided academicRecordId props')
  },
  methods: {
    onSave() {
      console.log('POST academic records subject to /academic-records/:id/subjects')
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/shared.scss";

</style>
