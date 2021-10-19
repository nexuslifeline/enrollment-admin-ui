<template>
  <div class="grade-list__container">
    <div class="list__overlay"  v-if="isLoading" >
      <BSpinner />
    </div>
    <template v-for="(academicRecord, idx) in academicRecords">
       <div :key="idx" class="grade-list__row">
        <div class="grade-list__cell grade-list__cell-name">
          <AvatarMaker
            :avatarId="2"
            :size="25"
            :text="getStudentInitial(academicRecord.student)"
            :borderSize="3"
            class="mr-2"
            :src="getStudentPhoto(academicRecord.student)"
          />
          <span>
            {{ academicRecord.student && academicRecord.student.name || ''}}
          </span>
          <button @click.stop="onDropdownSelect(idx)" class="grade-list__dropdown">
            <BIconThreeDotsVertical  />
            <ul v-if="visibleDropdown.includes(idx)" class="grade-list__menu">
              <li @click="setDropStudent(academicRecord)" class="grade-list__menu-item">Mark as Dropped</li>
              <li @click="onEditGrade(academicRecord)" class="grade-list__menu-item">Edit Grade</li>
            </ul>
          </button>
        </div>
        <div class="grade-list__cell grade-list__cell-grade">
          {{ getCurrentGrade(academicRecord) }}
        </div>
        <template v-if="busyRow.includes(idx)">
          <div class="grade-list__row-overlay">
            <b-spinner type="border" small />
          </div>
        </template>
        <template v-if="checkDropStatus(academicRecord)"> <!-- change to method that returns dropped(true/false) see reference in Grade Sheet-->
          <div class="grade-list__row-overlay">
            <span class="text-danger">
              Dropped
            </span>
          </div>
        </template>
      </div>
    </template>
    <button v-if="hasMore && !isLoading" @click="onShowMore" class="grade-list__more">
      Show more
    </button>
    <ConfirmationModal
      :isShown.sync="isShowDropStudent"
      @onCancel="isShowDropStudent=false"
      title="Drop Student"
      @onYes="onMarkDropped"
      :isConfirmBusy="isProcessing">
      <template #modal-body>
        Are you sure you want to dropped student {{ selectedAcademicRecordStudentName }} ?
      </template>
    </ConfirmationModal>
  </div>
