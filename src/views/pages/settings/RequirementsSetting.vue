<template>
  <CenterContainer>
    <Requirements />
  </CenterContainer>
</template>

<script>
import PageContent from '../../components/PageContainer/PageContent'
import { SchoolCategories } from '../../../helpers/enum';
import { RequirementApi, SchoolYearApi } from '../../../mixins/api';
import { showNotification } from '../../../helpers/forms';
import Access from '../../../mixins/utils/Access';
import Requirements from '../../components/RequirementSettings/List';

export default {
  components: {
    PageContent,
    Requirements
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
