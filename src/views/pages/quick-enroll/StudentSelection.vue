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
        @onCancel="$emit('update:isShown', false)"
        :isConfirmBusy="isConfirmBusy"
        confirmText="Proceed"
      />
  </template>
  </b-modal>
</template>
<script>
import { copyValue } from '../../../helpers/extractor';
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
  mixins: [],
  data() {
    return {
      selectedIndex: 0,
      busyIndexes: [],
      isStudentShown: false,
      isConfirmBusy: false,
      menus: [
        { label: 'Select Existing Student' },
        { label: 'Register New Student' }
      ]
    }
  },
  mounted() {
    console.log('mounted')
  },
  methods: {
    onProceed() {
      if (selectedIndex === 0) {

      } else {

      }
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
    }
  }
};
</script>
<style lang="scss" scoped>

  .selection__container {
    padding: 20px;
  }

</style>
