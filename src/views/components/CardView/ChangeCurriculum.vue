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
        :state="forms.transcriptRecord.states.curriculumId"
        :invalid-feedback="forms.transcriptRecord.errors.curriculumId">
        <label class="required"> Curriculum</label>
          <SelectCurriculum
            v-model="forms.transcriptRecord.fields.curriculumId"
            :reduce="option => option.id"
            label="name"
            placeholder="Curriculum"
            class="mt-2"
            :clearable="true"
            :courseId="courseId"
            :class=" { 'is-invalid' : !!forms.transcriptRecord.errors.curriculumId  }"
          />
      </b-form-group>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        @onConfirm="onSaveCurriculum"
        @onCancel="$emit('onCancel')"
        :isConfirmBusy="isConfirmBusy"
      />
    </template>
  </b-modal>
</template>
<script>
//import { AcademicRecordApi } from '../../../mixins/api';
import FooterAction from '../ModalFooter/ActionBar';
import SelectCurriculum from '../../components/Dropdowns/SelectCurriculum'
import { validate, reset } from '../../../helpers/forms';
import { TranscriptRecordStatus } from '../../../helpers/enum';
import { TranscriptRecordApi } from '../../../mixins/api';

const transcriptRecordFields = {
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
    // transcriptRecordId: {
    //   type: [Number, String]
    // },
    // curriculum: {
    //   type: [Object]
    // },
    courseId: {
      type: [Number, String]
    }
  },
  mixins: [ TranscriptRecordApi ],
  components: {
    FooterAction,
    SelectCurriculum
  },
  data() {
    return {
      isConfirmBusy: false,
      forms: {
        transcriptRecord: {
          fields: { ...transcriptRecordFields },
          states: { ...transcriptRecordFields },
          errors: { ...transcriptRecordFields }
        }
      }
    }
  },
  computed: {
    levelId() {
      return this.data?.levelId;
    }
  },
  methods: {
    onSaveCurriculum() {
      const { id: transcripRecordId } = this.data
      const { transcriptRecord } = this.forms
       this.isConfirmBusy = true;
      reset(transcriptRecord)
      this.patchTranscriptRecord(transcripRecordId, transcriptRecord.fields).then(({ data }) => {
        this.$emit('update:isShown', false)
        this.$emit('update:data', { ...data })
        this.isConfirmBusy = false;
      }).catch((error) => {
        this.isConfirmBusy = false;
        const errors = error.response.data.errors;
        console.log(errors)
        validate(transcriptRecord, errors)
      });
    },
    onShown() {
      const { fields } = this.forms.transcriptRecord
      fields.curriculumId = this.data?.curriculumId
    }
  },
};
</script>
<style lang="scss" scoped>

</style>
