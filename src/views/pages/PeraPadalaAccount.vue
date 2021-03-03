<template>
  <PageContent
    title="Pera Padala Account Management"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadPeraPadalaAccounts"
    :filterVisible="isFilterVisible"
    @create="setCreate()"
    :createButtonVisible="isAccessible($options.PeraPadalaAccountPermissions.ADD.id)">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.peraPadalaAccount.criteria"
        debounce="500"
        type="text"
        placeholder="Search"
      />
      <!-- v-if="isAccessible($options.ba.ADD.id)" -->
      <!-- <b-button
        variant="primary"
        class="w-100 mt-2"
        @click="setCreate()"
      >
        <v-icon name="plus-circle" /> ADD NEW BANK ACCOUNT
      </b-button> -->
    </template>
    <template v-slot:content >
      <div>
        <!-- <b-row class="mb-3">
          <b-col md="12">
            <b-row>
              <b-col md="8">
                <b-button variant="primary" @click="setCreate()">
                  <v-icon name="plus-circle" /> ADD NEW PERA PADALA ACCOUNT
                </b-button>
              </b-col>
              <b-col md="4">
                <b-form-input
                  v-model="filters.peraPadalaAccount.criteria"
                  type="text"
                  placeholder="Search"
                  debounce="500"
                >
                </b-form-input>
              </b-col>
            </b-row>
          </b-col>
        </b-row> -->
        <!-- end add button and search -->
        <!-- table -->
        <b-row>
          <b-col md="12">
            <b-table
              class="c-table"
              small
              hover
              outlined
              show-empty
              :fields="tables.peraPadalaAccounts.fields"
              :busy="tables.peraPadalaAccounts.isBusy"
              :items="tables.peraPadalaAccounts.items"
              :current-page="paginations.peraPadalaAccount.page"
              :per-page="paginations.peraPadalaAccount.perPage"
              :filter="filters.peraPadalaAccount.criteria"
              @filtered="onFiltered($event, paginations.peraPadalaAccount)"
            >
              <!-- :filter="filters.peraPadalaAccount.criteria> -->
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <v-icon name="spinner" spin class="mr-2" />
                  <strong>Loading...</strong>
                </div>
              </template>
              <template v-slot:cell(provider)="{ item, value }">
                <b-link @click="setUpdate(item)" :disabled="!isAccessible($options.PeraPadalaAccountPermissions.EDIT.id)">{{ value }} </b-link>
              </template>
              <template v-slot:cell(action)="row">
                <b-dropdown
                  right
                  variant="link"
                  toggle-class="text-decoration-none"
                  no-caret
                >
                  <template v-slot:button-content>
                    <v-icon name="ellipsis-v" />
                  </template>
                  <b-dropdown-item
                    v-if="isAccessible($options.PeraPadalaAccountPermissions.EDIT.id)"
                    @click="setUpdate(row.item)"
                    :disabled="showModalEntry"
                  >
                    Edit
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="isAccessible($options.PeraPadalaAccountPermissions.DELETE.id)"
                    @click="
                      (forms.peraPadalaAccount.fields.id = row.item.id),
                        (showModalConfirmation = true)
                    "
                    :disabled="showModalConfirmation"
                  >
                    Delete
                  </b-dropdown-item>
                </b-dropdown>
              </template>
            </b-table>
            <b-row>
              <b-col md="6">
                Showing {{ paginations.peraPadalaAccount.from }} to
                {{ paginations.peraPadalaAccount.to }} of
                {{ paginations.peraPadalaAccount.totalRows }} records.
              </b-col>
              <b-col md="6">
                <b-pagination
                  class="c-pagination"
                  v-model="paginations.peraPadalaAccount.page"
                  :total-rows="paginations.peraPadalaAccount.totalRows"
                  :per-page="paginations.peraPadalaAccount.perPage"
                  size="sm"
                  align="end"
                  @input="recordDetails(paginations.peraPadalaAccount)"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <!-- end table -->
      </div>
      <!-- Modal Entry -->
      <b-modal
        v-model="showModalEntry"
        :noCloseOnEsc="true"
        :noCloseOnBackdrop="true"
      >
        <div slot="modal-title">
          <!-- modal title -->
          Pera Padala - {{ entryMode }}
        </div>
        <!-- modal title -->
        <!-- modal body -->
        <b-overlay :show="forms.peraPadalaAccount.isLoading" rounded="sm">
          <b-row>
            <b-col md="12">
              <b-form-group>
                <label class="required">Provider</label>
                <b-form-input
                  ref="name"
                  v-model="forms.peraPadalaAccount.fields.provider"
                  :state="forms.peraPadalaAccount.states.provider"
                />
                <b-form-invalid-feedback>
                  {{ forms.peraPadalaAccount.errors.provider }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12">
              <b-form-group>
                <label class="required">Receiver Name</label>
                <b-form-input
                  v-model="forms.peraPadalaAccount.fields.receiverName"
                  :state="forms.peraPadalaAccount.states.receiverName"
                />
                <b-form-invalid-feedback>
                  {{ forms.peraPadalaAccount.errors.receiverName }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12">
              <b-form-group>
                <label class="required">Receiver Mobile No</label>
                <b-form-input
                  v-model="forms.peraPadalaAccount.fields.receiverMobileNo"
                  :state="forms.peraPadalaAccount.states.receiverMobileNo"
                />
                <b-form-invalid-feedback>
                  {{ forms.peraPadalaAccount.errors.receiverMobileNo }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
        </b-overlay>
        <!-- end modal body -->
        <div slot="modal-footer" class="w-100">
          <!-- modal footer buttons -->
          <b-button
            variant="outline-danger"
            class="float-left btn-close"
            @click="showModalEntry = false"
          >
            Close
          </b-button>
          <b-button
            :disabled="forms.peraPadalaAccount.isProcessing"
            variant="outline-primary"
            class="float-right btn-save"
            @click="onPeraPadalaAccountEntry()"
          >
            <v-icon
              v-if="forms.peraPadalaAccount.isProcessing"
              name="sync"
              spin
              class="mr-2"
            />
            Save
          </b-button>
        </div>
        <!-- modal footer buttons -->
      </b-modal>
      <!-- End Modal Entry -->

      <!-- Modal Confirmation -->
      <b-modal
        v-model="showModalConfirmation"
        :noCloseOnEsc="true"
        :noCloseOnBackdrop="true"
      >
        <div slot="modal-title">
          Delete Pera Padala
        </div>
        Are you sure you want to delete this Pera Padala ?
        <div slot="modal-footer">
          <b-button
            :disabled="forms.peraPadalaAccount.isProcessing"
            variant="outline-primary"
            class="mr-2 btn-save"
            @click="onPeraPadalaAccountDelete()"
          >
            <v-icon
              v-if="forms.peraPadalaAccount.isProcessing"
              name="sync"
              spin
              class="mr-2"
            />
            Yes
          </b-button>
          <b-button
            variant="outline-danger"
            class="btn-close"
            @click="showModalConfirmation = false"
          >
            No
          </b-button>
        </div>
      </b-modal>
      <!-- End Modal Confirmation -->
    </template>
  </PageContent>
</template>
<script>
const peraPadalaAccountFields = {
  id: null,
  provider: null,
  receiverName: null,
  receiverMobileNo: null,
};

import { PeraPadalaAccountApi } from '../../mixins/api';
import {
  validate,
  reset,
  clearFields,
  showNotification,
} from '../../helpers/forms';
import { copyValue } from '../../helpers/extractor';
import Tables from '../../helpers/tables';
import Card from '../components/Card';
import PageContent from "../components/PageContainer/PageContent";
import { PeraPadalaAccountPermissions } from '../../helpers/enum'
import Access from '../../mixins/utils/Access';

export default {
  name: 'PeraPadalaAccount',
  mixins: [PeraPadalaAccountApi, Tables, Access ],
  PeraPadalaAccountPermissions,
  components: {
    Card,
    PageContent
  },
  data() {
    return {
      isFilterVisible: true,
      showModalEntry: false,
      showModalConfirmation: false,
      entryMode: '',
      forms: {
        peraPadalaAccount: {
          isProcessing: false,
          isLoading: false,
          fields: { ...peraPadalaAccountFields },
          states: { ...peraPadalaAccountFields },
          errors: { ...peraPadalaAccountFields },
        },
      },
      tables: {
        peraPadalaAccounts: {
          isBusy: false,
          fields: [
            {
              key: 'provider',
              label: 'Provider',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
            },
            {
              key: 'receiverName',
              label: 'Receiver Name',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
            },
            {
              key: 'receiverMobileNo',
              label: 'Receiver Mobile No',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thStyle: { width: '40px' },
            },
          ],
          items: [],
        },
      },
      paginations: {
        peraPadalaAccount: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        peraPadalaAccount: {
          criteria: null,
        },
      },
    };
  },
  created() {
    this.loadPeraPadalaAccounts();
  },
  methods: {
    loadPeraPadalaAccounts() {
      const { peraPadalaAccounts } = this.tables;
      const { peraPadalaAccount } = this.paginations;
      peraPadalaAccounts.isBusy = true;

      let params = { paginate: false };
      this.getPeraPadalaAccountList(params).then(({ data }) => {
        peraPadalaAccounts.items = data;
        peraPadalaAccount.totalRows = data.length;
        this.recordDetails(peraPadalaAccount);
        peraPadalaAccounts.isBusy = false;
      });
    },
    onPeraPadalaAccountEntry() {
      const {
        peraPadalaAccount,
        peraPadalaAccount: { fields },
      } = this.forms;
      const { peraPadalaAccounts } = this.tables;
      peraPadalaAccount.isProcessing = true;
      reset(peraPadalaAccount);
      if (this.entryMode == 'Add') {
        this.addPeraPadalaAccount(fields)
          .then(({ data }) => {
            this.addRow(
              peraPadalaAccounts,
              this.paginations.peraPadalaAccount,
              data
            );
            peraPadalaAccount.isProcessing = false;
            showNotification(
              this,
              'success',
              'Pera Padala created successfully.'
            );
            this.showModalEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            peraPadalaAccount.isProcessing = false;
            validate(peraPadalaAccount, errors);
          });
      } else {
        const { fields } = this.forms.peraPadalaAccount;
        this.updatePeraPadalaAccount(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(peraPadalaAccounts, data);
            peraPadalaAccount.isProcessing = false;
            showNotification(
              this,
              'success',
              'Pera Padala updated successfully.'
            );
            this.showModalEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            peraPadalaAccount.isProcessing = false;
            validate(peraPadalaAccount, errors);
          });
      }
    },
    onPeraPadalaAccountDelete() {
      const {
        peraPadalaAccount,
        peraPadalaAccount: {
          fields: { id },
        },
      } = this.forms;
      const { peraPadalaAccounts } = this.tables;
      peraPadalaAccount.isProcessing = true;
      this.deletePeraPadalaAccount(id).then(({ data }) => {
        this.deleteRow(
          peraPadalaAccounts,
          this.paginations.peraPadalaAccount,
          id
        );
        peraPadalaAccount.isProcessing = false;
        showNotification(this, 'success', 'Pera Padala  deleted successfully.');
        this.showModalConfirmation = false;
      });
    },
    setUpdate(item) {
      this.showModalEntry = true;
      const {
        peraPadalaAccount,
        peraPadalaAccount: { fields },
      } = this.forms;
      peraPadalaAccount.isLoading = true;
      copyValue(item, fields);
      reset(peraPadalaAccount);
      this.entryMode = 'Edit';
      peraPadalaAccount.isLoading = false;
    },
    setCreate() {
      this.showModalEntry = true;
      const { peraPadalaAccount } = this.forms;
      peraPadalaAccount.isLoading = true;
      reset(peraPadalaAccount);
      clearFields(peraPadalaAccount.fields);
      this.entryMode = 'Add';
      peraPadalaAccount.isLoading = false;
    },
  },
};
</script>
