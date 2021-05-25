<template>
  <b-modal
    :visible="isShown"
    size="md"
    title="Change Curriculum"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    @hidden="$emit('update:isShown', false)"
    bodyClass="modal-body__container"
    :centered="true"
    @shown="onShown()">
    <div class="modal-field-container overflow-visible">
      <b-form-group
        :state="forms.academicRecord.states.curriculumId"
        :invalid-feedback="forms.academicRecord.errors.curriculumId">
        <label class="required"> Curriculum</label>
          <SelectCurriculum
            v-model="forms.academicRecord.fields.curriculumId"
            :reduce="option => option.id"
            label="name"
            placeholder="Curriculum"
            class="mt-2"
            :clearable="true"
            :courseId="courseId"
            :class=" { 'is-invalid' : !!forms.academicRecord.errors.curriculumId  }"
          />
      </b-form-group>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        @onConfirm="onChangeCurriculum"
        @onCancel="$emit('onCancel')"
        :isConfirmBusy="isConfirmBusy"
      />
    </template>
  </b-modal>
</template>
<script>
import { AcademicRecordApi } from '../../../mixins/api';
import FooterAction from '../ModalFooter/ActionBar';
import SelectCurriculum from '../../components/Dropdowns/SelectCurriculum'
import { validate, reset } from '../../../helpers/forms';

const acadmicRecordFields = {
  curriculumId: null
}

export default {
  props: {
    isShown: {
      type: [Boolean]
    },
    data: {
      type: [Object]
    },
    academicRecordId: {
      type: [Number, String]
    },
    curriculum: {
      type: [Object]
    },
    courseId: {
      type: [Number, String]
    }
  },
  mixins: [ AcademicRecordApi ],
  components: {
    FooterAction,
    SelectCurriculum
  },
  data() {
    return {
      isConfirmBusy: false,
      forms: {
        academicRecord: {
          fields: { ...acadmicRecordFields },
          states: { ...acadmicRecordFields },
          errors: { ...acadmicRecordFields }
        }
      }
    }
  },
  created() {
    // alert('created')
  },
  methods: {
    onChangeCurriculum() {
      //update academic record here
      this.isConfirmBusy = true

     const { academicRecord, academicRecord: { fields } } = this.forms

      reset(academicRecord)
      this.patchAcademicRecord(fields, this.academicRecordId).then(({ data }) => {
        this.data.curriculum = data.curriculum
        this.$emit('onCancel')
        this.isConfirmBusy = false
      }).catch((error) => {
        this.isConfirmBusy = false;
        const errors = error.response.data.errors;
        console.log(errors)
        validate(academicRecord, errors)
      });
    },
    onShown(){
      // alert('ss')
      const { fields } = this.forms.academicRecord
      fields.curriculumId = this.curriculum?.id
      // alert(fields.curriculumId)
    }
  },
};
</script>
<style lang="scss" scoped>

</style>
