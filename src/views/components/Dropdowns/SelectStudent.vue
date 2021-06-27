<template>
  <SelectPaginated
    class="select-paginated"
    :value="value"
    @input="(v) => $emit('input', v)"
    :reduce="reduce"
    :fetchData="getStudentList">
    <template slot="selected-option" slot-scope="data">
      <div class="select-option">
        <div class="select-option__avatar">
          <AvatarMaker
            :text="`${data.firstName.charAt(0)}${data.lastName.charAt(0)}`"
            :avatarId="data.id"
            :size="20"
            :src="getPhoto(data)"
          />
        </div>
        <div class="select-option__info">
          <span class="select-option__name">
            {{ data.name.trim() || 'No Name' }}
            <b-badge v-if="!!data.studentNo" variant="success" class="ml-2"> ID: {{ data.studentNo }}</b-badge>
          </span>
          <span class="select-option__education">
            {{ getEducation(data) }}
          </span>
        </div>
      </div>
    </template>
    <template slot="option" slot-scope="data">
      <div class="select-option">
        <div class="select-option__avatar">
          <AvatarMaker
            :text="`${data.firstName.charAt(0)}${data.lastName.charAt(0)}`"
            :avatarId="data.id"
            :size="40"
            :src="getPhoto(data)"
          />
        </div>
        <div class="select-option__info">
          <span class="select-option__education">
            {{ getEducation(data) }}
          </span>
          <span class="select-option__name">{{ data.name.trim() || 'No Name' }}
            <b-badge v-if="!!data.studentNo" variant="success" class="ml-2">{{ data.studentNo }}</b-badge>
          </span>
          <span class="select-option__email">
            {{ data.email || 'No Email' }}
          </span>
        </div>
      </div>
    </template>
    <template slot="loader">
      <b-spinner label="Loading..." class="loader"></b-spinner>
    </template>
  </SelectPaginated>
</template>
<script>
import { StudentTypes } from '../../../helpers/enum';
import { StudentApi } from '../../../mixins/api';

export default {
  mixins: [StudentApi],
  props: {
    options: {
      type: [Array]
    },
    value: {
      type: [Object, Number]
    },
    label: {
      type: [String]
    },
    placeholder: {
      type: [String]
    },
    searchable: {
      type: [Boolean],
      default: true
    },
    selectable: {
      type: [Function],
      default: option => true
    },
    clearable: {
      type: [Boolean],
      default: true
    },
    reduce: {
      type: [Function],
      default: option => option,
    },
    appendToBody: {
      type: [Boolean],
      default: false
    },
    disabled: {
      type: [Boolean],
      default: false
    },
  },
  data() {
    return {
      StudentTypes: StudentTypes?.values || []
    }
  },
  methods: {
    getPhoto(data) {
      const photo = data?.photo?.hashName || '';
      return !!photo ? `${process.env.VUE_APP_PUBLIC_PHOTO_URL}${photo}` : '';
    },
    getEducation(data) {
      return [
        data?.latestAcademicRecord?.course?.name,
        data?.latestAcademicRecord?.level?.name,
        data?.latestAcademicRecord?.semester?.name,
        data?.latestAcademicRecord?.schoolYear?.name,
      ].filter(v => !!v).join(' - ');
    }
  }
};
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/shared.scss';

  .select-paginated {
    width: 100%;
  }

  .select-option {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
  }

  .select-option__info {
    position: relative;
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    flex: 1;
  }

  .select-option__number {
    position: absolute;
    right: 0;
    font-weight: 500;
  }

  .select-option__education {
    position: absolute;
    right: 0;
    color: $gray;
  }

  .select-option__email {
    color: $gray;
  }

  .select-option__name {
    font-weight: 500;
    font-size: 15px;
  }
</style>
<style>
  .vs__selected-options {
    position: relative;
  }
  .vs__selected {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
  }

</style>

