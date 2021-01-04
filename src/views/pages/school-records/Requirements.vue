<template>
  <div>
    <b-card>
      <h5 slot="header">
        <span>
          Requirements <br />
          <small>List of all requirement of the student.</small>
        </span>
      </h5>
      <b-card-body v-if="student">
        <!-- <b-table
          details-td-class="table-secondary"
          hover outlined small show-empty responsive
          :fields="tables.evaluations.fields"
          :items.sync="tables.evaluations.items"
          :busy="tables.evaluations.isBusy">
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon
                name="spinner"
                spin
                class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(attachments)="data">
            <span>{{ data.item.filesCount }} &nbsp; &nbsp; &nbsp; &nbsp; </span>  <v-icon name="paperclip"/>
          </template>
          <template v-slot:cell(name)="data">
            <b-media>
              <template v-slot:aside>
                <b-avatar
                  rounded
                  blank
                  size="64"
                  :text="data.item.student.firstName.charAt(0) + '' + data.item.student.lastName.charAt(0)"
                  :src="avatar(data.item.student)" />
              </template>
              <span>{{ data.item.student.name }}</span><br>
              <small>Student no.: {{ data.item.student.studentNo ? data.item.student.studentNo : 'Awaiting Confirmation' }}</small><br>
              <small>Address : {{ data.item.student.address ?
                data.item.student.address.currentCompleteAddress : "" }}
              </small>
            </b-media>
          </template>
          <template v-slot:cell(contact)="data">
            Email : {{ data.item.student.email }} <br>
            <small>Phone : {{ data.item.student.phoneNo }}</small> <br>
            <small>Mobile : {{ data.item.student.mobileNo }}</small> <br>
          </template>
          <template v-slot:cell(education)="data">
            <span>
              {{ getName(data.item, 'level') }}<br>
              {{ getName(data.item, 'course') }}<br>
            </span>
          </template>
          <template v-slot:cell(studentCategory.name)="{ item: { studentCategory, studentCategoryId } }">
            <b-badge
              :variant="studentCategoryId === studentCategories.NEW.id
                ? 'success'
                : studentCategoryId === studentCategories.OLD.id ? 'primary' : 'warning'">
              {{ studentCategory.name }}
            </b-badge>
          </template>
          <template v-slot:cell(status)="data">
            <b-badge
              :variant="data.item.evaluationStatusId === evaluationStatuses.APPROVED.id
                ? 'success'
                : data.item.evaluationStatusId === evaluationStatuses.REJECTED.id ? 'danger' : 'warning'">
              {{ evaluationStatuses.getEnum(data.item.evaluationStatusId).name }}
            </b-badge>
          </template>
          <template v-slot:cell(action)="row">
            <b-dropdown right variant="link" toggle-class="text-decoration-none" no-caret>
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item
                :to="`/master-files/student/${$route.params.studentId}/school-records/requirements/${row.item.id}`">
                Edit
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </b-table> -->
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
                student.latestAcademicRecord.studentCategoryId ===
                $options.StudentCategories.NEW.id
                  ? 'success'
                  : student.studentCategoryId ===
                    $options.StudentCategories.OLD.id
                  ? 'primary'
                  : 'warning'
              "
            >
              {{
                $options.StudentCategories.getEnum(
                  student.latestAcademicRecord.studentCategoryId
                )
                  ? $options.StudentCategories.getEnum(
                      student.latestAcademicRecord.studentCategoryId
                    ).name
                  : ''
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
        <b-row class="mt-3">
          <b-col md="8">
            <h5>Files</h5>
            <b-row>
              <b-col md="12">
                <div class="file-uploader-container">
                  <FileUploader
                    @onFileChange="onStudentFileUpload($event, student)"
                    @onFileDrop="onStudentFileUpload($event, student)"
                  />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <div class="file-item-container">
                  <FileItem
                    v-for="(item, index) of student.files"
                    :key="index"
                    :title="item.name"
                    :description="item.notes"
                    :fileIndex="index"
                    @onFileItemSelect="onStudentFileItemSelect(item, student)"
                    @onFileItemRemove="onDeleteStudentFile(item, student)"
                    @onFileItemPreview="previewFile(item)"
                    :isBusy="item.isBusy"
                  />
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col md="4">
            <h5>Checklist</h5>
            <b-form-checkbox
              v-for="requirement in requirements"
              :key="requirement.id"
              :checked="checkIfAlreadyChecked(requirement.id)"
              @input="onUpdateStudent($event, requirement.id)"
            >
              {{ requirement.name }}
            </b-form-checkbox>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
    <b-modal
      v-model="showStudentFileModal"
      centered
      header-bg-variant="success"
      header-text-variant="light"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        Student File
      </div>
      <b-row>
        <b-col md="12">
          <label>Notes</label>
          <b-textarea
            v-model="forms.studentFile.fields.notes"
            :state="forms.studentFile.states.notes"
            rows="7"
            debounce="500"
          />
          <b-form-invalid-feedback>
            {{ forms.studentFile.errors.notes }}
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
      <div slot="modal-footer" class="w-100">
        <b-button
          class="float-left"
          @click="onDeleteStudentFile(selectedStudentFile, studentRow)"
          variant="outline-danger"
        >
          <v-icon v-if="isFileDeleting" name="sync" class="mr-2" spin />
          Delete
        </b-button>
        <b-button
          @click="onUpdateStudentFile()"
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
  RequirementApi,
  StudentApi,
  StudentFileApi,
} from '../../../mixins/api';
import { clearFields, reset, showNotification } from '../../../helpers/forms';
import { StudentCategories } from '../../../helpers/enum';
import FileViewer from '../../components/FileViewer';
import FileUploader from '../../components/FileUploader';
import FileItem from '../../components/FileItem';
import { copyValue } from '../../../helpers/extractor';

const studentFileFields = {
  id: null,
  notes: null,
};

export default {
  mixins: [StudentApi, StudentFileApi, RequirementApi],
  components: {
    FileUploader,
    FileItem,
    FileViewer,
  },
  created() {
    this.studentId = this.$route.params.studentId;
    this.loadStudent();
  },
  StudentCategories,
  data() {
    return {
      showModalPreview: false,
      studentId: null,
      student: null,
      file: {
        type: null,
        src: null,
        name: null,
        notes: null,
        isLoading: false,
      },
      forms: {
        studentFile: {
          fields: { ...studentFileFields },
          states: { ...studentFileFields },
          errors: { ...studentFileFields },
        },
      },
      requirements: [],
      checkedRequirements: [],
      showStudentFileModal: false,
      selectedStudentFile: null,
      studentRow: null,
      isFileDeleting: false,
      isFileUpdating: false,
      schoolCategoryId: null,
    };
  },
  methods: {
    loadStudent() {
      this.getStudent(this.studentId).then(({ data }) => {
        const { latestAcademicRecord, requirements } = data;
        this.student = data;
        this.schoolCategoryId = latestAcademicRecord.schoolCategoryId;
        const studentRequirements = this.student.requirements.map((r) => {
          return {
            requirementId: r.id,
            schoolCategoryId: this.schoolCategoryId,
          };
        });
        this.checkedRequirements = studentRequirements;
        this.loadRequirements();
      });
    },
    loadRequirements() {
      const params = {
        paginate: false,
        schoolCategoryId: this.schoolCategoryId,
      };
      this.getRequirementList(params)
        .then(({ data }) => {
          this.requirements = data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onStudentFileUpload(file, item) {
      const formData = new FormData();

      formData.append('file', file);

      item.files.push({
        id: null,
        name: null,
        notes: null,
        isBusy: true,
      });

      const studentFile = item.files[item.files.length - 1];
      const { isBusy, ...studentKeys } = studentFile;
      this.addStudentFile(formData, this.studentId)
        .then(({ data }) => {
          copyValue(data, studentFile, Object.keys(studentKeys));
          studentFile.isBusy = false;
        })
        .catch((error) => {
          item.files.splice(item.files.length - 1, 1);
        });
    },
    onDeleteStudentFile(file, item) {
      const index = item.files.findIndex((f) => f.id === file.id);
      this.deleteStudentFile(this.studentId, file.id)
        .then(() => {
          this.isFileDeleting = false;
          this.showStudentFileModal = false;
          item.files.splice(index, 1);
        })
        .catch((error) => {
          this.isFileDeleting = false;
          this.selectedStudentFile.isBusy = false;
        });
    },
    onStudentFileItemSelect(file, item) {
      const { studentFile } = this.forms;
      reset(studentFile);
      this.selectedStudentFile = file;
      this.studentRow = item;

      studentFile.fields.id = file.id;
      studentFile.fields.notes = this.selectedStudentFile.notes;

      this.showStudentFileModal = true;
    },
    onUpdateStudentFile() {
      const { studentFile } = this.forms;

      this.isFileUpdating = true;
      this.selectedStudentFile.isBusy = true;

      this.updateStudentFile(
        studentFile.fields,
        this.studentRow.id,
        studentFile.fields.id
      )
        .then(({ data }) => {
          this.selectedStudentFile.notes = data.notes;
          this.isFileUpdating = false;
          this.showStudentFileModal = false;
          this.selectedStudentFile.isBusy = false;
        })
        .catch((error) => {
          const { errors } = error.response.data;
          validate(studentFile, errors);
          this.isFileUpdating = true;
          this.selectedStudentFile.isBusy = false;
        });
    },
    previewFile(item) {
      const { studentId, id, name, notes } = item;
      this.file.type = null;
      this.file.src = null;
      this.file.name = name;
      this.file.notes = notes;
      this.showModalPreview = true;
      this.file.isLoading = true;
      this.getStudentFilePreview(studentId, id).then((response) => {
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
    onUpdateStudent(isChecked, requirementId) {
      if (isChecked) {
        this.checkedRequirements.push({
          requirementId,
          schoolCategoryId: this.schoolCategoryId,
        });
      } else {
        const index = this.checkedRequirements
          .map((r) => r.requirementId)
          .indexOf(requirementId);
        this.checkedRequirements.splice(index, 1);
      }

      this.updateStudent(
        {
          requirements: this.checkedRequirements,
        },
        this.studentId
      );
    },
    checkIfAlreadyChecked(requirementId) {
      const studentRequirements = this.student.requirements.map((r) => r.id);
      if (studentRequirements.includes(requirementId)) {
        return true;
      }
      return false;
    },
  },
};
</script>
<style scoped>
.file-uploader-container {
  width: 100%;
  height: 150px;
  margin: 20px 0 20px 0;
}

.file-item-container {
  width: 100%;
  height: auto;
}
</style>
