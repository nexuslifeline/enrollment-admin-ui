<template>
  <div>
    <b-overlay :show="isLoading" rounded="sm">
      <b-card>
        <div v-if="student">
          <b-row class="mb-2">
            <b-col md="12">
              <span class="font-weight-bold">Student Information</span>
              <hr class="bg-light mt-1 mb-0" />
            </b-col>
          </b-row>
          <b-row class="pb-1">
            <b-col md="6">
              Student Number :
              <span class="font-weight-bold">{{
                student.studentNo ? student.studentNo : 'Awaiting Confirmation'
              }}</span>
            </b-col>
            <b-col md="6">
              Name : <span class="font-weight-bold">{{ student.name }}</span>
            </b-col>
          </b-row>
          <b-row class="pb-1">
            <b-col md="6">
              Student Category :
              <b-badge
                :variant="
                  student.studentCategoryId ===
                  $options.StudentCategories.NEW.id
                    ? 'success'
                    : student.studentCategoryId ===
                      $options.StudentCategories.OLD.id
                    ? 'primary'
                    : 'warning'
                "
              >
                {{
                  student.studentCategory ? student.studentCategory.name : ''
                }}
              </b-badge>
            </b-col>
            <b-col md="6">
              Contact Number :
              <span class="font-weight-bold">{{ student.mobileNo }}</span>
            </b-col>
          </b-row>
          <b-row class="pb-1">
            <b-col md="6">
              Email : <span class="font-weight-bold">{{ student.email }}</span>
            </b-col>
            <b-col md="6">
              Address :
              <span class="font-weight-bold">
                {{
                  student.address ? student.address.currentCompleteAddress : ''
                }}
              </span>
            </b-col>
          </b-row>
          <hr />
          <b-row class="mb-2">
            <b-col md="12">
              <span class="font-weight-bold">Requirements Checklist</span>
              <hr class="bg-light mt-1 mb-0" />
            </b-col>
          </b-row>
          <b-row class="pb-1">
            <b-col md="12">
              <b-form-checkbox
                v-for="requirement in tables.requirements.items"
                :key="requirement.id"
                @input="onUpdateTranscriptRecord($event, requirement.id)"
                >{{ requirement.name }}</b-form-checkbox
              >
            </b-col>
          </b-row>
        </div>
        <hr />
        <div v-if="evaluation.files">
          <h5>Files</h5>
          <b-row>
            <b-col md="12">
              <div class="file-uploader-container">
                <FileUploader
                  @onFileChange="onEvaluationFileUpload($event, evaluation)"
                  @onFileDrop="onEvaluationFileUpload($event, evaluation)"
                />
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12">
              <div class="file-item-container">
                <FileItem
                  v-for="(item, index) of evaluation.files"
                  :key="index"
                  :title="item.name"
                  :description="item.notes"
                  :fileIndex="index"
                  @onFileItemSelect="
                    onEvaluationFileItemSelect(item, evaluation)
                  "
                  @onFileItemRemove="onDeleteEvaluationFile(item, evaluation)"
                  @onFileItemPreview="previewFile(item)"
                  :isBusy="item.isBusy"
                />
              </div>
            </b-col>
          </b-row>
        </div>
        <template slot:footer>
          <b-button
            :to="
              `/master-files/student/${$route.params.studentId}/school-records/requirements`
            "
            variant="outline-danger"
            class="float-right"
          >
            Close
          </b-button>
        </template>
      </b-card>
    </b-overlay>
    <b-modal
      v-model="showEvaluationFileModal"
      centered
      header-bg-variant="success"
      header-text-variant="light"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        Evaluation File
      </div>
      <b-row>
        <b-col md="12">
          <label>Notes</label>
          <b-textarea
            v-model="forms.evaluationFile.fields.notes"
            :state="forms.evaluationFile.states.notes"
            rows="7"
            debounce="500"
          />
          <b-form-invalid-feedback>
            {{ forms.evaluationFile.errors.notes }}
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
      <div slot="modal-footer" class="w-100">
        <b-button
          class="float-left"
          @click="onDeleteEvaluationFile(selectedEvaluationFile, evaluationRow)"
          variant="outline-danger"
        >
          <v-icon v-if="isFileDeleting" name="sync" class="mr-2" spin />
          Delete
        </b-button>
        <b-button
          @click="onUpdateEvaluationFile()"
          class="float-right"
          variant="outline-primary"
        >
          <v-icon v-if="isFileUpdating" name="sync" class="mr-2" spin />
          Update
        </b-button>
      </div>
    </b-modal>
    <FileViewer
      :show="showModalPreview"
      :file="file"
      :isBusy="file.isLoading"
      @close="showModalPreview = false"
    />
  </div>
</template>
<script>
import {
  StudentApi,
  EvaluationApi,
  StudentFileApi,
  RequirementApi,
  TranscriptRecordApi,
} from '../../../mixins/api';
import { EvaluationStatuses, StudentCategories } from '../../../helpers/enum';
import FileViewer from '../../components/FileViewer';
import FileUploader from '../../components/FileUploader';
import FileItem from '../../components/FileItem';
import { copyValue } from '../../../helpers/extractor';
import { clearFields, reset, showNotification } from '../../../helpers/forms';

const evaluationFileFields = {
  id: null,
  notes: null,
};

