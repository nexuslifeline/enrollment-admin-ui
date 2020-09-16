<template>
	<div class="c-app">
    <div>
      <div class="page-content__title-container">
        <h4 class="page-content__title">Evaluation & Admission Records</h4>
      </div>
      <SchoolCategoryTabs
        :showAll="true"
        :schoolCategoryId="schoolCategoryId"
        @clickAll="filters.student.schoolCategoryId = null, filters.student.courseId = null, loadEvaluation()"
        @click="filters.student.schoolCategoryId = $event, filters.student.courseId = null, loadEvaluation()"
      />
      <div>
        <b-row class="mb-2"> <!-- row button and search input -->
            <b-col md="6">
              <b-form-radio-group @input="loadEvaluation()" v-model="filters.student.evaluationStatusId">
                <b-form-radio :value="null">Show All</b-form-radio>
                <b-form-radio
                  v-for="status in evaluationStatuses.values"
                  :value="status.id"
                  :key="status.id">
                  {{ status.name }}
                </b-form-radio>
              </b-form-radio-group>
            </b-col>
            <b-col md="3">
              <b-form-select
                v-if="filters.student.schoolCategoryId === options.schoolCategories.SENIOR_HIGH_SCHOOL.id ||
                  filters.student.schoolCategoryId === options.schoolCategories.COLLEGE.id ||
                  filters.student.schoolCategoryId === options.schoolCategories.GRADUATE_SCHOOL.id"
                @change="loadEvaluation()"
                v-model="filters.student.courseId"
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
            </b-col>
            <b-col md="3">
              <b-form-input
                v-model="filters.student.criteria"
                debounce="500"
                @update="loadEvaluation()"
                type="text"
                placeholder="Search">
              </b-form-input>
            </b-col>
        </b-row> <!-- row button and search input -->
        <b-table
          outlined small show-empty responsive
          :fields="tables.students.fields"
          :items="tables.students.items"
          :busy="tables.students.isBusy">
          <template v-slot:head(attachments)>
            <div class="text-center">
              <v-icon name="paperclip"  />
            </div>
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
          <template v-slot:cell(attachments)="data">
            <span>{{ data.item.filesCount }} &nbsp; &nbsp; &nbsp; &nbsp; </span>  <v-icon name="paperclip"/>
          </template>
          <template v-slot:cell(name)="data">
            <b-media>
              <template v-slot:aside>
                <b-avatar
                  rounded
                  blank
                  size="64"
                  :text="data.item.student.firstName.charAt(0) + '' + data.item.student.lastName.charAt(0)"
                  :src="avatar(data.item.student)" />
              </template>
              <div><b-link @click="loadDetails(data)">{{ data.item.student.name }}</b-link></div>
              <div class="text-muted">
                <span>Student No:</span>
                {{ data.item.student.studentNo ? data.item.student.studentNo : ' Awaiting Confirmation' }}
              </div>
              <div>
                <span class="text-muted">{{data.item.student.email}}</span>
                <span class="text-muted" v-if="!!data.item.student.phoneNo || !!data.item.student.mobileNo"> (</span>
                <span class="text-muted">{{data.item.student.phoneNo}}</span>
                <span class="text-muted" v-if="!!data.item.student.phoneNo && !!data.item.student.mobileNo"> | </span>
                <span class="text-muted">{{data.item.student.mobileNo}}</span>
                <span class="text-muted" v-if="!!data.item.student.phoneNo || !!data.item.student.mobileNo">)</span>
              </div>
              <div class="text-muted">
                {{data.item.student.currentAddress || data.item.student.address.currentCompleteAddress}}
              </div>
            </b-media>
          </template>
          <template v-slot:cell(education)="data">
            <span>
              {{ getName(data.item, 'level') }}<br>
              {{ getName(data.item, 'course') }}<br>
              <!-- {{ data.item.enrolledYear ? `Enrolled Year: ${data.item.enrolledYear}` : '' }} -->
            </span>
          </template>
          <template v-slot:cell(studentCategory.name)="{ item: { studentCategory, studentCategoryId } }">
            <b-badge
              :variant="studentCategoryId === studentCategories.NEW.id
                ? 'success'
                : studentCategoryId === studentCategories.OLD.id ? 'primary' : 'warning'">
              {{ studentCategory.name }}
            </b-badge>
          </template>
          <template v-slot:cell(status)="data">
            <b-badge
              :variant="data.item.evaluationStatusId === evaluationStatuses.APPROVED.id
                ? 'success'
                : data.item.evaluationStatusId === evaluationStatuses.REJECTED.id ? 'danger' : 'warning'">
              {{ evaluationStatuses.getEnum(data.item.evaluationStatusId).name }}
            </b-badge>
          </template>
          <template v-slot:cell(attachments)="data">
              <span>{{ data.item.filesCount }} </span>  <v-icon name="paperclip" class="ml-2"  />
              </template>
          <template v-slot:cell(action)="row">
            <button type="button" class="btn-invisible">
              <v-icon
                :name="row.detailsShowing ? 'chevron-down' : 'chevron-left'"
                @click="loadDetails(row)"
                scale="1"
              />
            </button>
          </template>
          <template v-slot:row-details="data">
            <b-overlay :show="data.item.isLoading" rounded="sm">
              <div>
                <b-tabs content>
                  <b-tab title="Details">
                    <div class="p-4">
                      <div class="mt-2 mb-4">
                        <b-row class="mb-2">
                          <b-col md=12>
                            <span class="h5">
                              Student Information
                            </span>
                            <hr class="bg-light mt-1 mb-2">
                          </b-col>
                        </b-row>
                        <b-row class="pb-1">
                          <b-col md=6>
                            <div>
                              Student Number :
                              <span>
                              {{ data.item.student.studentNo ? data.item.student.studentNo : 'Awaiting Confirmation' }}
                              </span>
                            </div>
                          </b-col>
                          <b-col md=6>
                            Name : <span>{{ data.item.student.name }}</span>
                          </b-col>
                        </b-row>
                        <b-row class="pb-1">
                          <b-col md=6>
                            Student Category :
                            <b-badge
                              :variant="data.item.studentCategoryId === studentCategories.NEW.id
                                ? 'success'
                                : data.item.studentCategoryId === studentCategories.OLD.id ? 'primary' : 'warning'">
                              {{ data.item.studentCategory.name }}
                            </b-badge>
                          </b-col>
                          <b-col md=6>
                            Contact Number : <span>{{ data.item.student.mobileNo }}</span>
                          </b-col>
                        </b-row>
                        <b-row class="pb-1">
                          <b-col md=6>
                            Email : <span>{{ data.item.student.email }}</span>
                          </b-col>
                          <b-col md=6>
                            Address :
                            <span>
                              {{ data.item.student.address ? data.item.student.address.currentCompleteAddress : "" }}
                            </span>
                          </b-col>
                        </b-row>
                      </div>
                      <div class="mt-2 mb-4">
                        <b-row class="my-2 pb-1">
                          <b-col md=12>
                            <span class="h5">Previous Educational Background</span>
                            <hr class="bg-light mt-1 mb-2">
                          </b-col>
                        </b-row>
                        <b-row class="pb-1">
                          <b-col md=6>
                            Last School Attended : <span>{{ data.item.lastSchoolAttended }}</span>
                          </b-col>
                          <b-col md=6>
                            <!-- Enrolled Year : <span>{{ data.item.enrolledYear }}</span> -->
                            Last School Level : <span>{{ data.item.lastSchoolLevel ? data.item.lastSchoolLevel.name : 'N/A'}}</span>
                          </b-col>
                        </b-row>
                        <b-row class="pb-1">
                          <b-col md=6>
                            From : <span> {{ data.item.lastSchoolYearFrom }} </span> To : <span > {{data.item.lastSchoolYearTo}}</span>
                          </b-col>
                        </b-row>
                      </div>
                      <div class="mt-2 mb-4">
                        <b-row class="my-2 pb-1">
                          <b-col md=12>
                            <span class="h5">Applying for Academic Record</span>
                            <hr class="bg-light mt-1 mb-2">
                          </b-col>
                        </b-row>
                        <b-row class="pb-1">
                          <b-col md="12">
                            <div class="d-flex flex-row">
                              <div class="mr-2">Curriculum: </div>
                              <div v-if="!data.item.studentCurriculumEdit">
                                <span :class="`font-weight-bold ${!data.item.studentCurriculum ? 'text-danger' : ''}`">
                                  {{ data.item.studentCurriculum ? data.item.studentCurriculum.name : 'Nothing is Set' }}
                                </span>&nbsp;
                                <b-link
                                  v-if="data.item.evaluationStatusId === evaluationStatuses.SUBMITTED.id"
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
                              </div>
                            </div>
                          </b-col>
                        </b-row>
                        <b-row class="pb-1">
                          <b-col md="12" v-if="data.item.course">
                            <div class="d-flex flex-row">
                              <div class="mr-2">Course:</div>
                              <div v-if="!data.item.studentCourseEdit">
                                <span>
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
                          </b-col>
                        </b-row>
                        <b-row class="pb-1">
                          <b-col md="12">
                            Level:<span class="ml-2">{{ getName(data.item, 'level') }}</span>
                          </b-col>
                        </b-row>
                        <b-row class="pb-1">
                          <b-col md="12" v-if="data.item.semesterId">
                            Semester:<span class="ml-2">{{ semesters.getEnum(data.item.semesterId).name }}</span>
                          </b-col>
                        </b-row>
                        <b-row class="pb-1">
                          <b-col md="12">
                            Date Submitted:<span class="ml-2">{{ data.item.submittedDate }}</span>
                          </b-col>
                        </b-row>
                      </div>
                    </div>
                  </b-tab>
                  <b-tab title="Evaluation Form">
                    <div class="p-4">
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
                              outlined responsive show-empty
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
                                <b-tr>
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
                                          responsive hover outlined show-empty
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
                                            <b-tr>
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
                  </b-tab>
                  <b-tab>
                    <template v-slot:title>
                      Attachments 
                      <span v-if="data.item.filesCount > 0">
                        ({{data.item.filesCount}})
                      </span>
                    </template>
                    <div class="p-4" v-if="data.item.files">
                      <h5>Files</h5>
                      <b-table
                        outlined responsive show-empty
                        :fields="tables.files.fields"
                        :items="data.item.files"
                        :busy="tables.files.isBusy">
                        <template v-slot:cell(action)="row">
                          <b-button
                            @click="previewFile(row, data)"
                            size="sm" variant="secondary">
                            <v-icon
                              name="search"/>
                          </b-button>
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
                      </b-table>
                    </div>
                  </b-tab>
                </b-tabs>
                <div
                  v-if="data.item.evaluationStatusId === evaluationStatuses.SUBMITTED.id">
                  <b-button
                    @click="setDisapproval(data)"
                    class="float-right my-2 mr-2"
                    variant="outline-danger">Reject</b-button>
                  <b-button
                    @click="setApproval(data)"
                    class="float-right m-2"
                    variant="outline-primary">Approve</b-button>
                </div>
              </div>
            </b-overlay>
          </template>
        </b-table>
        <b-row>
          <b-col md=6>
            Showing {{paginations.student.from}} to {{paginations.student.to}} of {{paginations.student.totalRows}} records.
          </b-col>
          <b-col md=6>
            <b-pagination
              v-model="paginations.student.page"
              :total-rows="paginations.student.totalRows"
              :per-page="paginations.student.perPage"
              size="sm"
              align="end"
              @input="loadEvaluation()"
            />
          </b-col>
        </b-row>
      </div>
    </div>
    <FileViewer
      :show="fileViewer.show"
      :file="file"
      :owner="file.owner"
      :isBusy="file.isLoading"
      @close="fileViewer.show = false"
      @onNavLeft="onFileNavLeft"
      @onNavRight="onFileNavRight"
      :navCount="fileViewer.activeNavCount"
      :navActiveIndex="fileViewer.activeNavIndex"
      :enableArrowNav="fileViewer.isActiveNavEnabled"
    />
		<b-modal
			v-model="showModalApproval"
			centered
			header-bg-variant="success"
			header-text-variant="light"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					Finalize Approval
			</div> <!-- modal title -->
			<b-row> <!-- modal body -->
				<b-col md=12>
					<label>Notes</label>
					<b-textarea
            v-model="forms.evaluation.fields.approvalNotes"
						rows=7 />
				</b-col>
			</b-row> <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button
          class="float-left"
          @click="showModalApproval=false">
          Cancel
        </b-button>
				<b-button
          @click="onApproval()"
          class="float-right"
          variant="outline-primary"
          :disabled="isProcessing">
          <v-icon
            v-if="isProcessing"
            name="sync"
            class="mr-2"
            spin
          />
					Confirm
				</b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
		<!-- Modal Approval -->
		<!-- Modal Reject -->
		<b-modal
			v-model="showModalRejection"
			centered
			header-bg-variant="danger"
			header-text-variant="light"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					Confirm Rejection
			</div> <!-- modal title -->
			<b-row> <!-- modal body -->
				<b-col md=12>
					<label>Reason</label>
					<b-textarea
            v-model="forms.evaluation.fields.disapprovalNotes"
						rows=7 />
				</b-col>
			</b-row> <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button
          class="float-left"
          @click="showModalRejection=false">
          Cancel
        </b-button>
				<b-button
          @click="onDisapproval()"
          class="float-right"
          variant="outline-primary"
          :disabled="isProcessing">
          <v-icon
            v-if="isProcessing"
            name="sync"
            class="mr-2"
            spin
          />
          Confirm
				</b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
		<!-- Modal Reject -->
	</div> <!-- main container -->