</template>
<script>
import { AcademicRecordApi, StudentGradeApi } from '../../../mixins/api';
import { getFilePath } from '../../../helpers/utils'
import debounce from 'lodash/debounce'
import ConfirmationModal from '../../components/ConfirmationModal'
export default {
  getFilePath,
  components: { ConfirmationModal },
  props: {
    sectionId: {
      type: [String, Number]
    },
    subjectId: {
      type: [String, Number]
    }
  },
  mixins: [AcademicRecordApi, StudentGradeApi],
  data() {
    return {
      visibleDropdown: [],
      busyRow: [],
      academicRecords: [],
      nextPage: 1,
      perPage: 15,
      hasMore: true,
      isLoading: true,
      isShowDropStudent: false,
      selectedAcademicRecord: null,
      isProcessing: false
    }
  },
  created() {
    // this.loadMore(true)
  },
  mounted() {
    window.addEventListener('click', this.hideDropdown);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.hideDropdown);
  },
  methods: {
    loadMore: debounce(function (reset) {
      const { sectionId, subjectId, perPage, nextPage } = this
      const params = { paginate: true, perPage, page: nextPage }

      if(!this.sectionId && !this.subjectId) {
        this.academicRecords = []
        return
      }

      if(!this.hasMore) {
        return
      }

      this.isLoading = true
      this.getAcademicRecordsOfSubjectOfSection(sectionId, subjectId, params).then(({ data }) => {
        if(reset) {
          this.academicRecords = []
        }

        this.academicRecords.push(...data.data)
        this.hasMore = data.meta.currentPage !== data.meta.lastPage
        this.nextPage += 1
        this.isLoading = false
      }).catch((error) => {
        const errors = error.response.data.errors
        console.log(errors)
        this.isLoading = false
      });
    },250),
    onMarkDropped() {
      const { id:academicRecordId } = this.selectedAcademicRecord
      const payload = {
        isDropped: 1
      }
      this.isProcessing = true
      const index = this.academicRecords.find(ar => ar.id === academicRecordId)
      this.busyRow.push(index)
      this.updateAcademicRecordSubject(academicRecordId, this.subjectId, payload).then(({ data }) => {
        const subject = this.selectedAcademicRecord.subjects.find( ({ pivot: v }) => v.subjectId === this.subjectId && v.sectionId === this.sectionId)
        // console.log(subject)
        subject.pivot.isDropped = 1
        this.isProcessing = false
        this.isShowDropStudent = false
        this.busyRow = []
      }).catch((error) => {
        const errors = error.response.data.errors
        validate(null, errors, this)
        this.isProcessing = false
        this.isShowDropStudent = false
        this.busyRow = []
      });
    },
    onEditGrade() {
      // no ui yet, just skip for the meantime
    },
    onDropdownSelect(idx) {
      if (this.visibleDropdown.includes(idx)) {
        this.visibleDropdown = [];
      } else {
        this.visibleDropdown = [idx];
      }
    },
    hideDropdown() {
      this.visibleDropdown = [];
    },
    onShowMore() {
      this.loadMore(false)
    },
    getStudentInitial(data) {
      const { firstName, lastName } = data
      return `${firstName && firstName.charAt(0) || ''}${lastName && lastName.charAt(0) || ''}`
    },
    getStudentPhoto(data) {
      const { photo } = data
      if(!photo) {
        return ''
      }

      return this.$options.getFilePath(photo.hashName)
    },
    checkDropStatus(academicRecord) {
      return academicRecord?.subjects?.some(
        ({ pivot: v }) => v.sectionId === this.sectionId && v.subjectId === this.subjectId && v.isDropped
      );
    },
    setDropStudent(academicRecord) {
      this.isShowDropStudent = true
      this.selectedAcademicRecord = academicRecord
    },
    getCurrentGrade(academicRecord) {
      const { grades } = academicRecord
      if(!grades.length > 0) {
        return 'N/A'
      }
      const current = grades.reduce((prev, current) => {
        if(!prev) {
          return current
        }
        return current.pivot.gradingPeriodId > prev.pivot.gradingPeriodId ? current : prev
      }, null)

      return current.pivot.grade
    }
  },
  computed: {
    selectedAcademicRecordStudentName() {
      return this.selectedAcademicRecord?.student?.name || ''
    }
  },
  watch: {
    sectionId: {
      // immediate: true,
      handler() {
        this.hasMore = true
        this.loadMore(true);
      }
    },
    subjectId: {
      // immediate: true,
      handler() {
        this.hasMore = true
        this.loadMore(true);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/_shared.scss';

  .grade-list__container {
    width: 100%;
    border: 1px solid $light-gray-10;
    border-radius: 3px;
    position: relative;
    min-height: 100px;

    .grade-list__row:last-child {
      border-bottom: 0;
    }
  }

  .list__overlay {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0.7;
    background-color: whitesmoke;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .grade-list__row {
    display: flex;
    width: 100%;
    border-bottom: 1px solid $light-gray-10;
    position: relative;
  }

  .grade-list__cell {
    padding: 7px 10px;
  }

  .grade-list__cell-name {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
  }

  .grade-list__cell-grade {
    width: 60px;
    text-align: center;
    border-left: 1px solid $light-gray-10;
  }

  .grade-list__more {
    border: 0;
    background: none;
    outline: none;
    padding: 7px 10px;
    text-align: center;
    color: $blue;
    width: 100%;

    &:hover {
      background-color: $light-blue-10;
    }
  }

  .grade-list__dropdown {
    margin: 0;
    margin-left: auto;
    padding: 0;
    background: none;
    outline: none;
    border: 0;
    position: relative;
  }

  .grade-list__menu {
    position: absolute;
    min-width: 140px;
    border-radius: 4px;
    border: 1px solid $light-gray-10;
    background-color: $white;
    top: 8px;
    right: 12px;
    list-style: none;
    padding: 3px 0;
    z-index: 2;
  }

  .grade-list__menu-item {
    margin-left: 0;
    text-align: left;
    padding: 5px 10px;
    border-bottom: 1px solid $light-gray-100;

    &:hover {
      background-color: $light-gray-100;
    }

    &:last-child {
      border-bottom: 0;
    }
  }

  .grade-list__row-overlay {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    height: 100%;
    background-color: $white;
    opacity: .8;
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>