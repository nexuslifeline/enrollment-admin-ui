<template>
  <div>
    <b-card>
      <h5 slot="header">
        <span>
          Student Evaluation - Update <br>
          <!-- <small></small> -->
        </span>
      </h5>
      <b-card>
        <b-row>
          <b-col md="12">
            <b-row class="mb-2">
              <b-col md=12>
                <span class="font-weight-bold">Student Information</span>
                <hr class="bg-light mt-1 mb-0">
              </b-col>
            </b-row>
            <b-row class="pb-1">
              <b-col md=6>
                Student Number : <span class="font-weight-bold">{{ form.student.studentNo ? form.student.studentNo : 'Awaiting Confirmation' }}</span>
              </b-col>
              <b-col md=6>
                Name : <span class="font-weight-bold">{{ form.student.name }}</span>
              </b-col>
            </b-row>
            <b-row class="pb-1">
              <b-col md=6>
                Student Category : 
                <b-badge
                  :variant="form.studentCategoryId === studentCategories.NEW.id 
                    ? 'success' 
                    : form.studentCategoryId === studentCategories.OLD.id ? 'primary' : 'warning'">
                  {{ form.studentCategory.name }}
                </b-badge>
              </b-col>
              <b-col md=6>
                Contact Number : <span class="font-weight-bold">{{ form.student.mobileNo }}</span>
              </b-col>
            </b-row>
            <b-row class="pb-1">
              <b-col md=6>
                Email : <span class="font-weight-bold">{{ form.student.email }}</span>
              </b-col>
              <b-col md=6>
                Address : 
                <span class="font-weight-bold">
                  {{ form.student.address ? form.student.address.currentCompleteAddress : "" }}
                </span>
              </b-col>
            </b-row>
            <b-row class="my-2 pb-1">
              <b-col md=12>
                <span class="font-weight-bold">Previous Educational Background</span>
                <hr class="bg-light mt-1 mb-0">
              </b-col>
            </b-row>
            <b-row class="pb-1">
              <b-col md=6>
                Last School Attended : <span class="font-weight-bold">{{ form.lastSchoolAttended }}</span>
              </b-col>
              <b-col md=6>
                <!-- Enrolled Year : <span class="font-weight-bold">{{ data.item.enrolledYear }}</span> -->
                Last School Level : <span class="font-weight-bold">{{ form.lastSchoolLevel ? form.lastSchoolLevel.name : 'N/A'}}</span>
              </b-col>
            </b-row>
            <b-row class="pb-1">
              <b-col md=6>
                From : <span class="font-weight-bold"> {{ form.lastSchoolYearFrom }} </span> To : <span  class="font-weight-bold"> {{form.lastSchoolYearTo}}</span>
              </b-col>
            </b-row>
            <b-row class="my-2 pb-1 ">
              <b-col md=12>
                <span class="font-weight-bold">Applying for Academic Record</span>
                <hr class="bg-light mt-1 mb-0">
              </b-col>
            </b-row>
            <b-row class="pb-1">
              <b-col md=6>
                <div class="d-flex flex-row">
                  <div>Curriculum : </div>
                  <!-- <div v-if="!form.studentCurriculumEdit">
                    <span :class="`font-weight-bold ${!form.studentCurriculum ? 'text-danger' : ''}`">
                      {{ form.studentCurriculum ? form.studentCurriculum.name : 'Nothing is Set' }}
                    </span>&nbsp;
                    <b-link 
                      v-if="form.evaluationStatusId === evaluationStatuses.SUBMITTED.id"
                      @click="data.item.studentCurriculumEdit = !data.item.studentCurriculumEdit">
                      [Set Curriculum]
                    </b-link>
                  </div>
                  <div v-else class="w-75 ml-2">
                    <b-form-select
                      @change="loadStudentCurriculum($event, data), data.item.studentCurriculumEdit = !data.item.studentCurriculumEdit"
                      v-model="data.item.studentCurriculumId">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>-- Curriculum --</b-form-select-option>
                      </template>
                      <b-form-select-option 
                        v-for="curriculum in data.item.curriculums" 
                        :key="curriculum.id" 
                        :value="curriculum.id">
                        {{ curriculum.name }}
                      </b-form-select-option>
                    </b-form-select>
                  </div> -->
                </div>
              </b-col>
              <!-- <b-col md=6 v-if="data.item.course">
                <div class="d-flex flex-row">
                  <div>Course : </div>
                  <div v-if="!data.item.studentCourseEdit">
                    <span class="font-weight-bold">
                      {{ data.item.course.description }} {{ data.item.course.major ? ' - ' + data.item.course.major  : '' }}
                    </span>&nbsp;&nbsp;
                    <b-link 
                      v-if="data.item.evaluationStatusId === evaluationStatuses.SUBMITTED.id"
                      @click="data.item.studentCourseEdit = !data.item.studentCourseEdit">
                      [Change Course]
                    </b-link>
                  </div>
                  <div v-else class="w-75 ml-2">
                    <b-form-select
                      @change="onChangeCourse(data)" 
                      v-model="data.item.courseId" 
                      class="float-right">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>-- Course --</b-form-select-option>
                      </template>
                      <b-form-select-option :value="null">None</b-form-select-option>
                      <b-form-select-option 
                        v-for="course in options.courses.items" 
                        :key="course.id" 
                        :value="course.id">
                        {{course.description}} {{course.major ? `(${course.major})` : ''}}
                      </b-form-select-option>
                    </b-form-select>
                  </div>
                </div>
              </b-col> -->
            </b-row>
            <b-row class="pb-1">
              <!-- <b-col md=6>
                Level : <span class="font-weight-bold">{{ getName(data.item, 'level') }}</span>
              </b-col>
              <b-col md=6 v-if="data.item.semesterId">
                Semester : <span class="font-weight-bold">{{ semesters.getEnum(data.item.semesterId).name }}</span>
              </b-col> -->
            </b-row>
          </b-col>
        </b-row>
      </b-card>
      <!-- <b-card>
        <div>
          <b-row class="mb-3 text-center">
            <b-col md=12>
              <h5>Evaluation Form</h5>
              <div v-if="!data.item.curriculumEdit" :class="!data.item.curriculum ? 'text-danger' : ''"> 
                <b>{{ 
                  data.item.curriculum ? data.item.curriculum.name 
                    : data.item.curriculumMsg ? `There's no active curriculum set. Please set a curriculum` 
                    : 'Nothing is Set' }}</b>&nbsp;
                <b-link 
                  v-if="!data.item.curriculumMsg && data.item.evaluationStatusId === evaluationStatuses.SUBMITTED.id"
                  @click="data.item.curriculumEdit = !data.item.curriculumEdit">
                  [Change]
                </b-link>
              </div>
              <b-form-select
                class="w-50"
                v-else
                @change="loadCurriculum($event, data), data.item.curriculumEdit = !data.item.curriculumEdit"
                v-model="data.item.curriculumId">
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled>-- Curriculum --</b-form-select-option>
                </template>
                <b-form-select-option 
                  v-for="curriculum in data.item.curriculums" 
                  :key="curriculum.id" 
                  :value="curriculum.id">
                  {{ curriculum.name }}
                </b-form-select-option>
              </b-form-select>
            </b-col>
          </b-row>
          <div v-if="data.item.subjects">
            <b-row v-if="data.item.courseId === null">
              <b-col md=12>
                <b-row>
                  <b-col md=6>
                    <h5>{{ getName(data.item, 'level') }}</h5>
                  </b-col>
                </b-row>
                <b-table
                  class="mb-4"
                  hover outlined small responsive show-empty
                  :fields="tables.subjects.fields"
                  :items="data.item.subjects"
                  :busy="tables.subjects.isBusy">
                  <template v-slot:head(pivot.isTaken)>
                    <b-form-checkbox
                      v-if="data.item.evaluationStatusId === evaluationStatuses.SUBMITTED.id"
                      @input="toggleCheckAll(data.item.subjects, $event)"
                      v-model="data.item.isTakenAll">
                      Credited
                    </b-form-checkbox>
                  </template>
                  <template v-slot:cell(pivot.isTaken)="row">
                    <b-form-checkbox
                      :disabled="data.item.evaluationStatusId !== evaluationStatuses.SUBMITTED.id"
                      :value=1
                      :unchecked-value=0
                      v-model="row.item.pivot.isTaken" />
                  </template>
                  <template v-slot:table-busy>
                    <div class="text-center my-2">
                      <v-icon 
                        name="spinner" 
                        spin
                        class="mr-2" />
                      <strong>Loading...</strong>
                    </div>
                  </template>
                  <template v-slot:cell(pivot.grade)="row">
                    <vue-autonumeric
                      :disabled="data.item.evaluationStatusId !== evaluationStatuses.SUBMITTED.id || !row.item.pivot.isTaken"
                      v-model="row.item.pivot.grade"
                      class="form-control text-right" 
                      :options="[{minimumValue: 0, modifyValueOnWheel: false, emptyInputBehavior: 0}]">
                    </vue-autonumeric>
                  </template>
                  <template v-slot:cell(pivot.notes)="row">
                    <b-form-input
                      :disabled="data.item.evaluationStatusId !== evaluationStatuses.SUBMITTED.id || !row.item.pivot.isTaken"
                      v-model="row.item.pivot.notes">
                    </b-form-input>
                  </template>
                  <template v-slot:cell(labs)="row">
                    {{ data.item.schoolCategoryId === options.schoolCategories.VOCATIONAL.id ? 'N/A' : row.item.labs }}
                  </template>
                  <template v-slot:cell(units)="row">
                    {{ data.item.schoolCategoryId === options.schoolCategories.VOCATIONAL.id ? 'N/A' : row.item.units }}
                  </template>
                  <template v-slot:custom-foot>
                    <b-tr class="font-weight-bold">
                      <b-td colspan=6 class="text-right">
                        <span class="text-danger">Total Units </span>
                      </b-td>
                      <b-td class="text-center">
                        <span class="text-danger">
                          {{ data.item.schoolCategoryId === options.schoolCategories.VOCATIONAL.id ? 'N/A' : 
                            totalUnits(data.item.subjects, 'units') }}
                        </span>
                      </b-td>
                      <b-td class="text-center">
                        <span class="text-danger">
                          {{ data.item.schoolCategoryId === options.schoolCategories.VOCATIONAL.id ? 'N/A' : 
                            totalUnits(data.item.subjects, 'labs') }}
                        </span>
                      </b-td>
                      <b-td class="text-center">
                        <span class="text-danger">
                          {{ data.item.schoolCategoryId === options.schoolCategories.VOCATIONAL.id ? 'N/A' : 
                            totalUnits(data.item.subjects, 'totalUnits') }}
                        </span>
                      </b-td>
                    </b-tr>
                  </template>
                </b-table>
              </b-col>
            </b-row>
            <b-row v-else> 
              <b-col md=12>
                <b-list-group>				
                  <b-list-group-item										
                    v-for="level in data.item.levels" 
                    :key="level.id">
                    <div v-b-toggle="'level' + level.id" class="d-flex justify-content-between align-items-center">
                      <h5>{{ level.name }}</h5>
                      <span class="when-open">
                        <v-icon name="caret-down" />
                      </span>
                      <span class="when-closed">
                        <v-icon name="caret-left" />
                      </span>
                    </div>
                    <b-collapse :id="'level' + level.id" class="mt-2" role="tabpanel">
                      <b-form-checkbox class="mb-2" @input="getSemesters(level, $event)">
                        Show All Semesters
                      </b-form-checkbox>
                      <b-card
                        v-for="semester in filterSemester(data, level)"
                        :key="semester.id">
                        <b-row>
                          <b-col md=9>
                            <h6>{{semester.name}}</h6>
                          </b-col>
                          <b-col md=3>
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col md=12>
                            <b-table
                              responsive small hover outlined show-empty
                              :items="filterSubjects(data, level.id, semester.id).items"
                              :fields="tables.subjects.fields"
                              :busy="tables.subjects.isBusy">
                              <template v-slot:table-busy>
                                <div class="text-center my-2">
                                  <v-icon 
                                    name="spinner" 
                                    spin
                                    class="mr-2" />
                                  <strong>Loading...</strong>
                                </div>
                              </template>
                              <template v-slot:cell(pivot.grade)="row">
                                <vue-autonumeric
                                  :disabled="data.item.evaluationStatusId !== evaluationStatuses.SUBMITTED.id || !row.item.pivot.isTaken"
                                  v-model="row.item.pivot.grade"
                                  class="form-control text-right" 
                                  :options="[{minimumValue: 0, modifyValueOnWheel: false, emptyInputBehavior: 0}]">
                                </vue-autonumeric>
                              </template>
                              <template v-slot:cell(pivot.notes)="row">
                                <b-form-input
                                  :disabled="data.item.evaluationStatusId !== evaluationStatuses.SUBMITTED.id || !row.item.pivot.isTaken"
                                  v-model="row.item.pivot.notes">
                                </b-form-input>
                              </template>
                              <template v-slot:cell(labs)="row">
                                {{ data.item.schoolCategoryId === options.schoolCategories.VOCATIONAL.id ? 'N/A' : row.item.labs }}
                              </template>
                              <template v-slot:cell(units)="row">
                                {{ data.item.schoolCategoryId === options.schoolCategories.VOCATIONAL.id ? 'N/A' : row.item.units }}
                              </template>
                              <template v-slot:custom-foot>
                                <b-tr class="font-weight-bold">
                                  <b-td colspan=6 class="text-right">
                                    <span class="text-danger">Total Units </span>
                                  </b-td>
                                  <b-td class="text-center">
                                    <span class="text-danger">
                                      {{ data.item.schoolCategoryId === options.schoolCategories.VOCATIONAL.id ? 'N/A' : 
                                        totalUnits(filterSubjects(data, level.id, semester.id).items, 'units') }}
                                    </span>
                                  </b-td>
                                  <b-td class="text-center">
                                    <span class="text-danger">
                                      {{ data.item.schoolCategoryId === options.schoolCategories.VOCATIONAL.id ? 'N/A' : 
                                        totalUnits(filterSubjects(data, level.id, semester.id).items, 'labs') }}
                                    </span>
                                  </b-td>
                                  <b-td class="text-center">
                                    <span class="text-danger">
                                      {{ data.item.schoolCategoryId === options.schoolCategories.VOCATIONAL.id ? 'N/A' : 
                                        totalUnits(filterSubjects(data, level.id, semester.id).items, 'totalUnits') }}
                                    </span>
                                  </b-td>
                                </b-tr>
                              </template>
                              <template v-slot:head(pivot.isTaken)>
                                <b-form-checkbox
                                  v-if="data.item.evaluationStatusId === evaluationStatuses.SUBMITTED.id"
                                  @input="toggleCheckAll(filterSubjects(data, level.id, semester.id).items, $event)"
                                  v-model="filterSubjects(data, level.id, semester.id).isTakenAll">
                                  Credited
                                </b-form-checkbox>
                              </template>
                              <template v-slot:cell(pivot.isTaken)="row">
                                <b-form-checkbox
                                  :disabled="data.item.evaluationStatusId !== evaluationStatuses.SUBMITTED.id"
                                  :value=1
                                  :unchecked-value=0
                                  v-model="row.item.pivot.isTaken" />
                              </template>
                            </b-table>
                          </b-col>
                        </b-row>
                      </b-card>
                    </b-collapse>
                  </b-list-group-item>
                </b-list-group>
              </b-col>
            </b-row>
          </div>
        </div>
      </b-card> -->
    </b-card>
  </div>
</template>
<script>
import { StudentCategories } from '../../../helpers/enum'
export default {
  props: {
    form: Object
  },
  data() {
    return {
      studentCategories: StudentCategories 
    }
  }
}
</script>