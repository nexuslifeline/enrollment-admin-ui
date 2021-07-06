<template>
  <CenterContainer>
    <BackLink :previousRoute="{ name: 'Soa' }" />
    <Card title="Generate Statement of Account" titleSize="m" :hasFooter="true">
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label class="required">Student</label>
            <SelectStudent
              v-model="forms.billing.fields.student"
            />
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label class="required">
              Billing Term
            </label>
            <SelectStudentBillingTerms
              v-model="forms.billing.fields.term"
              :studentId="studentId"
              :schoolYearId="activeSchoolYearId"
              @input="onBillingTermChange"
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
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label class="required font-weight-bold">Previous Balance</label>
            <vue-autonumeric
              disabled
              v-model="forms.billing.fields.previousBalance"
              class="form-control text-right font-weight-bold"
              :options="[
                {
                  modifyValueOnWheel: false,
                  emptyInputBehavior: 0,
                },
              ]"
            >
            </vue-autonumeric>
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label class="required font-weight-bold">Amount</label>
            <vue-autonumeric
              disabled
              v-model="forms.billing.fields.amount"
              class="form-control text-right font-weight-bold"
              :options="[
                {
                  modifyValueOnWheel: false,
                  emptyInputBehavior: 0,
                },
              ]"
            >
            </vue-autonumeric>
          </b-form-group>
        </InputContainer>
      </InputGroup>

      <LinkVisibilityToggler
        linkText="Add Other Fees"
        hideLinkText="Hide Other Fees"
        :hideOnContentShow="false">
        <template>
          <OtherFeesTable :items.sync="tables.otherFees.items" />
        </template>
      </LinkVisibilityToggler>

      <template v-slot:footer>
        <CardFooterRow>
          <b-button variant="primary" @click="onGenerate" :disabled="isProcessing || !hasSelectedAcademicId || !termId">
            <v-icon name="spinner" spin v-if="isProcessing"/> Generate
          </b-button>
        </CardFooterRow>
      </template>
    </Card>
  </CenterContainer>
</template>
<script>
  import { AcademicRecordApi } from '../../../mixins/api';
  import { reset, validate } from '../../../helpers/forms'
  import { BillingTypes } from '../../../helpers/enum';
  import OtherFeesTable from '../../components/Billing/OtherFeesTable';
  export default {
    mixins: [AcademicRecordApi],
    components: {
      OtherFeesTable
    },
    data() {
     return  {
      isProcessing: false,
      tables: {
        otherFees: {
          items: []
        }
      },
      forms: {
        billing: {
          fields: {
            student: null,
            term: null,
            dueDate: null,
            amount: null,
            previousBalance: null
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
        const { amount, term, previousBalance, student: { latestAcademicRecord }, dueDate } = this.forms.billing.fields;

        if (!latestAcademicRecord || !latestAcademicRecord?.id) {
          console.warn('No latest academic record found on student!');
          return;
        }

        if (!this.termId) {
          console.warn('No latest term id found!');
          return;
        }

        const otherFees = this.tables?.otherFees?.items || [];

        const payload = {
          amount,
          dueDate,
          termId: this.termId,
          otherFees,
          previousBalance,
          billingTypeId: BillingTypes.SOA.id
        };

        reset(this.forms.billing);
        this.isProcessing = true;
        this.generateBilling(latestAcademicRecord?.id, payload).then(({ data }) => {
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
      studentId() {
        return this.forms?.billing?.fields?.student?.id;
      },
      termId() {
        return this.forms?.billing?.fields?.term?.id;
      },
      activeSchoolYearId() {
        return this.$store.state?.schoolYear?.id;
      },
      hasSelectedAcademicId() {
        return !!this.forms?.billing?.fields?.student?.latestAcademicRecord?.id;
      }
    }
  }
</script>