<template>
  <CenterContainer>
    <BackLink :previousRoute="{ name: 'Soa' }" />
    <Card title="Generate Batch Statement of Account" titleSize="m" :hasFooter="true">
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label class="required">School Category</label>
            <SelectCategory
              v-model="forms.billing.fields.schoolCategory"
            />
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <InputGroup>
         <InputContainer v-if="!isSelectedAll && schoolCategoryId">
          <b-form-group>
            <label class="required">Enrolled in Level</label>
            <SelectLevel
              :schoolCategoryId="schoolCategoryId"
              v-model="forms.billing.fields.level"
              label="name"
            />
          </b-form-group>
        </InputContainer>
        <InputContainer v-if="schoolCategoryId && hasSemester && levelId">
          <b-form-group>
            <label class="required">Enrolled in Semester</label>
            <SelectSemester
              :schoolCategoryId="schoolCategoryId"
              v-model="forms.billing.fields.semester"
              label="description"
            />
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <InputGroup v-if="schoolCategoryId">
        <InputInline class="mb-3">
          <Toggle v-model="isSelectedAll" />
          <span class="ml-2">Generate Statement of Account to all levels
            {{ ` in ` }}
            <b v-if="forms.billing.fields.schoolCategory">
              {{ forms.billing.fields.schoolCategory.name }}
            </b>
            <span v-else>Current School Category</span>
          </span>
        </InputInline>
      </InputGroup>
      <InputGroup>
        <InputContainer v-if="schoolCategoryId && ((hasSemester && semesterId) || !hasSemester)">
          <b-form-group>
            <label class="required">
              Billing Term
            </label>
            <SelectCategoryBillingTerms
              :schoolCategoryId="schoolCategoryId"
              :schoolYearId="activeSchoolYearId"
              v-model="forms.billing.fields.term"
            />
            <b-form-invalid-feedback>
              {{ forms.billing.errors.termId }}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
        <InputContainer>
           <b-form-group>
            <label class="required">Due Date</label>
            <b-form-datepicker
              :state="forms.billing.states.dueDate"
              v-model="forms.billing.fields.dueDate"
            />
            <b-form-invalid-feedback>
              {{ forms.billing.errors.dueDate }}
            </b-form-invalid-feedback>
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <LinkVisibilityToggler
        linkText="Add Other Fees"
        hideLinkText="Hide Other Fees"
        :hideOnContentShow="false">
        <template>
          <CardNote class="mt-2">
            Typically, what is included in the Statement of Account are those fees in the Billing Schedule of the Student.
            If you want to include <b>Other Fees</b> in the Statement of Account you can add it here.
          </CardNote>
          <OtherFeesTable :items.sync="tables.otherFees.items" />
        </template>
      </LinkVisibilityToggler>

      <template v-slot:footer>
        <CardFooterRow>
          <b-button variant="primary" @click="onGenerate" :disabled="isProcessing || !termId">
            <v-icon name="spinner" spin v-if="isProcessing"/> Generate
          </b-button>
        </CardFooterRow>
      </template>
    </Card>
  </CenterContainer>
</template>
<script>
  import { SchoolYearApi } from '../../../mixins/api';
  import { reset, validate } from '../../../helpers/forms';
  import { BillingTypes } from '../../../helpers/enum';
  import OtherFeesTable from '../../components/Billing/OtherFeesTable';
  export default {
    mixins: [SchoolYearApi],
    components: {
      OtherFeesTable
    },
    data() {
     return  {
      isSelectedAll: false,
      isProcessing: false,
      tables: {
        otherFees: {
          items: []
        }
      },
      forms: {
        billing: {
          fields: {
            schoolCategory: null,
            term: null,
            dueDate: null,
            amount: null,
            previousBalance: null,
            semester: null
          },
          states: {
            dueDate: null,
            studentId: null,
            termId: null,
            amount: null
          },
          errors: {
            dueDate: null,
            studentId: null,
            termId: null,
            amount: null
          }
        }
      }
     }
    },
    methods: {
      onGenerate() {
        const {
          term,
          dueDate
        } = this.forms.billing.fields;

        if (!this.activeSchoolYearId) {
          console.warn('No active school year found!');
          return;
        }

        if (!this.termId) {
          console.warn('No latest term id found!');
          return;
        }

        const otherFees = this.tables?.otherFees?.items || [];

        const payload = {
          dueDate,
          termId: this.termId,
          otherFees,
          billingTypeId: BillingTypes.SOA.id,
          ...(!this.isSelectedAll && { levelId: this.levelId }) // include level id in the payload if switch toggle is not selected
        };

        reset(this.forms.billing);
        this.isProcessing = true;
        this.generateBatchBilling(payload, this.activeSchoolYearId).then(({ data }) => {
          this.isProcessing = false;
          this.$router.push({ name: 'Soa' });
        }).catch((error) => {
          const errors = error.response.data.errors;
          validate(this.forms.billing, errors);
          this.isProcessing = false;
        })
      },
      onBillingTermChange(v) {
        this.forms.billing.fields.amount = v?.pivot?.amount || 0;
        this.forms.billing.fields.previousBalance = v?.previousBalance || 0;
      }
    },
    computed: {
      schoolCategoryId() {
        return this.forms?.billing?.fields?.schoolCategory?.id;
      },
      hasSemester() {
        return this.forms?.billing?.fields?.schoolCategory?.hasSemester;
      },
      activeSchoolYearId() {
        return this.$store.state?.schoolYear?.id;
      },
      termId() {
        return this.forms?.billing?.fields?.term?.id;
      },
      levelId() {
        return this.forms?.billing?.fields?.level?.id;
      },
      semesterId() {
        return this.forms?.billing?.fields?.semester?.id;
      }
    }
  }
</script>