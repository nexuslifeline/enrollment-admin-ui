<template>
  <b-modal
    :visible="isShown"
    size="md"
    :title="`${isEditing ? 'Edit' : 'Add'} Period`"
    :noCloseOnEsc="true"
    :noCloseOnBackdrop="true"
    bodyClass="modal-body__container"
    @hidden="$emit('update:isShown', false)"
    :centered="true">
    <div class="modal-field-container">
     <b-form-group>
        <label class="required">Name</label>
        <b-form-input
          v-model="form.fields.name"
          :state="form.states.name"/>
        <b-form-invalid-feedback>
          {{ form.errors.name }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label>Description</label>
        <b-form-textarea
          v-model="form.fields.description"
          :state="form.states.description"/>
        <b-form-invalid-feedback>
          {{ form.errors.description }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group>
        <label class="required">School Category</label>
        <b-form-select
          v-model="form.fields.schoolCategoryId"
          :state="form.states.schoolCategoryId"
        >
          <template v-slot:first>
            <b-form-select-option :value="null" disabled
              >-- Select School Category --
            </b-form-select-option>
          </template>
          <b-form-select-option
            v-for="schoolCategory in $options.SchoolCategories.values"
            :key="schoolCategory.id"
            :value="schoolCategory.id"
            @input="form.fields.semesterId = null"
          >
            {{ schoolCategory.name }}
          </b-form-select-option>
        </b-form-select>
        <b-form-invalid-feedback>
          {{ form.errors.schoolCategoryId }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group v-if="isSemesterVisible">
        <label class="required" >Semester</label>
        <b-form-select
          v-model="form.fields.semesterId"
          :state="form.states.semesterId"
        >
          <template v-slot:first>
            <b-form-select-option :value="null" disabled
              >-- Select Semester --
            </b-form-select-option>
          </template>
          <b-form-select-option
            v-for="semester in $options.Semesters.values"
            :key="semester.id"
            :value="semester.id"
          >
            {{ semester.name }}
          </b-form-select-option>
        </b-form-select>
        <b-form-invalid-feedback>
          {{ form.errors.semesterId }}
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <template v-slot:modal-footer>
      <FooterAction
        @onConfirm="onSave"
        @onDelete="$emit('onDelete', data[resourceValueKey])"
        @onCancel="isShown = false"
        confirmText="Save"
        :isConfirmBusy="isConfirmBusy"
        :showDelete="isEditing"
        :isDeleteBusy="isDeleteBusy"
      />
    </template>
  </b-modal>
</template>
<script>
import FooterAction from '../../components/ModalFooter/ActionBar';
import { SchoolCategories, Semesters } from '../../../helpers/enum.js'

export default {
  SchoolCategories,
  Semesters,
  components: {
    FooterAction
  },
  props: {
    isShown: {
      type: [Boolean],
      default: false
    },
    data: {
      type: [Object]
    },
    resourceValueKey: {
      type: [String],
      default: 'id'
    },
    form: {
      type: [Object]
    },
    isConfirmBusy: {
      type: [Boolean],
      default: false
    },
    isDeleteBusy: {
      type: [Boolean],
      default: false
    },
  },
  data() {
    return {
      term: {}
    }
  },
  computed: {
    isEditing() {
      // if term.id has anything, the form is in edit mode
      return !!this.term?.[this.resourceValueKey];
    },
    isSemesterVisible() {
      const { SchoolCategories } = this.$options
      const { schoolCategoryId } = this.form.fields
      return [ SchoolCategories.COLLEGE.id, SchoolCategories.SENIOR_HIGH_SCHOOL.id ].includes(schoolCategoryId)
    }
  },
  methods: {
    onSave() {
      if (this.isEditing) {
        this.$emit('onSave', this.data[this.resourceValueKey], this.data);
      } else {
        this.$emit('onCreate', this.data);
      }
    }
  },
  watch: {
    data(nValue, oValue) {
      this.term = {
        ...nValue
      }
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
