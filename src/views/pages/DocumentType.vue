<template>
  <div class="c-page-content">
    <Card title="Document Type Fee Management">
      <div>
        <!-- add button and search -->
        <b-row class="mb-3">
          <b-col md=12>
            <b-row>
              <b-col md=8>
                <b-button
                  v-if="isAccessible($options.DocumentTypePermission.ADD.id)"
                  variant="primary"
                  @click="setCreate()">
                  <v-icon name="plus-circle" /> ADD NEW DOCUMENT TYPE
                </b-button>
              </b-col>
              <b-col md=4>
                <b-form-input
                  v-model="filters.documentType.criteria"
                  type="text"
                  placeholder="Search"
                  debounce="500">
                </b-form-input>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <!-- end add button and search -->
        <!-- table -->
        <b-row >
          <b-col md=12>
            <b-table
              class="c-table"
              small hover outlined show-empty
              :fields="tables.documentTypes.fields"
              :busy="tables.documentTypes.isBusy"
              :items="tables.documentTypes.items"
              :current-page="paginations.documentType.page"
              :per-page="paginations.documentType.perPage"
              :filter="filters.documentType.criteria"
              @filtered="onFiltered($event, paginations.documentType)">
              <!-- :filter="filters.documentType.criteria> -->
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <v-icon
                    name="spinner"
                    spin
                    class="mr-2" />
                  <strong>Loading...</strong>
                </div>
              </template>
              <template v-slot:cell(action)="row">
                <b-dropdown
                  v-if="isAccessible([
                    $options.DocumentTypePermission.EDIT.id,
                    $options.DocumentTypePermission.DELETE.id
                ])"
                  right variant="link"
                  toggle-class="text-decoration-none"
                  no-caret>
                  <template v-slot:button-content>
                    <v-icon name="ellipsis-v" />
                  </template>
                  <b-dropdown-item
                    v-if="isAccessible($options.DocumentTypePermission.EDIT.id)"
                    @click="setUpdate(row)"
                    :disabled="showModalEntry">
                    <v-icon name="pen" class="mr-1"/> Edit
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="isAccessible($options.DocumentTypePermission.DELETE.id)"
                    @click="forms.documentType.fields.id = row.item.id, showModalConfirmation = true"
                    :disabled="showModalConfirmation">
                    <v-icon name="trash"  class="mr-1"/> Delete
                  </b-dropdown-item>
                </b-dropdown>
              </template>
            </b-table>
            <b-row>
              <b-col md=6>
                Showing {{ paginations.documentType.from }} to {{ paginations.documentType.to }} of {{ paginations.documentType.totalRows }} records.
                </b-col>
              <b-col md=6>
                <b-pagination
                  class="c-pagination"
                  v-model="paginations.documentType.page"
                  :total-rows="paginations.documentType.totalRows"
                  :per-page="paginations.documentType.perPage"
                  size="sm"
                  align="end"
                  @input="recordDetails(paginations.documentType)" />
                </b-col>
              </b-row>
          </b-col>
        </b-row>
        <!-- end table -->
      </div>
    </Card>
    <!-- Modal Entry -->
    <b-modal
			v-model="showModalEntry"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					Document Type - {{ entryMode }}
			</div> <!-- modal title -->
      <!-- modal body -->
      <b-overlay :show="forms.documentType.isLoading" rounded="sm">
        <b-row>
          <b-col md=12>
            <b-form-group >
              <label class="required">Name</label>
              <b-form-input
                ref="name"
                v-model="forms.documentType.fields.name"
                :state="forms.documentType.states.name" />
              <b-form-invalid-feedback>
                {{forms.documentType.errors.name}}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
      </b-overlay>
      <!-- end modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button
          variant="outline-danger"
          class="float-left btn-close"
          @click="showModalEntry=false">
          Close
        </b-button>
        <b-button
          :disabled="forms.documentType.isProcessing"
          variant="outline-primary"
          class="float-right btn-save"
          @click="onDocumentTypeEntry()">
          <v-icon
            v-if="forms.documentType.isProcessing"
            name="sync"
            spin
            class="mr-2" />
          Save
        </b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
    <!-- End Modal Entry -->

    <!-- Modal Confirmation -->
    <b-modal
      v-model="showModalConfirmation"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true" >
      <div slot="modal-title">
          Delete Document Type
      </div>
      Are you sure you want to delete this Document Type ?
      <div slot="modal-footer">
        <b-button
          :disabled="forms.documentType.isProcessing"
          variant="outline-primary"
          class="mr-2 btn-save"
          @click="onDocumentTypeDelete()">
          <v-icon
            v-if="forms.documentType.isProcessing"
            name="sync"
            spin
            class="mr-2"/>
          Yes
        </b-button>
        <b-button
          variant="outline-danger"
          class="btn-close"
          @click="showModalConfirmation=false">
          No
        </b-button>
      </div>
    </b-modal>
    <!-- End Modal Confirmation -->
  </div>
