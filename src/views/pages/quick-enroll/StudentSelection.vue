<template>
  <b-modal
    :visible="isShown"
    :size="isShownStudent || isShownAcademic ? 'lg' : 'md'"
    title="Select Student"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    :centered="true"
    @show="isShownStudent = false"
    @hidden="$emit('update:isShown', false)">
    <div class="selection__container">
      <template v-if="isShownStudent">
        <b-form-group>
          <label class="required">Student</label>
          <SelectStudent v-model="selectedStudent" />
          <!-- <SelectPaginated
            class="select-paginated mt-2 "
            @input="getStudentInfo($event)"
            :fetchData="getStudentList"
            placeholder="Select Student"
          >
            <template slot="option" slot-scope="data">
              <div class="select-option">
                <div class="select-option__avatar">
                  <b-avatar variant="info" :src="getPhoto(data)"></b-avatar>
                </div>
                <div class="select-option__info">
                  <span>{{
                    data.studentNo ? data.studentNo : 'Awaiting Confirmation'
                  }}</span>
                  <span>{{ data.name }}</span>
                  <span>{{ data.email }}</span>
                </div>
              </div>
            </template>
            <template slot="loader">
              <b-spinner label="Loading..." class="loader"></b-spinner>
            </template>
        </SelectPaginated> -->
        </b-form-group>
      </template>
      <template v-if="isShownAcademic">
        <template >
          <InputGroup>
            <InputContainer>
              <b-form-group>
              <label class="required">School Year</label>
              <SelectSchoolYear
                :value="schoolYearId"
                :reduce="option => option.id"
                label="name"
                @input="schoolYearId = $event"
                :clearable="false"
              />
            </b-form-group>
            </InputContainer>
            <InputContainer>
              <b-form-group>
                <label class="required">School Category</label>
                <SelectCategory
                  :value="schoolCategoryId"
                  :reduce="option => option.id"
                  label="name"
                  @input="schoolCategoryId = $event"
                  :clearable="false"
                />
              </b-form-group>
            </InputContainer>
          </InputGroup>
        </template>
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
      />
  </template>
  </b-modal>
</template>
<script>
import { copyValue } from '../../../helpers/extractor';
import { AcademicRecordApi, StudentApi } from '../../../mixins/api';
import FooterAction from '../../components/ModalFooter/ActionBar';
import TileMenu from '../../components/TileSelector/List';
import SelectSchoolYear from '../../components/Dropdowns/SelectSchoolYear'
import SelectCategory from '../../components/Dropdowns/SelectCategory'
import SelectPaginated  from '../../components/SelectPaginated.vue'

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
    TileMenu,
    SelectSchoolYear,
    SelectCategory,
    SelectPaginated
  },
  mixins: [ StudentApi, AcademicRecordApi],
  data() {
    return {
      selectedIndex: null,
      busyIndexes: [],
      isShownStudent: false,
      isShownAcademic: false,
      isConfirmBusy: false,
      schoolYearId: null,
      schoolCategoryId: null,
      selectedStudent: null,
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
        //existing student
        this.isConfirmBusy = true
        const studentId = this.selectedStudent?.id
        this.quickEnroll(studentId, { schoolYearId: this.schoolYearId, schoolCategoryId: this.schoolCategoryId }).then(({ data }) => {
          const academicRecordId = data.id
          this.isConfirmBusy = false
          this.$router.push({
            name: 'Academic Record Applications Detail',
            params: { academicRecordId, studentId }
          });
          this.$emit('update:isShown', false);
        }).catch((error) => {
          const errors = error.response.data.errors;
          this.isConfirmBusy = false
          console.log(errors)
        });
      }  else if (this.selectedIndex === 1) {
        this.isConfirmBusy = true
        // this.resetState();
        this.addStudent({}).then(({ data }) => {
          const studentId = data.id
          this.quickEnroll(studentId, { schoolYearId: this.schoolYearId, schoolCategoryId: this.schoolCategoryId }).then(({ data }) => {
            const academicRecordId = data.id
            this.isConfirmBusy = false
            this.$router.push({
              name: 'Academic Record Applications Detail',
              params: { academicRecordId, studentId }
            });
            this.$emit('update:isShown', false);
          })
        }).catch((error) => {
          const errors = error.response.data.errors;
          this.isConfirmBusy = false
          console.log(errors)
        });
      }
    },
    resetState() {
      this.selectedIndex = null;
      this.busyIndexes = [];
      this.$emit('update:isShown', false);
      this.isShownStudent = false;
      this.isShownAcademic = false;
      this.isConfirmBusy = false;
    },
    onSelectMenu(item) {
      this.busyIndexes = [item.index];
      this.selectedIndex = item.index;
      setTimeout(() => {
        if (item.index === 0) {
          this.isShownStudent = true;
        }
        this.isShownAcademic = true;
        this.busyIndexes = [];
      }, 500);
    },
    getPhoto(option) {
      const photo = (option && option.photo && option.photo.hashName) || '';
      return !!photo ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${photo}` : '';
    },
    getStudentInfo(student) {
      this.selectedStudent = student;
    },
  }
};
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/_shared.scss';

  .selection__container {
    padding: 20px;
  }

  .select-paginated {
    width: 100%;

    @include for-size(phone-only) {
      width: 100%;
    }
    .select-option {
      display: flex;
      justify-content: center;
      align-items: center;

      .select-option__avatar {
        width: auto;
      }

      .select-option__info {
        flex: 1;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
      }
    }
  }

</style>
