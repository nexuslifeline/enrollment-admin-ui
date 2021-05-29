<template>
  <div>
    <b-list-group>
      <b-list-group-item v-for="(level, idx) in levels" :key="idx">
        <div v-b-toggle="`level_${idx}`">
          <vText fontSize="16" weight="bold">
            {{ level.name }}
          </vText>
        </div>
        <b-collapse
          :id="`level_${idx}`"
          class="mt-2"
          :visible="idx === 0">
          <div class="transcript__collapse-content">
            <template v-if="!courseId">
              <SubjectsTable
                :subjects.sync="subjects"
                :levelId="level.id"
                @onSave="onSave"
                :isProcessing="isProcessing"
              />
            </template>
            <template v-else>
              <b-tabs content-class="mt-3">
                <template v-for="(sem, semIdx) in semesters" >
                  <b-tab :key="semIdx" :title="sem.name" :active="semIdx === 0">
                    <SubjectsTable
                      :subjects.sync="subjects"
                      :semesterId="sem.id"
                      :levelId="level.id"
                      @onSave="onSave"
                      :isProcessing="isProcessing"
                    />
                  </b-tab>
                </template>
              </b-tabs>
            </template>
          </div>
        </b-collapse>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script>
import SubjectsTable from './SubjectsTable';
import { TranscriptRecordApi } from '../../../mixins/api';
import { Semesters } from '../../../helpers/enum'
import { showNotification } from '../../../helpers/forms';

export default {
  Semesters,
  components: {
    SubjectsTable
  },
  mixins: [ TranscriptRecordApi ],
  props: {
    transcriptId: {
      type: [Number, String]
    }
  },
  data() {
    return {
      levels: [],
      semesters: Semesters.values.slice(0, 2),
      subjects: [],
      courseId: 0,
      isProcessing: false
    }
  },
  created() {
    Promise.all([
      this.getTranscriptRecordLevels(this.transcriptId, { paginate: false }),
      this.getTranscriptRecord(this.transcriptId)
    ]).then(([{ data }, { data: transcript }]) => {
      this.levels = data;
      this.courseId = transcript?.curriculum?.courseId;
      this.subjects = transcript.subjects.map(({
        code,
        name,
        description,
        prerequisites,
        totalUnits,
        pivot
      }) => ({
        code,
        name,
        description,
        prerequisites,
        totalUnits,
        ...pivot
      }));
      // console.log(this.subjects)
    }).catch((error) => {
      console.log(error)
    });
  },
  methods: {
    onSave(data) {
      this.isProcessing = true
      this.saveTranscriptRecordSubjects(this.transcriptId, data).then(({ data }) => {
        showNotification(this, 'success', 'Subjects has been updated.')
        this.isProcessing = false
      }).catch(error => {
        console.log(error)
        this.isProcessing = false
      })
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';

.transcript__collapse-content {
  border-top: 1px solid $brand-border-color;
  padding-top: 30px;
  min-height: 300px;
}
</style>