</template>
<script>
import { EvaluationApi, EvaluationFileApi, CurriculumApi, CourseApi } from "../../mixins/api"
import { SchoolCategories, EvaluationStatuses, Semesters, UserGroups, StudentCategories } from "../../helpers/enum"
import { showNotification, formatNumber, clearFields } from "../../helpers/forms"
import Tables from "../../helpers/tables"
import SchoolCategoryTabs from "../components/SchoolCategoryTabs"
import { copyValue } from '../../helpers/extractor'
import FileViewer from '../components/FileViewer'

const evaluationFields = {
  evaluationStatusId: null,
  approvalNotes: null,
  disapprovalNotes: null
}

export default {
	name: "Evaluation",
  mixins: [EvaluationApi, EvaluationFileApi, CurriculumApi, CourseApi, Tables],
  components: {
    SchoolCategoryTabs,
    FileViewer
  },
	data() {
		return {
      fileViewer: {
        isActiveNavEnabled: false,
        activeNavCount: 0,
        activeNavIndex: 0,
        show: false,
      },
			showModalApproval: false,
      showModalRejection: false,
      showModalSubjects: false,
			isLoading: false,
      evaluationStatuses: EvaluationStatuses,
      semesters: Semesters,
      studentCategories: StudentCategories,
      lastActiveEvaluation: null,
      lastActiveFile: null,
      file: {
        type: null,
        src: null,
        name: null,
        notes: null,
        isLoading: false
      },
      forms: {
        evaluation: {
          fields: { ...evaluationFields },
          states: { ...evaluationFields },
          errors: { ...evaluationFields }
        }
      },
			tables: {
				students: {
					isBusy: false,
					filterIncludedFields: ["firstName", "lastName"],
					fields: [
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: { width: "auto"},
							// formatter: (value, key, item) => {
							// 	if(!item.student.middleName){
							// 		item.student.middleName = ""
							// 	}
							// 	item.student.name = item.student.firstName + " " + item.student.middleName + " " + item.student.lastName
							// }
						},
						{
							key: "education",
							label: "Education",
							tdClass: "align-middle",
              thStyle: { width: "20%"}
            },
            {
							key: "submittedDate",
							label: "Date Submitted",
							tdClass: "align-middle",
              thStyle: { width: "10%"}
            },
            {
              key: "studentCategory.name",
							label: "Category",
							tdClass: "align-middle text-center font-weight-bold",
							thClass: "text-center",
							thStyle: { width: "12%"}
            },
						{
							key: "status",
							label: "Status",
							tdClass: "align-middle text-center",
							thClass: "text-center",
							thStyle: { width: "12%"}
            },
            {
							key: "attachments",
							label: "",
							tdClass: "align-middle text-center",
							thClass: "text-center",
							thStyle: { width: "8%"}
						},
						{
							key: "action",
							label: "",
							tdClass: "align-middle",
							thStyle: { width: "40px"}
						},
					],
					items: []
        },
        subjects: {
					isBusy: false,
					fields: [
            {
							key: "pivot.isTaken",
							label: "Credited",
              tdClass: "align-middle text-center",
              thClass: "text-center",
							thStyle: {width: "120px"}
            },
            {
							key: "pivot.grade",
							label: "Grade",
							tdClass: "align-middle",
							thStyle: {width: "10%"}
            },
            {
							key: "pivot.notes",
							label: "Remarks",
							tdClass: "align-middle",
							thStyle: {width: "15%"}
						},
						{
							key: "name",
							label: "Subject Code",
							tdClass: "align-middle",
							thStyle: {width: "12%"}
						},
						{
							key: "description",
							label: "Description",
							tdClass: "align-middle",
							thStyle: {width: "auto"}
            },
            {
							key: "prerequisites",
							label: "Prerequisites",
							tdClass: "align-middle",
              thStyle: {width: "15%"},
              formatter: (value, key, item) => {
                if (value.length > 0) {
                   return value.map(subject => { return subject.name; }).join(", ");
                }
                return ''
              }
            },
						{
							key: "units",
							label: "Lec Units",
							tdClass: "align-middle text-center",
							thClass: "text-center",
							thStyle: {width: "6%"}
            },
						{
							key: "labs",
							label: "Lab Units",
							tdClass: "align-middle text-center",
							thClass: "text-right",
							thStyle: {width: "6%"}
            },
            {
							key: "totalUnits",
							label: "Total Units",
							tdClass: "align-middle text-center",
							thClass: "text-center",
              thStyle: {width: "10%"}
						},
          ],
          items: [],
          filteredItems: []
        },
        files: {
					isBusy: false,
					fields: [
            {
							key: "name",
							label: "Filename",
							tdClass: "align-middle",
              thStyle: { width: "40%" }
						},
            {
							key: "notes",
							label: "Notes",
							tdClass: "align-middle",
              thStyle: { width: "auto" }
						},
						{
              key: "action",
              label: "",
							tdClass: "align-middle",
							thStyle: { width: "35px" }
            }
          ],
					items: []
				},
			},
			paginations: {
				student: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
        },
				subject: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
			},
			filters: {
				student: {
					criteria: null,
					schoolCategoryId: null,
					courseId: null,
					evaluationStatusId: null
        },
        subject: {
          criteria: null,
          departmentId: null
        }
			},
			options: {
				courses: {
					items: []
        },
        departments: {
          items: []
        },
        schoolCategories: SchoolCategories,
        curriculums: {
          isLoading: false,
          items: []
        }
      },
      isProcessing: false,
      schoolCategoryId: null,
      row: []
		}
	},
	created(){
    this.checkRights()
    this.loadCourseList()
	},
	methods: {
    setApproval(row) {
      this.forms.evaluation.approvalNotes = null
      if (row.item.curriculumMsg) {
        showNotification(this, 'danger', 'Please set a curriculum before approving.')
        return
      }
      this.row = row
      this.showModalApproval = true
    },
    onApproval() {
      this.isProcessing = true;
      const {
        item,
        item: {
          id: evaluationId,
          curriculumId,
          studentCurriculumId,
          courseId
        }
      } = this.row

      const {
        evaluation: { fields: evaluation },
      } = this.forms

      let subjects = []

      item.subjects.forEach(subject => {
        subjects.push({
          subjectId: subject.id,
          levelId: subject.pivot.levelId,
          semesterId: subject.pivot.semesterId,
          grade: subject.pivot.grade,
          notes: subject.pivot.notes,
          isTaken: subject.pivot.isTaken
        })
      })

      evaluation.evaluationStatusId = EvaluationStatuses.APPROVED.id
      // const curriculumId = item.curriculumId
      // const studentCurriculumId = item.studentCurriculumId

      const data = {
        ...evaluation,
        curriculumId,
        studentCurriculumId,
        courseId,
        subjects
      }

      this.updateEvaluation(data, evaluationId)
      .then(({ data }) => {
        clearFields(evaluation)
        this.loadEvaluation()
        this.isProcessing = false
        this.showModalApproval = false
        showNotification(this, "success", "Approved Successfully.")
      }).catch((error) => {
        this.isProcessing = false;
        const errors = error.response.data.errors
        this.showBulletedNotification(errors)
      });
    },
    setDisapproval(row) {
      this.forms.evaluation.disapprovalNotes = null
      this.row = row
      this.showModalRejection = true
    },
    onDisapproval() {
      this.isProcessing = true;
      const {
        item,
        item: {
          id: evaluationId
        }
      } = this.row

      const {
        evaluation: { fields: evaluation },
      } = this.forms

      evaluation.evaluationStatusId = EvaluationStatuses.REJECTED.id

      const data = {
        ...evaluation
      }

      this.updateEvaluation(data, evaluationId)
      .then(({ data }) => {
        clearFields(evaluation)
        this.loadEvaluation()
        this.isProcessing = false
        this.showModalRejection = false
        showNotification(this, "success", "Rejected Successfully.")
      }).catch((error) => {
        console.log(error)
        this.isProcessing = false;
      });
    },
		loadEvaluation(){
      const { students } = this.tables
      const { student, student: { perPage, page } } = this.paginations
      students.isBusy = true
      const { evaluationStatusId, schoolCategoryId, courseId, criteria } = this.filters.student
      const applicationStatusId = EvaluationStatuses.SUBMITTED.id
      const orderBy = 'submitted_date'
      const sort = 'DESC'
			let params = {
				paginate: true,
        perPage,
        page,
        evaluationStatusId,
        schoolCategoryId,
        courseId,
        orderBy,
        sort,
        criteria }
			this.getEvaluationList(params)
				.then(response => {
					const res = response.data
					students.items = res.data;
					student.from = res.meta.from
					student.to = res.meta.to
					student.totalRows = res.meta.total
          students.isBusy = false
				})
    },
    loadCourseList(){
			let params = { paginate: false }
			this.getCourseList(params)
			.then(({ data }) => {
				this.options.courses.items = data
			})
		},
	  loadDetails(row){
			if (!row.detailsShowing) {
				const {
          item,
          item: {
            id,
            schoolCategoryId,
            levelId,
            courseId
          }
        } = row

        this.$set(item, 'isLoading', true)
        this.$set(item, 'curriculumEdit', false)
        this.$set(item, 'studentCurriculumEdit', false)
        this.$set(item, 'studentCourseEdit', false)
        this.$set(item, 'curriculums', false)

        let params = { paginate: false, schoolCategoryId, levelId}

        if (schoolCategoryId === SchoolCategories.SENIOR_HIGH_SCHOOL.id ||
          schoolCategoryId === SchoolCategories.COLLEGE.id) {
          params = { paginate: false, schoolCategoryId, courseId }
        }
        item.isLoading = true
        this.getEvaluationFileList(id, { paginate: false })
        .then(({ data }) => {
          this.$set(row.item, 'files', data)
          if (item.evaluationStatusId === EvaluationStatuses.SUBMITTED.id) {
            // this.loadCurriculumList(params, row)
            this.getCurriculumList(params)
            .then(({ data }) => {
              item.curriculums = data
              if (data.length > 0) {
                if (item.curriculumId === null) {
                  const activeCurriculum = data.find(c => c.active === 1)
                  if (activeCurriculum) {
                    item.curriculumId = activeCurriculum.id
                    if (item.studentCategoryId === StudentCategories.NEW.id) {
                      item.studentCurriculumId = activeCurriculum.id
                      item.studentCurriculum = activeCurriculum
                    }
                  } else {
                    this.$set(item, 'curriculumMsg', true)
                    item.isLoading = false
                    return
                  }
                }
                this.loadCurriculum(item.curriculumId, row)
                // item.isLoading = false
              } else {
                this.$set(item, 'curriculumMsg', true)
                item.isLoading = false
              }
            })
          } else {
            this.loadSubjectsOfEvaluation(id, row)
          }
        })
			}
			row.toggleDetails()
    },
    onChangeCourse(row) {
      const {
        item,
        item: {
          schoolCategoryId,
          courseId
        }
      } = row
      item.isLoading = true
      const params = { paginate: false, schoolCategoryId, courseId }

      this.getCurriculumList(params)
      .then(({ data }) => {
        item.curriculums = data
        if (data.length > 0) {
          const activeCurriculum = data.find(c => c.active === 1)
          if (activeCurriculum) {
            item.curriculumId = activeCurriculum.id
            if (item.studentCategoryId === StudentCategories.NEW.id) {
              item.studentCurriculumId = activeCurriculum.id
              item.studentCurriculum = activeCurriculum
            }
            item.curriculumMsg = false
            this.loadCurriculum(item.curriculumId, row)
          } else {
            item.curriculum = null
            item.studentCurriculum = null
            item.studentCurriculumId = null
            item.curriculumId = null
            item.subjects = null
            item.curriculumMsg = true
            return
          }
        } else {
          item.curriculum = null
          item.studentCurriculum = null
          item.studentCurriculumId = null
          item.curriculumId = null
          item.subjects = null
          item.curriculumMsg = true
          return
        }
      })
    },
    getName(item, child){
      if (item) {
        let value = item[child]
        if (value) {
          return value['name']
        }
      }
      return ''
    },
    setupActiveFileViewer(row, data) {
      this.lastActiveEvaluation = data;
      this.lastActiveFile = row;
      this.fileViewer.isActiveNavEnabled = !!data?.item?.files?.length;
      this.fileViewer.activeNavCount = data?.item?.files?.length;
      this.fileViewer.activeNavIndex =  row.index;
    },
    previewFile(row, data) {
      this.setupActiveFileViewer(row, data);

      const { evaluationId, id, name, notes } = row.item;
      this.file.type = null
      this.file.src = null
      this.file.name = name
      this.file.notes = notes
      this.fileViewer.show = true
      this.file.isLoading = true
      this.file.owner = data.item.student;

      this.getEvaluationFilePreview(evaluationId, id)
        .then(response => {
          this.file.type = response.headers.contentType
          this.file.isLoading = false
          const file = new Blob([response.data], { type: response.headers.contentType })
          const reader = new FileReader();
          reader.onload = e => this.file.src = e.target.result
          reader.readAsDataURL(file);
        })
    },
    loadCurriculum(id, row) {
      const { subjects } = this.tables
      subjects.isBusy = true
      row.item.isLoading = true
      this.getCurriculum(id)
      .then(({ data }) => {
        row.item.curriculum = data
        const newSubjects = data.subjects.map(obj => ({ ...obj, pivot: { ...obj.pivot, isTaken: 0, grade: 0, notes: '' } }))
        this.$set(row.item, 'isTakenAll', false)
        this.$set(row.item, 'subjects', newSubjects)
        if (row.item.courseId) {
          this.loadLevelsOfCourse(row)
        } else {
          row.item.isLoading = false
        }
        subjects.isBusy = false
      });
    },
    loadStudentCurriculum(id, row) {
      const { item, item : { curriculum, curriculums } } = row
      const studentCurr = curriculums.find(i => i.id === id)
      item.curriculumId = id
      item.studentCurriculum = studentCurr
      item.isLoading = true
      this.loadCurriculum(id, row)
    },
    loadSubjectsOfEvaluation(id, row) {
      const { subjects } = this.tables
      subjects.isBusy = true
      this.getSubjectsOfEvaluation(id, { paginate: false })
      .then(({ data }) => {
        this.$set(row.item, 'isTakenAll', false)
        this.$set(row.item, 'subjects', data)
        if (row.item.courseId) {
          this.loadLevelsOfCourse(row)
        } else {
          row.item.isLoading = false
        }
        subjects.isBusy = false
      })
    },
		checkRights(){
			const userGroupId = localStorage.getItem('userGroupId')
			const userGroup = UserGroups.getEnum(Number(userGroupId))
			let result = false
			if (userGroup) {
				this.filters.student.schoolCategoryId = userGroup.schoolCategoryId
				this.schoolCategoryId = userGroup.schoolCategoryId
			}
			this.loadEvaluation()
    },
		avatar(student){
      let src = ''
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName
      }
      return src
    },
    loadLevelsOfCourse(row) {
      let params = { paginate: false }
      row.item.isLoading = true
      this.getLevelsOfCourse(row.item.courseId, params)
        .then(({ data }) => {
          this.$set(row.item, 'levels', data)
          row.item.isLoading = false
        })
    },
    filterSubjects(row, levelId, semesterId = null) {
			const { subjects } = row.item
			let filteredSubjects = subjects.filter(subject =>
				(subject.pivot.levelId === levelId && subject.pivot.semesterId === semesterId)
      )
      const data = { items: filteredSubjects, isTakenAll: false }
			return data
    },
    getSemesters(level, event) {
      this.$set(level, 'isShowAll', event)
    },
    filterSemester(row, level) {
      let defaultSemesters = this.semesters.values.slice(0, 2)
      if (level.isShowAll) {
        return this.semesters.values
      } else {
        const { subjects } = row.item
        let filteredSubjects = subjects.filter(subject =>
          subject.pivot.levelId === level.id
        )
        let distinctSemesters = [...new Set(filteredSubjects.map(x => x.pivot.semesterId))]
        distinctSemesters.forEach(d => {
          if (d) {
            if (!defaultSemesters.map(x => x.id).includes(d)) {
              defaultSemesters.push(Semesters.getEnum(d))
            }
          }
        })
        return defaultSemesters
      }
    },
    toggleCheckAll(subjects, value) {
      subjects.forEach(subject => {
        subject.pivot.isTaken = value ? 1 : 0
      })
    },
    showBulletedNotification(errors) {
      const h = this.$createElement
      const errorList = []
      Object.keys(errors).forEach((key) => {
        errorList.push(h('li', errors[key][0]))
      })
      const vNodesMsg = h(
        'ul',
        errorList
      )
      showNotification(this, "danger", vNodesMsg)
    },
    getCurrentFiles() {
      const { index: studentIdx } = this.lastActiveEvaluation;
      const { files } = this.tables?.students?.items[studentIdx];
      return files;
    },
    getCurrentFileIndex() {
      const { index } = this.lastActiveFile;
      return index;
    },
    onFileNavLeft() {
      const files = this.getCurrentFiles();
      let currentIdx = this.getCurrentFileIndex();
      const isFirst = currentIdx === 0;
      currentIdx = isFirst ? files.length - 1 : currentIdx - 1;
      const file = files[currentIdx];
      const currentFileItem = {
        ...this.lastActiveFile,
        index: currentIdx,
        item: file
      };
      this.previewFile(currentFileItem, this.lastActiveEvaluation);
    },
    onFileNavRight() {
      const files = this.getCurrentFiles();
      let currentIdx = this.getCurrentFileIndex();
      const isLast = currentIdx === files.length - 1;
      currentIdx = isLast ? 0 : currentIdx + 1;
      const file = files[currentIdx];
      const currentFileItem = {
        ...this.lastActiveFile,
        index: currentIdx,
        item: file
      };
      this.previewFile(currentFileItem, this.lastActiveEvaluation);
    }
  },
  computed: {
    totalUnits() {
      return (subjects, field) => {
        let units = 0
        subjects.forEach(s => {
          units += Number(s[field])
        })
        return units
      }
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../assets/scss/shared.scss";

  .preview__modal-description {
    z-index: 5000;
    position: fixed;
    height: 50px;
    background-color: white;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 30px;
  }
  .collapsed .when-open,
	.not-collapsed .when-closed {
		display: none;
	}
  .evaluation__form-details-first {
    width: 25%;
  }
  .evaluation__form-details-second {
    width: 30%;
  }

</style>