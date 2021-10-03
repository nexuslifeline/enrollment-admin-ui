<template>
  <PageContent 
    title="Requirements Setting"
    @refresh="loadRequirements()"
    :createButtonVisible="false">
    <template v-slot:filters>
      <v-select
        :options="$options.SchoolCategories.values"
        v-model="filters.requirement.schoolCategoryId"
        @input="loadRequirements()"
        :reduce="(item) => item.id"
        label="name"
        placeholder="School Category"
        class="mt-2"
        :searchable="checkIfAllowedAll() || checkIfSuperUser()"
        :selectable="option =>  checkIfSuperUser() || isAccessibleSchoolCategory(option.id)"
        :clearable="checkIfAllowedAll()"
      />
    </template>
    <template v-slot:content>
      <b-overlay :show="isLoading" rounded="sm">
      <div class="title-container">
        <h4>REQUIREMENTS SETTINGS</h4>
        <p>
          In this settings, you can define all the requirements or documents that the student must accomplish for the entire course, program or class.
        </p>
      </div>
      <div class="tabs-container">
        <!-- <SchoolCategoryTabs
          :showAll="false"
          @loadSchoolCategoryId="
            (filters.requirement.schoolCategoryId = $event), loadRequirements()
          "
          @click="
            (filters.requirement.schoolCategoryId = $event), loadRequirements()
          "
        /> -->
        <div class="table-container">
          <div class="button-container">
            <button
              class="btn btn-primary add-row-button float-right mb-2"
              @click="onAddRequirement()"
            >
              <v-icon name="plus-circle" /> ADD REQUIREMENT
            </button>
          </div>
          <b-table
            small
            hover
            outlined
            show-empty
            :fields="tables.requirements.fields"
            :busy="tables.requirements.isBusy"
            :items="tables.requirements.items"
            :current-page="paginations.requirement.page"
            :per-page="paginations.requirement.perPage"
          >
            <template v-slot:table-busy>
              <div class="text-center my-2">
                <v-icon name="spinner" spin class="mr-2" />
                <strong>Loading...</strong>
              </div>
            </template>
            <template v-slot:cell(name)="data">
              <b-form-input v-model="data.item.name"></b-form-input>
            </template>
            <template v-slot:cell(action)="data">
              <b-button
                variant="dark"
                @click="onDeletingRequirement(data)"
                ><v-icon name="trash"
              /></b-button>
            </template>
          </b-table>
        </div>
        <div class="footer-container">
          <b-button
            variant="primary"
            class="float-right"
            @click="onSaveChanges"
            ><v-icon v-if="isProcessing" name="sync" spin class="mr-2" />SAVE
            CHANGES</b-button
          >
        </div>
      </div>
      </b-overlay>
      <b-modal
        v-model="showModalConfirmation"
        :noCloseOnEsc="true"
        :noCloseOnBackdrop="true"
      >
        <div slot="modal-title">
          Delete Requirement
        </div>
        Are you sure you want to delete this Requirement ?
        <div slot="modal-footer">
          <b-button
            :disabled="isProcessing"
            variant="primary"
            class="mr-2 btn-save"
            @click="onDeleteRequirement()"
          >
            <v-icon v-if="isDeleting" name="sync" spin class="mr-2" />
            Yes
          </b-button>
          <b-button
            variant="dark"
            class=""
            @click="showModalConfirmation = false"
          >
            No
          </b-button>
        </div>
      </b-modal>
    </template>
  </PageContent>
</template>

<script>
import PageContent from '../../components/PageContainer/PageContent'
import { SchoolCategories } from '../../../helpers/enum';
import { RequirementApi, SchoolYearApi } from '../../../mixins/api';
import { showNotification } from '../../../helpers/forms';
import Access from '../../../mixins/utils/Access';

export default {
  components: {
    PageContent
  },
  mixins: [RequirementApi, SchoolYearApi, Access],
  SchoolCategories,
  data() {
    return {
      isLoading: false,
      isProcessing: false,
      showModalConfirmation: false,
      isDeleting: false,
      selectedRow: null,
      tables: {
        requirements: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Name',
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
        requirement: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        requirement: {
          criteria: null,
          schoolCategoryId: null,
        },
      },
    };
  },
  created() {
    this.filters.requirement.schoolCategoryId = this.getDefaultSchoolCategory()?.id
    this.loadRequirements()
  },
  methods: {
    onAddRequirement() {
      const { requirements } = this.tables;
      requirements.items.push({ id: null, name: '' });
    },
    loadRequirements() {
      const { schoolCategoryId } = this.filters.requirement;
      const { requirements } = this.tables;
      requirements.isBusy = true;
      const params = {
        paginate: false,
        schoolCategoryId,
      };
      this.getRequirementList(params)
        .then(({ data }) => {
          requirements.items = data;
          requirements.isBusy = false;
        })
        .catch((error) => {
          requirements.isBusy = false;
        });
    },
    onSaveChanges() {
      const { requirements } = this.tables;
      const { schoolCategoryId } = this.filters.requirement;

      this.isProcessing = true;
      if (this.validateRows()) {
        const data = requirements.items;

        this.updateCreateMultiple(schoolCategoryId, data)
          .then(({ data }) => {
            requirements.items = data;
            showNotification(this, 'success', 'Changes has been saved.');
            this.isProcessing = false;
          })
          .catch((error) => {
            this.isProcessing = false;
          });
      } else {
        showNotification(
          this,
          'danger',
          'Please fill up all rows before saving.'
        );
        this.isProcessing = false;
      }
    },
    validateRows() {
      //check if rows doesn't have empty or null name property
      const { requirements } = this.tables;
      const invalidRow = requirements.items.find(
        (requirement) => requirement.name === ''
      );
      if (invalidRow) {
        return false;
      } else {
        return true;
      }
    },
    onDeletingRequirement(row) {
      const { requirements } = this.tables;
      this.selectedRow = row;
      if (row.item.id) {
        this.showModalConfirmation = true;
      } else {
        requirements.items.splice(row.index, 1);
      }
    },
    onDeleteRequirement() {
      this.isDeleting = true;
      const { requirements } = this.tables;
      this.deleteRequirement(this.selectedRow.item.id)
        .then(({ data }) => {
          requirements.items.splice(this.selectedRow.index, 1);
          this.isDeleting = false;
          this.showModalConfirmation = false;
          showNotification(this, 'success', 'Requirement has been deleted.');
        })
        .catch((error) => {
          this.isDeleting = false;
          this.showModalConfirmation = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/_shared.scss';

.terms_main-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .title-container {
    p {
      margin-bottom: 40px;
    }
  }

  .tabs-container {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
  }
}

.details__semester-button-container {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  @include for-size(phone-only) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.add-row-button {
  width: 200px;

  @include for-size(phone-only) {
    width: 100%;
  }
}

.semester__container {
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 10px;

  label {
    margin-right: 10px;
  }

  .semester-select {
    width: 200px;
  }

  @include for-size(phone-only) {
    flex-direction: column;
    align-items: flex-start;
    margin-right: 0;
    margin-bottom: 10px;
    width: 100%;

    .semester-select {
      width: 100%;
    }
  }
}

.no-active-sy-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
