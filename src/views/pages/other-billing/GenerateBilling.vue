<template>
  <CenterContainer>
    <BackLink :previousRoute="{ name: 'Other Billing' }" />
    <Card :title="`${entryMode === 'Add' ? 'Generate' : 'Edit' } Billing (Other)`" titleSize="m" :hasFooter="true">
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

      <OtherFeesTable :items.sync="tables.otherFees.items" />

      <template v-slot:footer>
        <CardFooterRow>
          <b-button variant="primary" @click="entryMode === 'Add' ? onGenerate() : onUpdate()" :disabled="isProcessing || !hasSelectedAcademicId">
            <v-icon name="spinner" spin v-if="isProcessing"/>
            {{ entryMode === 'Add' ? 'Generate' : 'Update' }}
          </b-button>
        </CardFooterRow>
      </template>
    </Card>
  </CenterContainer>
</template>
<script>
  import { AcademicRecordApi, BillingApi } from '../../../mixins/api';
  import { reset, validate } from '../../../helpers/forms'
  import { BillingTypes } from '../../../helpers/enum';
  import OtherFeesTable from '../../components/Billing/OtherFeesTable';
import { copyValue } from '../../../helpers/extractor';
  export default {
    mixins: [AcademicRecordApi,BillingApi],
    components: {
      OtherFeesTable
    },
    data() {
      return  {
        isProcessing: false,
        entryMode: 'Add',
        tables: {
          otherFees: {
            items: []
          }
        },
        forms: {
          billing: {
            fields: {
              student: null,
              dueDate: null,
            },
            states: {
              dueDate: null,
              studentId: null,
            },
            errors: {
              dueDate: null,
              studentId: null,
            }
          }
        }
      }
    },
    created() {
      if(this.billingId) {
        //get billing
        // alert('get billing')
        this.entryMode = 'Edit'
        const { billing } = this.forms
        const { otherFees } = this.tables
        this.getBilling(this.billingId).then(({ data }) => {
          // console.log(data)
          copyValue(data, billing.fields)
          otherFees.items = data.billingItems
        })
      }
    },
    methods: {
      onGenerate() {
        const { student: { latestAcademicRecord }, dueDate } = this.forms.billing.fields;

        if (!latestAcademicRecord || !latestAcademicRecord?.id) {
          console.warn('No latest academic record found on student!');
          return;
        }

        const otherFees = this.tables?.otherFees?.items || [];

        const payload = {
          dueDate,
          otherFees,
          billingTypeId: BillingTypes.BILLING.id
        };

        reset(this.forms.billing);
        this.isProcessing = true;
        this.generateBilling(latestAcademicRecord?.id, payload).then(({ data }) => {
          this.isProcessing = false;
          this.$router.push({ name: 'Other Billing' });
        }).catch((error) => {
          const errors = error.response.data.errors;
          validate(this.forms.billing, errors, this);
          this.isProcessing = false;
        })
      },
      onUpdate() {
        const { student: { latestAcademicRecord }, dueDate } = this.forms.billing.fields;

        if (!latestAcademicRecord || !latestAcademicRecord?.id) {
          console.warn('No latest academic record found on student!');
          return;
        }

        const otherFees = this.tables?.otherFees?.items || [];

        const payload = {
          dueDate,
          otherFees,
          billingTypeId: BillingTypes.BILLING.id
        };

        reset(this.forms.billing);
        this.isProcessing = true;
        this.updateBilling(payload, this.billingId).then(({ data }) => {
          this.isProcessing = false;
          this.$router.push({ name: 'Other Billing' });
        }).catch((error) => {
          const errors = error.response.data.errors;
          validate(this.forms.billing, errors, this);
          this.isProcessing = false;
        })
      }
    },
    computed: {
      hasSelectedAcademicId() {
        return !!this.forms?.billing?.fields?.student?.latestAcademicRecord?.id;
      },
      billingId() {
        return this.$route?.params?.billingId || null
      }
    }
  }
</script>