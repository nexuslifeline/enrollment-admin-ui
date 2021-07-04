<template>
  <PageContent
    title="E-Wallet Account Management"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadEWalletAccounts"
    :filterVisible="isFilterVisible"
    @create="setCreate()"
    :createButtonVisible="isAccessible($options.EWalletAccountPermissions.ADD.id)">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.eWalletAccount.criteria"
        debounce="500"
        type="text"
        placeholder="Search"
      />
    </template>
    <template v-slot:content>
      <div>
        <!-- <b-row class="mb-3">
          <b-col md="12">
            <b-row>
              <b-col md="8">
                <b-button variant="primary" @click="setCreate()">
                  <v-icon name="plus-circle" /> ADD NEW E-WALLET ACCOUNT
                </b-button>
              </b-col>
              <b-col md="4">
                <b-form-input
                  v-model="filters.eWalletAccount.criteria"
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
              :fields="tables.eWalletAccounts.fields"
              :busy="tables.eWalletAccounts.isBusy"
              :items="tables.eWalletAccounts.items"
              :current-page="paginations.eWalletAccount.page"
              :per-page="paginations.eWalletAccount.perPage"
              :filter="filters.eWalletAccount.criteria"
              @filtered="onFiltered($event, paginations.eWalletAccount)"
            >
              <!-- :filter="filters.eWalletAccount.criteria> -->
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <v-icon name="spinner" spin class="mr-2" />
                  <strong>Loading...</strong>
                </div>
              </template>
              <template v-slot:cell(provider)="{ item, value }">
                <b-link @click="setUpdate(item)" :disabled="!isAccessible($options.EWalletAccountPermissions.EDIT.id)">{{ value }} </b-link>
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
                    v-if="
                      isAccessible(
                        $options.EWalletAccountPermissions.EDIT.id
                      )
                    "
                    @click="setUpdate(row.item)"
                    :disabled="showModalEntry"
                  >
                    Edit
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="
                      isAccessible(
                        $options.EWalletAccountPermissions.DELETE.id
                      )
                    "
                    @click="
                      (forms.eWalletAccount.fields.id = row.item.id),
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
                Showing {{ paginations.eWalletAccount.from }} to
                {{ paginations.eWalletAccount.to }} of
                {{ paginations.eWalletAccount.totalRows }} records.
              </b-col>
              <b-col md="6">
                <b-pagination
                  class="c-pagination"
                  v-model="paginations.eWalletAccount.page"
                  :total-rows="paginations.eWalletAccount.totalRows"
                  :per-page="paginations.eWalletAccount.perPage"
                  size="sm"
                  align="end"
                  @input="paginate(paginations.eWalletAccount)"
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
          E-Wallet Account- {{ entryMode }}
        </div>
        <!-- modal title -->
        <!-- modal body -->
        <b-overlay :show="forms.eWalletAccount.isLoading" rounded="sm">
          <b-row>
            <b-col md="12">
              <b-form-group>
                <label class="required">Provider</label>
                <b-form-input
                  ref="name"
                  v-model="forms.eWalletAccount.fields.provider"
                  :state="forms.eWalletAccount.states.provider"
                />
                <b-form-invalid-feedback>
                  {{ forms.eWalletAccount.errors.provider }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12">
              <b-form-group>
                <label class="required">Account Name</label>
                <b-form-input
                  v-model="forms.eWalletAccount.fields.accountName"
                  :state="forms.eWalletAccount.states.accountName"
                />
                <b-form-invalid-feedback>
                  {{ forms.eWalletAccount.errors.accountName }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12">
              <b-form-group>
                <label class="required">Account Id</label>
                <b-form-input
                  v-model="forms.eWalletAccount.fields.accountId"
                  :state="forms.eWalletAccount.states.accountId"
                />
                <b-form-invalid-feedback>
                  {{ forms.eWalletAccount.errors.accountId }}
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
            :disabled="forms.eWalletAccount.isProcessing"
            variant="outline-primary"
            class="float-right btn-save"
            @click="onEWalletAccountEntry()"
          >
            <v-icon
              v-if="forms.eWalletAccount.isProcessing"
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
          Delete E-Wallet Account
        </div>
        Are you sure you want to delete this E-Wallet Account?
        <div slot="modal-footer">
          <b-button
            :disabled="forms.eWalletAccount.isProcessing"
            variant="outline-primary"
            class="mr-2 btn-save"
            @click="onEWalletAccountDelete()"
          >
            <v-icon
              v-if="forms.eWalletAccount.isProcessing"
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
const eWalletAccountFields = {
  id: null,
  provider: null,
  accountName: null,
  accountId: null,
};

import { EWalletAccountApi } from '../../mixins/api';
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
import { EWalletAccountPermissions } from '../../helpers/enum'
import Access from '../../mixins/utils/Access';

export default {
  name: 'eWalletAccount',
  mixins: [ EWalletAccountApi, Tables, Access ],
  EWalletAccountPermissions,
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
        eWalletAccount: {
          isProcessing: false,
          isLoading: false,
          fields: { ...eWalletAccountFields },
          states: { ...eWalletAccountFields },
          errors: { ...eWalletAccountFields },
        },
      },
      tables: {
        eWalletAccounts: {
          isBusy: false,
          fields: [
            {
              key: 'provider',
              label: 'Provider',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
            },
            {
              key: 'accountName',
              label: 'Account Name',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
            },
            {
              key: 'accountId',
              label: 'Account Id',
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
        eWalletAccount: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        eWalletAccount: {
          criteria: null,
        },
      },
    };
  },
  created() {
    this.loadEWalletAccounts();
  },
  methods: {
    loadEWalletAccounts() {
      const { eWalletAccounts } = this.tables;
      const { eWalletAccount } = this.paginations;
      eWalletAccounts.isBusy = true;

      let params = { paginate: false };
      this.getEWalletAccountList(params).then(({ data }) => {
        eWalletAccounts.items = data;
        eWalletAccount.totalRows = data.length;
        this.paginate(eWalletAccount);
        eWalletAccounts.isBusy = false;
      });
    },
    onEWalletAccountEntry() {
      const {
        eWalletAccount,
        eWalletAccount: { fields },
      } = this.forms;
      const { eWalletAccounts } = this.tables;
      eWalletAccount.isProcessing = true;
      reset(eWalletAccount);
      if (this.entryMode == 'Add') {
        this.addEWalletAccount(fields)
          .then(({ data }) => {
            this.addRow(eWalletAccounts, this.paginations.eWalletAccount, data);
            eWalletAccount.isProcessing = false;
            showNotification(
              this,
              'success',
              'E-Wallet Account created successfully.'
            );
            this.showModalEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            eWalletAccount.isProcessing = false;
            validate(eWalletAccount, errors);
          });
      } else {
        const { fields } = this.forms.eWalletAccount;
        this.updateEWalletAccount(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(eWalletAccounts, data);
            eWalletAccount.isProcessing = false;
            showNotification(
              this,
              'success',
              'E-Wallet Account updated successfully.'
            );
            this.showModalEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            eWalletAccount.isProcessing = false;
            validate(eWalletAccount, errors);
          });
      }
    },
    onEWalletAccountDelete() {
      const {
        eWalletAccount,
        eWalletAccount: {
          fields: { id },
        },
      } = this.forms;
      const { eWalletAccounts } = this.tables;
      eWalletAccount.isProcessing = true;
      this.deleteEWalletAccount(id).then(({ data }) => {
        this.deleteRow(eWalletAccounts, this.paginations.eWalletAccount, id);
        eWalletAccount.isProcessing = false;
        showNotification(
          this,
          'success',
          'E-Wallet Account deleted successfully.'
        );
        this.showModalConfirmation = false;
      });
    },
    setUpdate(item) {
      this.showModalEntry = true;
      const {
        eWalletAccount,
        eWalletAccount: { fields },
      } = this.forms;
      eWalletAccount.isLoading = true;
      copyValue(item, fields);
      reset(eWalletAccount);
      this.entryMode = 'Edit';
      eWalletAccount.isLoading = false;
    },
    setCreate() {
      this.showModalEntry = true;
      const { eWalletAccount } = this.forms;
      eWalletAccount.isLoading = true;
      reset(eWalletAccount);
      clearFields(eWalletAccount.fields);
      this.entryMode = 'Add';
      eWalletAccount.isLoading = false;
    },
  },
};
</script>