export default {
  StudentCategories,
  mixins: [
    StudentApi,
    EvaluationApi,
    StudentFileApi,
    RequirementApi,
    TranscriptRecordApi,
  ],
  components: {
    FileViewer,
    FileUploader,
    FileItem,
  },
  created() {
    this.evaluationId = this.$route.params.evaluationId;
    this.loadRequirements();
  },
  data() {
    return {
      evaluationId: null,
      isLoading: false,
      showModalPreview: false,
      file: {
        type: null,
        src: null,
        name: null,
        notes: null,
        isLoading: false,
      },
      evaluation: {
        files: [],
      },
      student: {},
      showEvaluationFileModal: false,
      selectedEvaluationFile: null,
      isFileDeleting: false,
      isFileUpdating: false,
      evaluationRow: null,
      forms: {
        evaluationFile: {
          fields: { ...evaluationFileFields },
          states: { ...evaluationFileFields },
          errors: { ...evaluationFileFields },
        },
      },
      isFileDeleting: false,
      isFileUpdating: false,
      tables: {
        requirements: {
          items: [],
        },
      },
      transcriptRecordId: null,
      requirements: [],
    };
  },
  methods: {
    loadRequirements() {
      this.isLoading = true;
      this.getEvaluation(this.evaluationId).then(({ data }) => {
        const {
          student,
          studentCategory,
          studentCategoryId,
          schoolCategoryId,
          transcriptRecordId,
        } = data;
        this.transcriptRecordId = transcriptRecordId;
        this.student = { ...student, studentCategory, studentCategoryId };
        const { studentId, evaluationId } = this.$route.params;
        const params = { paginate: false, evaluationId };
        this.getStudentFileList(studentId, params).then(({ data }) => {
          this.evaluation.files = data;
          this.isLoading = false;
        });
        const { requirements } = this.tables;
        const reqParams = {
          paginate: false,
          schoolCategoryId,
        };
        this.getRequirementList(reqParams)
          .then(({ data }) => {
            requirements.items = data;
            requirements.isBusy = false;
          })
          .catch((error) => {
            requirements.isBusy = false;
          });
      });
    },
    onEvaluationFileUpload(file, item) {
      const formData = new FormData();

      formData.append('file', file);

      item.files.push({
        id: null,
        name: null,
        notes: null,
        isBusy: true,
      });

      const evaluationFile = item.files[item.files.length - 1];
      const { isBusy, ...evaluationKeys } = evaluationFile;
      this.addEvaluationFile(formData, this.evaluationId)
        .then(({ data }) => {
          copyValue(data, evaluationFile, Object.keys(evaluationKeys));
          evaluationFile.isBusy = false;
        })
        .catch((error) => {
          item.files.splice(item.files.length - 1, 1);
        });
    },
    onDeleteEvaluationFile(file, item) {
      console.log(file);
      const index = item.files.findIndex((f) => f.id === file.id);
      this.deleteEvaluationFile(this.evaluationId, file.id)
        .then(() => {
          this.isFileDeleting = false;
          this.showEvaluationFileModal = false;
          item.files.splice(index, 1);
        })
        .catch((error) => {
          this.isFileDeleting = false;
          this.selectedEvaluationFile.isBusy = false;
        });
    },
    onEvaluationFileItemSelect(file, item) {
      const { evaluationFile } = this.forms;
      reset(evaluationFile);
      this.selectedEvaluationFile = file;
      this.evaluationRow = item;

      evaluationFile.fields.id = this.selectedEvaluationFile.id;
      evaluationFile.fields.notes = this.selectedEvaluationFile.notes;

      this.showEvaluationFileModal = true;
    },
    onUpdateEvaluationFile() {
      const { evaluationFile } = this.forms;

      this.isFileUpdating = true;
      this.selectedEvaluationFile.isBusy = true;

      this.updateEvaluationFile(
        evaluationFile.fields,
        this.evaluationRow.id,
        evaluationFile.fields.id
      )
        .then(({ data }) => {
          this.selectedEvaluationFile.notes = data.notes;
          this.isFileUpdating = false;
          this.showEvaluationFileModal = false;
          this.selectedEvaluationFile.isBusy = false;
        })
        .catch((error) => {
          const { errors } = error.response.data;
          validate(evaluationFile, errors);
          this.isFileUpdating = true;
          this.selectedEvaluationFile.isBusy = false;
        });
    },
    previewFile(item) {
      const { evaluationId, id, name, notes } = item;
      this.file.type = null;
      this.file.src = null;
      this.file.name = name;
      this.file.notes = notes;
      this.showModalPreview = true;
      this.file.isLoading = true;
      this.getEvaluationFilePreview(evaluationId, id).then((response) => {
        this.file.type = response.headers.contentType;
        this.file.isLoading = false;
        const file = new Blob([response.data], {
          type: response.headers.contentType,
        });
        const reader = new FileReader();
        reader.onload = (e) => (this.file.src = e.target.result);
        reader.readAsDataURL(file);
      });
    },
    onUpdateTranscriptRecord(isChecked, requirementId) {
      if (isChecked) {
        this.requirements.push(requirementId);
      } else {
        const index = this.requirements.indexOf(requirementId);
        this.requirements.splice(index, 1);
      }

      this.updateTranscriptRecord(this.transcriptRecordId, {
        requirements: this.requirements,
      });
    },
  },
};
</script>
<style scoped>
.file-uploader-container {
  width: 100%;
  height: 250px;
  margin: 20px 0 20px 0;
}

.file-item-container {
  width: 100%;
  height: auto;
}
</style>
