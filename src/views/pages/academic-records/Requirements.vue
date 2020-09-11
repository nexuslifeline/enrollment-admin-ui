<template>
  <div>
    <b-card>
      <h5 slot="header">
        <span>
          Requirements <br>
          <small>List of all requirement of the student.</small>
        </span>
      </h5>
      <b-card-body>
        <b-table
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
              <span><b-link @click="loadDetails(data)">{{ data.item.student.name }}</b-link></span><br>
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
              <!-- {{ data.item.enrolledYear ? `Enrolled Year: ${data.item.enrolledYear}` : '' }} -->
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
            <v-icon
              :name="row.detailsShowing ? 'caret-down' : 'caret-left'"
              @click="loadDetails(row)" />
          </template>
          <template v-slot:row-details="data">
            <b-overlay :show="data.item.isLoading" rounded="sm">
              <b-card>
                <div v-if="data.item.files">
                  <h5>Files</h5>
                  <!-- <b-table
                    hover outlined small responsive show-empty
                    :fields="tables.files.fields"
                    :items="data.item.files"
                    :busy="tables.files.isBusy">
                    <template v-slot:cell(action)="row">
                      <b-button
                        @click="previewFile(row)"
                        size="sm" variant="secondary">
                        <v-icon
                          name="search"/>
                      </b-button>
                    </template>
                    <template v-slot:table-busy>
                      <div class="text-center my-2">
                        <v-icon
                          name="spinner"
                          spin
                          class="mr-2" />
                        <strong>Loading...</strong>
                      </div>
                    </template>
                  </b-table> -->
                  <b-row>
                    <b-col md=12>
                      <div class="file-uploader-container">
                        <FileUploader
                          @onFileChange="onEvaluationFileUpload($event, data.item)"
                          @onFileDrop="onEvaluationFileUpload($event, data.item)"
                        />
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col md=12>
                      <div class="file-item-container">
                        <FileItem
                          v-for="(item, index) of data.item.files"
                          :key="index"
                          :title="item.name"
                          :description="item.notes"
                          :fileIndex="index"
                          @onFileItemSelect="onEvaluationFileItemSelect(item, data.item)"
                          @onFileItemRemove="onDeleteEvaluationFile($event, data.item)"
                          @onFileItemPreview="previewFile(item)"
                          :isBusy="item.isBusy"
                        />
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </b-card>
            </b-overlay>
          </template>
        </b-table>
      </b-card-body>
    </b-card>
    <b-modal
      v-model="showEvaluationFileModal"
      centered
      header-bg-variant="success"
      header-text-variant="light"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true">
      <div slot="modal-title">
        Evaluation File
      </div>
      <b-row>
        <b-col md=12>
          <label>Notes</label>
          <b-textarea
            v-model="forms.evaluationFile.fields.notes"
            :state="forms.evaluationFile.states.notes"
            rows=7
            debounce="500" />
          <b-form-invalid-feedback>
            {{ forms.evaluationFile.errors.notes }}
          </b-form-invalid-feedback>
        </b-col>
      </b-row>
      <div slot="modal-footer" class="w-100">
        <b-button
          class="float-left"
          @click="onDeleteEvaluationFile(selectedEvaluationFile, evaluationRow)"
          variant="outline-danger">
          <v-icon
            v-if="isFileDeleting"
            name="sync"
            class="mr-2"
            spin
          />
          Delete
        </b-button>
        <b-button
          @click="onUpdateEvaluationFile()"
          class="float-right"
          variant="outline-primary">
          <v-icon
            v-if="isFileUpdating"
            name="sync"
            class="mr-2"
            spin
          />
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
import { StudentApi, EvaluationApi, EvaluationFileApi } from '../../../mixins/api'
import { EvaluationStatuses, StudentCategories } from '../../../helpers/enum'
import EvaluationEntry from './EvaluationEntry'
import FileViewer from '../../components/FileViewer'
import  FileUploader from '../../components/FileUploader'
import  FileItem from '../../components/FileItem'
import { copyValue } from '../../../helpers/extractor'
import { clearFields, reset, showNotification } from '../../../helpers/forms'

