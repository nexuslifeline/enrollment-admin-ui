<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Select Student"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    :centered="true"
    @show="isStudentShown = false"
    @hidden="$emit('update:isShown', false)">
    <div class="selection__container">
      <template v-if="isStudentShown">
        <b-form-group>
          <label class="required">Student</label>
          <v-select
            label="Student"
            placeholder="Student"
            :options="[]"
          />
        </b-form-group>
      </template>
      <template v-else>
        <TileMenu
          @onSelect="onSelectMenu"
          :selectedIndex="selectedIndex"
          :busyIndexes="busyIndexes"
          :options="menus"
        />
      </template>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        @onConfirm="onProceed"
        @onCancel="resetState"
        :isConfirmBusy="isConfirmBusy"
        confirmText="Proceed"
        :showConfirm="isStudentShown"
      />
  </template>
  </b-modal>
</template>
<script>
import { copyValue } from '../../../helpers/extractor';
import { AcademicRecordApi, StudentApi } from '../../../mixins/api';
import FooterAction from '../../components/ModalFooter/ActionBar';
import TileMenu from '../../components/TileSelector/List';

export default {
  props: {
    previousRoute: {
      type: Object
    },
    isShown: {
      type: Boolean
    }
  },
  components: {
    FooterAction,
    TileMenu
  },
  mixins: [ StudentApi, AcademicRecordApi],
  data() {
    return {
      selectedIndex: null,
      busyIndexes: [],
      isStudentShown: false,
      isConfirmBusy: false,
      menus: [
        { label: 'Select Existing Student' },
        { label: 'Register New Student' }
      ],
      academicRecordId: 1 // added hardcoded id for testing only
    }
  },
  methods: {
    onProceed() {
      if (this.selectedIndex === 0) {
        this.$emit('update:isShown', false);
        this.$router.push({
          name: 'Quick Enroll',
          params: { academicRecordId: this.academicRecordId }
        });
      }
    },
    resetState() {
      this.selectedIndex = null;
      this.busyIndexes = [];
      this.$emit('update:isShown', false);
      this.isStudentShown = false;
      this.isConfirmBusy = false;
    },
    onSelectMenu(item) {
      this.busyIndexes = [item.index];
      this.selectedIndex = item.index;

      if (item.index === 0) {
        setTimeout(() => {
          this.isStudentShown = true;
          this.busyIndexes = [];
        }, 500);
        return;
      }

      // post student here with empty({}) data
      // after posting student, post new academic record here with the new student id
      // and redirect to enrollment/academic-record-applications/:academicRecordId
      this.resetState();
      this.addStudent({})
      .then(({ data }) => {
        const studentId = data.id
        this.quickEnroll(studentId)
        .then(({ data }) => {
          const academicRecordId = data.id
          this.$router.push({
            name: 'Quick Enroll Entry',
            params: { academicRecordId, studentId }
          });
        })
      })
    }
  }
};
</script>
<style lang="scss" scoped>

  .selection__container {
    padding: 20px;
  }

</style>
