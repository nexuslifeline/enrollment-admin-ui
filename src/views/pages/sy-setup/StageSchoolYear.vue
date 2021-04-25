<template>
  <div>
    <Card title="School Year" titleSize="m" :hasFooter="true">
      <InputGroup>
        <InputContainer>
          <b-form-group>
            <label class="required">Name</label>
            <b-form-input type="text" />
          </b-form-group>
        </InputContainer>
        <InputContainer>
          <b-form-group>
            <label class="required">Start Date(or Expected)</label>
            <b-form-input type="date" />
          </b-form-group>
        </InputContainer>
      </InputGroup>
      <b-form-group>
        <label class="required">Description</label>
        <b-form-textarea />
      </b-form-group>
      <template v-slot:footer>
        <div class="card-footer__action">
          <b-button variant="primary" @click="onSaveChanges">
            Save Changes
          </b-button>
        </div>
      </template>
    </Card>

    <SchoolCategoryForm />

    <ActionRow
      :showBack="false"
      nextLabel="Continue"
      @onContinue="onContinue"
      @onBack="onBack"
    />
  </div>
</template>

<script>
import Card from '../../components/Card';
import { InputGroup, InputContainer } from '../../components/InputGroup';
import ActionRow from './ActionRow';
import SchoolCategoryForm from './SchoolCategoryForm';

export default {
  components: {
    Card,
    InputGroup,
    InputContainer,
    ActionRow,
    SchoolCategoryForm
  },
  data() {
    return {

    };
  },
  methods: {
    onContinue() {
      alert('this button will enable only if all school year requireds fields are provided')
      // patch school year stage here
      alert('patch school year stage here!')
      // after saving
      const nextStage = 1;
      this.$emit('onContinue', nextStage);
    },
    onBack() {

    },
    onSaveChanges() {
      alert('update(PUT) school year here. Note: changes in School Year fields should be auto-save. throttle it for atleast 1 second.')
    }
  }
}
</script>
<style lang="scss">
  @import "../../../assets/scss/shared.scss";

  .setup__table-category {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    border: 1px solid $light-gray-10;
    background-color: $white;

    th {
      text-transform: uppercase;
      font-size: 13px;
      background-color: $light-gray-50;
    }

    td {
      font-size: 15px;
    }

    td, th {
      padding: 13px 20px;
      border-bottom: 1px solid $light-gray-10;

      &:last-child {
        text-align: center;
      }
    }
  }

  .card-footer__action {
    display: flex;
    justify-content: flex-end;
  }
</style>
