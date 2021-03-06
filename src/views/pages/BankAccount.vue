<template>
  <PageContent
    title="Bank Account Management"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadBankAccounts"
    :filterVisible="isFilterVisible"
    @create="setCreate()"
    :createButtonVisible="isAccessible($options.BankAccountPermissions.ADD.id)">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.bankAccount.criteria"
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
    <template v-slot:content>
      <!-- <div>
        <b-row class="mb-3">
          <b-col md="12">
            <b-row>
              <b-col md="8">
                <b-button variant="primary" @click="setCreate()">
                  <v-icon name="plus-circle" /> ADD NEW BANK ACCOUNT
                </b-button>
              </b-col>
              <b-col md="4">
                <b-form-input
                  v-model="filters.bankAccount.criteria"
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
              small
              hover
              outlined
              show-empty
              :fields="tables.bankAccounts.fields"
              :busy="tables.bankAccounts.isBusy"
              :items="tables.bankAccounts.items"
              :current-page="paginations.bankAccount.page"
              :per-page="paginations.bankAccount.perPage"
              :filter="filters.bankAccount.criteria"
              @filtered="onFiltered($event, paginations.bankAccount)"
            >
              <!-- :filter="filters.bankAccount.criteria> -->
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <v-icon name="spinner" spin class="mr-2" />
                  <strong>Loading...</strong>
                </div>
              </template>
              <template v-slot:cell(bank)="{ item, value }">
                <b-link @click="setUpdate(item)" :disabled="!isAccessible($options.BankAccountPermissions.EDIT.id)">{{ value }} </b-link>
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
                        $options.BankAccountPermissions.EDIT.id
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
                        $options.BankAccountPermissions.DELETE.id
                      )
                    "
                    @click="
                      (forms.bankAccount.fields.id = row.item.id),
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
                Showing {{ paginations.bankAccount.from }} to
                {{ paginations.bankAccount.to }} of
                {{ paginations.bankAccount.totalRows }} records.
              </b-col>
              <b-col md="6">
                <b-pagination
                  v-model="paginations.bankAccount.page"
                  :total-rows="paginations.bankAccount.totalRows"
                  :per-page="paginations.bankAccount.perPage"
                  size="sm"
                  align="end"
                  @input="recordDetails(paginations.bankAccount)"
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
          Bank Account- {{ entryMode }}
        </div>
        <!-- modal title -->
        <!-- modal body -->
        <b-overlay :show="forms.bankAccount.isLoading" rounded="sm">
          <b-row>
            <b-col md="12">
              <b-form-group>
                <label class="required">Bank</label>
                <b-form-input
                  ref="name"
                  v-model="forms.bankAccount.fields.bank"
                  :state="forms.bankAccount.states.bank"
                />
                <b-form-invalid-feedback>
                  {{ forms.bankAccount.errors.bank }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12">
              <b-form-group>
                <label class="required">Account Name</label>
                <b-form-input
                  v-model="forms.bankAccount.fields.accountName"
                  :state="forms.bankAccount.states.accountName"
                />
                <b-form-invalid-feedback>
                  {{ forms.bankAccount.errors.accountName }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12">
              <b-form-group>
                <label class="required">Account Number</label>
                <b-form-input
                  v-model="forms.bankAccount.fields.accountNumber"
                  :state="forms.bankAccount.states.accountNumber"
                />
                <b-form-invalid-feedback>
                  {{ forms.bankAccount.errors.accountNumber }}
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
            :disabled="forms.bankAccount.isProcessing"
            variant="outline-primary"
            class="float-right btn-save"
            @click="onBankAccountEntry()"
          >
            <v-icon
              v-if="forms.bankAccount.isProcessing"
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
          Delete Bank Account
        </div>
        Are you sure you want to delete this Bank Account?
        <div slot="modal-footer">
          <b-button
            :disabled="forms.bankAccount.isProcessing"
            variant="outline-primary"
            class="mr-2 btn-save"
            @click="onBankAccountDelete()"
          >
            <v-icon
              v-if="forms.bankAccount.isProcessing"
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
const bankAccountFields = {
  id: null,
  bank: null,
  accountName: null,
  accountNumber: null,
};

import { BankAccountApi } from '../../mixins/api';
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
import { BankAccountPermissions } from '../../helpers/enum'
import Access from '../../mixins/utils/Access';


export default {
  name: 'BankAccount',
  mixins: [BankAccountApi, Tables, Access],
  BankAccountPermissions,
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
        bankAccount: {
          isProcessing: false,
          isLoading: false,
          fields: { ...bankAccountFields },
          states: { ...bankAccountFields },
          errors: { ...bankAccountFields },
        },
      },
      tables: {
        bankAccounts: {
          isBusy: false,
          fields: [
            {
              key: 'bank',
              label: 'Bank',
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
              key: 'accountNumber',
              label: 'Account Number',
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
        bankAccount: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        bankAccount: {
          criteria: null,
        },
      },
    };
  },
  created() {
    this.loadBankAccounts();
  },
  methods: {
    loadBankAccounts() {
      const { bankAccounts } = this.tables;
      const { bankAccount } = this.paginations;
      bankAccounts.isBusy = true;

      let params = { paginate: false };
      this.getBankAccountList(params).then(({ data }) => {
        bankAccounts.items = data;
        bankAccount.totalRows = data.length;
        this.recordDetails(bankAccount);
        bankAccounts.isBusy = false;
      });
    },
    onBankAccountEntry() {
      const {
        bankAccount,
        bankAccount: { fields },
      } = this.forms;
      const { bankAccounts } = this.tables;
      bankAccount.isProcessing = true;
      reset(bankAccount);
      if (this.entryMode == 'Add') {
        this.addBankAccount(fields)
          .then(({ data }) => {
            this.addRow(bankAccounts, this.paginations.bankAccount, data);
            bankAccount.isProcessing = false;
            showNotification(
              this,
              'success',
              'Bank Account created successfully.'
            );
            this.showModalEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            bankAccount.isProcessing = false;
            validate(bankAccount, errors);
          });
      } else {
        const { fields } = this.forms.bankAccount;
        this.updateBankAccount(fields, fields.id)
          .then(({ data }) => {
            this.updateRow(bankAccounts, data);
            bankAccount.isProcessing = false;
            showNotification(
              this,
              'success',
              'Bank Account updated successfully.'
            );
            this.showModalEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            bankAccount.isProcessing = false;
            validate(bankAccount, errors);
          });
      }
    },
    onBankAccountDelete() {
      const {
        bankAccount,
        bankAccount: {
          fields: { id },
        },
      } = this.forms;
      const { bankAccounts } = this.tables;
      bankAccount.isProcessing = true;
      this.deleteBankAccount(id).then(({ data }) => {
        this.deleteRow(bankAccounts, this.paginations.bankAccount, id);
        bankAccount.isProcessing = false;
        showNotification(this, 'success', 'Bank Account deleted successfully.');
        this.showModalConfirmation = false;
      });
    },
    setUpdate(item) {
      this.showModalEntry = true;
      const {
        bankAccount,
        bankAccount: { fields },
      } = this.forms;
      bankAccount.isLoading = true;
      copyValue(item, fields);
      reset(bankAccount);
      this.entryMode = 'Edit';
      bankAccount.isLoading = false;
    },
    setCreate() {
      this.showModalEntry = true;
      const { bankAccount } = this.forms;
      bankAccount.isLoading = true;
      reset(bankAccount);
      clearFields(bankAccount.fields);
      this.entryMode = 'Add';
      bankAccount.isLoading = false;
    },
  },
};
</script>