</template>
<script>

const documentTypeFields = {
  id: null,
  name: null,
}

import { DocumentTypeApi } from "../../mixins/api"
import { validate, reset, clearFields, showNotification } from '../../helpers/forms'
import { copyValue } from '../../helpers/extractor'
import Tables from '../../helpers/tables'
import { DocumentTypePermission } from '../../helpers/enum'
import Access from '../../mixins/utils/Access'
import Card from '../components/Card'

export default {
	// name: "DocumentType",
  mixins: [
    DocumentTypeApi,
    Tables,
    Access
  ],
  components: {
    Card
  },
  DocumentTypePermission,
	data() {
		return {
      showModalEntry: false,
      showModalConfirmation: false,
      entryMode: "",
      forms: {
        documentType: {
          isProcessing: false,
          isLoading: false,
          fields: { ...documentTypeFields },
          states: { ...documentTypeFields },
          errors: { ...documentTypeFields }
        }
      },
			tables: {
				documentTypes: {
          isBusy: false,
					fields: [
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: {width: "auto"}
						},
            {
              key: "action",
							label: "",
							tdClass: "align-middle",
							thStyle: { width: "40px"}
            }
          ],
          items:[]
				}
      },
      paginations: {
				documentType: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        documentType: {
          criteria: null
        }
      }
		}
	},
	created(){
    this.loadDocumentTypes()
	},
	methods: {
		loadDocumentTypes(){
      const { documentTypes } = this.tables
      const { documentType } = this.paginations
      documentTypes.isBusy = true

			let params = { paginate: false }
      this.getDocumentTypeList(params).then(({ data }) =>{
        documentTypes.items = data
        documentType.totalRows = data.length
        this.recordDetails(documentType)
        documentTypes.isBusy = false
      })
    },
    onDocumentTypeEntry(){
      const { documentType, documentType: { fields } } = this.forms
      const { documentTypes } = this.tables
      documentType.isProcessing = true
      reset(documentType)
      if(this.entryMode == "Add"){
        this.addDocumentType(fields)
          .then(({ data }) => {
            this.addRow(documentTypes, this.paginations.documentType, data)
            documentType.isProcessing = false
            showNotification(this, "success", "Document Type created successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            documentType.isProcessing = false
            validate(documentType, errors)
          })
      }
      else {
        const { fields } = this.forms.documentType
        this.updateDocumentType(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(documentTypes, data)
            documentType.isProcessing = false
            showNotification(this, "success", "Document Type updated successfully.")
            this.showModalEntry = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            documentType.isProcessing = false
            validate(documentType, errors)
          })
      }
    },
    onDocumentTypeDelete(){
      const { documentType, documentType: { fields: { id } } } = this.forms
      const { documentTypes } = this.tables
      documentType.isProcessing = true
      this.deleteDocumentType(id)
        .then(({ data }) => {
          this.deleteRow(documentTypes, this.paginations.documentType, id)
          documentType.isProcessing = false
          showNotification(this, "success", "School Fee deleted successfully.")
          this.showModalConfirmation = false
        })
    },
    setUpdate(row){
      const { documentType, documentType: { fields } } = this.forms
      this.showModalEntry = true
      documentType.isLoading = true
      copyValue(row.item, fields)
      reset(documentType)
      this.entryMode = "Edit"
      documentType.isLoading = false
    },
    setCreate(){
      const { documentType } = this.forms
      this.showModalEntry = true
      documentType.isLoading = true
      reset(documentType)
      clearFields(documentType.fields)
      this.entryMode='Add'
      documentType.isLoading = false
    },
	}
}
</script>