const evaluationFileFields = {
  id: null,
  notes: null
}

export default {
  mixins: [ StudentApi, EvaluationApi, EvaluationFileApi ],
  components: {
    EvaluationEntry,
    FileViewer,
    FileUploader,
    FileItem
  },
  created() {
    this.studentId = this.$route.params.studentId
    this.loadStudentEvaluationList()
  },
  data() {
    return {
      showModalPreview: false,
      file: {
        type: null,
        src: null,
        name: null,
        notes: null,
        isLoading: false
      },
      evaluationFiles: [],
      isProcessing: false,
      showEntry: false,
      isEntryLoading: false,
      studentCategories: StudentCategories,
      evaluationStatuses: EvaluationStatuses,
      studentId: null,
      tables: {
        evaluations: {
          isBusy: false,
          fields: [
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: { width: "auto"},
							formatter: (value, key, item) => {
								if(!item.student.middleName){
									item.student.middleName = ""
								}
								item.student.name = item.student.firstName + " " + item.student.middleName + " " + item.student.lastName
							}
						},
						{
							key: "contact",
							label: "Contact Info",
							tdClass: "align-middle",
							thStyle: { width: "20%" },

						},
						{
							key: "education",
							label: "Education",
							tdClass: "align-middle",
              thStyle: { width: "20%"}
            },
            {
              key: "studentCategory.name",
							label: "Student Category",
							tdClass: "align-middle text-center font-weight-bold",
							thClass: "text-center",
							thStyle: { width: "12%"}
            },
						{
							key: "status",
							label: "Status",
							tdClass: "align-middle text-center",
							thClass: "text-center",
							thStyle: { width: "12%"}
            },
            {
							key: "attachments",
							label: "",
							tdClass: "align-middle text-center",
							thClass: "text-center",
							thStyle: { width: "8%"}
						},
						{
							key: "action",
							label: "",
							tdClass: "align-middle",
							thStyle: { width: "40px"}
						},
					],
          items: []
        },
        files: {
					isBusy: false,
					fields: [
            {
							key: "name",
							label: "Filename",
							tdClass: "align-middle",
              thStyle: { width: "40%" }
						},
            {
							key: "notes",
							label: "Notes",
							tdClass: "align-middle",
              thStyle: { width: "auto" }
						},
						{
              key: "action",
              label: "",
							tdClass: "align-middle",
							thStyle: { width: "35px" }
            }
          ],
					items: []
				},
      },
      showEvaluationFileModal: false,
      selectedEvaluationFile: null,
      isFileDeleting: false,
      isFileUpdating: false,
      evaluationRow: null,
      forms: {
        evaluationFile: {
          fields: { ...evaluationFileFields },
          states: { ...evaluationFileFields },
          errors: { ...evaluationFileFields }
        }
      }
    }
  },
  methods: {
    onUpdateEvaluation() {
      const { fields, fields: { student, level, course, studentCategory, ...evaluation } } = this.forms.evaluation
      const subjects = evaluation.subjects.map(s => {
        const subject = {
          subjectId: s.id,
          levelId: s.pivot.levelId,
          semesterId: s.pivot.semesterId,
          grade: s.pivot.grade,
          notes: s.pivot.notes,
          isTaken: s.pivot.isTaken
        }
        return subject
      })
      const data = { ...evaluation, subjects }
      // console.log(data)
      // return
      this.isProcessing = true;
      this.updateEvaluation(data, evaluation.id)
      .then(({ data }) => {
        // this.loadEvaluation()
        this.isProcessing = false
        this.showEntry = false
        showNotification(this, "success", "Updated Successfully.")
        this.loadStudentEvaluationList()
      }).catch((error) => {
        this.isProcessing = false;
        const errors = error.response.data.errors
        // this.showBulletedNotification(errors)
      });

    },
    loadStudentEvaluationList() {
      const evaluationStatusId = EvaluationStatuses.APPROVED.id
      const params = { paginate: false, evaluationStatusId }
      const { evaluations } = this.tables
      evaluations.isBusy = true
      this.getEvaluationsOfStudent(this.studentId, params)
      .then(({ data }) => {
        evaluations.isBusy = false
        evaluations.items = data
      })
    },
    avatar(student){
      let src = ''
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName
      }
      return src
    },
    getName(item, child){
      if (item) {
        let value = item[child]
        if (value) {
          return value['name']
        }
      }
      return ''
    },
    loadDetails(row) {
      if (!row.detailsShowing) {
				const {
          item,
					item: { id: evaluationId },
				} = row
        const params = { paginate: false }
        this.$set(item, 'isLoading', true)
				this.isLoading = true
				this.getEvaluationFileList(evaluationId, params)
					.then(({ data }) => {
						this.$set(item, 'files', data)
            this.isLoading = false
            item.isLoading = false
        })
			}
			row.toggleDetails()
    },
    onEvaluationFileUpload(file, item) {
      const formData = new FormData();

      formData.append('file', file);

      item.files.push(
        {
          id: null,
          name: null,
          notes: null,
          isBusy: true
        }
      )
      const evaluationFile = item.files[item.files.length - 1]
      const { isBusy, ...evaluationKeys } = evaluationFile
      this.addEvaluationFile(formData, item.id)
      .then(({ data }) => {
        copyValue(data, evaluationFile, Object.keys(evaluationKeys))
        evaluationFile.isBusy = false
      })
      .catch(error => {
        item.files.splice(item.files.length - 1, 1)
      })
    },
    onDeleteEvaluationFile (index, item) {
      this.isFileDeleting = true
      this.selectedEvaluationFile.isBusy = true
      this.deleteEvaluationFile(item.id, this.selectedEvaluationFile.id)
      .then(()=> {
        this.isFileDeleting = false
        this.showEvaluationFileModal = false
        item.files.splice(index, 1);
      }).catch((error) => {
        this.isFileDeleting = false
        this.selectedEvaluationFile.isBusy = false
      });
    },
    onEvaluationFileItemSelect(file, item) {
      const { evaluationFile } = this.forms
      reset(evaluationFile)
      this.selectedEvaluationFile = file
      this.evaluationRow = item

      evaluationFile.fields.id = this.selectedEvaluationFile.id
      evaluationFile.fields.notes = this.selectedEvaluationFile.notes

      this.showEvaluationFileModal = true
    },
    onUpdateEvaluationFile () {
      const { evaluationFile } = this.forms

      this.isFileUpdating = true
      this.selectedEvaluationFile.isBusy = true

      this.updateEvaluationFile(evaluationFile.fields, this.evaluationRow.id, evaluationFile.fields.id)
      .then(({ data }) => {
        this.selectedEvaluationFile.notes = data.notes;
        this.isFileUpdating = false
        this.showEvaluationFileModal = false;
        this.selectedEvaluationFile.isBusy = false
      }).catch((error) => {
        const { errors } = error.response.data;
        validate(evaluationFile, errors);
        this.isFileUpdating = true
        this.selectedEvaluationFile.isBusy = false
      });
    },
    previewFile(item) {
      const { evaluationId, id, name, notes } = item
      this.file.type = null
      this.file.src = null
      this.file.name = name
      this.file.notes = notes
      this.showModalPreview = true
      this.file.isLoading = true
      this.getEvaluationFilePreview(evaluationId, id)
        .then(response => {
          this.file.type = response.headers.contentType
          this.file.isLoading = false
          const file = new Blob([response.data], { type: response.headers.contentType })
          const reader = new FileReader();
          reader.onload = e => this.file.src = e.target.result
          reader.readAsDataURL(file);
        })
    },
  }
}
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
