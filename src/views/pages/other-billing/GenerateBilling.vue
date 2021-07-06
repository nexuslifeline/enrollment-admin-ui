<template>
  <CenterContainer>
    <BackLink :previousRoute="{ name: 'Soa' }" />
    <Card title="Generate Billing (Other)" titleSize="m" :hasFooter="true">
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
          <b-button variant="primary" @click="onGenerate" :disabled="isProcessing || !hasSelectedAcademicId">
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
    },
    computed: {
      hasSelectedAcademicId() {
        return !!this.forms?.billing?.fields?.student?.latestAcademicRecord?.id;
      }
    }
  }
</script>