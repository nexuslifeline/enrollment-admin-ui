<template>
  <b-modal
    v-model="show"
    @hidden="$emit('update:show', false)"
    size="md"
    noCloseOnEsc
    noCloseOnBackdrop>
    <template v-slot:modal-header>
        Delete Student
    </template>
    Are you sure you want to delete this student ?
    <template v-slot:modal-footer>
        <!-- <b-button
          :disabled="isProcessing"
          variant="primary"
          class="mr-2 btn-save"
          @click="onDeleteStudent()">
        <v-icon v-if="isProcessing" name="sync" spin class="mr-2" /> Yes</b-button>
        <b-button
          variant="dark"
          class=""
          @click="$emit('update:show', false)">No</b-button> -->
          <FooterAction
            confirmText="Confirm Delete"
            @onConfirm="onDeleteStudent"
            @onCancel="$emit('update:show', false)"
            :isConfirmBusy="isProcessing"
          />
    </template>
  </b-modal>
</template>

<script>
import { StudentApi } from '../../../mixins/api';
import FooterAction from '../../components/ModalFooter/ActionBar'
export default {
  props:  {
    studentId: {
      type: [Number, String]
    },
    show: {
      type: [Boolean],
      default: false
    }
  },
  components: { FooterAction },
  mixins: [StudentApi],
  data() {
    return {
      isProcessing: false,
    }
  },
  methods: {
    onDeleteStudent() {
      this.isProcessing = true;
      this.deleteStudent(this.studentId).then(({ data }) => {
        this.isProcessing = false;
        this.$emit('update:show', false)
        this.$emit('onStudentDeleted')
        showNotification(this, 'success', 'Student deleted successfully.');
      }).catch((error) => {
        this.isProcessing = false;
      });;
    }
  }
}
</script>

<style>

</style>