<template>
  <div v-if="showEntry" class="academic-entry__container">
    <b-overlay :show="isLoading" rounded="sm">
      <div class="academic-entry__header">
        <div class="academic-entry__header-actions">
          <button
            @click="$emit('onBack')"
            class="academic-entry__header-action-back"
          >
            <BIconArrowLeftCircle scale="2" />
            Go Back to List
          </button>
        </div>
      </div>
      <div class="academic-entry__body">
        <div class="academic-entry__side-nav">
          <div class="academic-entry__quick-links-container">
            <ul class="academic-entry__quick-links">
              <li
                v-for="step in $options.ManualSteps.values"
                :key="step.id"
                class="academic-entry__quick-links-item"
                :class="{
                  active: forms.academicRecord.fields.manualStepId === step.id,
                }"
                v-if="step.id !== $options.ManualSteps.COMPLETED.id"
              >
                {{ step.name }}
                <v-icon
                  v-if="forms.academicRecord.fields.manualStepId === step.id"
                  name="pen"
                  scale="0.8"
                  class="ml-auto"
                >
                </v-icon>
                <!-- <BIconArrowRightCircle v-else scale="1.3" class="ml-auto" /> -->
              </li>
            </ul>
          </div>
        </div>
        <div class="academic-entry__content">
          <div
            v-if="
              forms.academicRecord.fields.manualStepId ===
                $options.ManualSteps.STUDENT_REGISTRATION.id
            "
          >
            <!-- <div class="academic-entry__headline-container">
            <div class="academic-entry__headline-highlight">
              <div class="academic-entry__headline-number">
                1
              </div>
              <div class="academic-entry__headline-text">
                STUDENT REGISTRATION
              </div>
            </div>
          </div> -->
            <div class="m-2">
              <div class="academic-entry__info">
                Student Info
              </div>
              <div class="academic-entry__form">
                <b-row>
                  <b-col md="3">
                    <b-form-group label="Student No.">
                      <b-form-input
                        disabled
                        :value="
                          forms.student.fields.id
                            ? forms.student.fields.studentNo
                            : 'Awaiting Confirmation'
                        "
                      />
                    </b-form-group>
                  </b-col>
                  <b-col md="3">
                    <b-link @click="isExisting = true"
                      ><u>Select Existing Student</u></b-link
                    >
                    <vue-bootstrap-typeahead
                      v-if="isExisting"
                      v-model="studentQuery"
                      :serializer="
                        (s) => {
                          return `${s.studentNo ? s.studentNo : 'N/A'} - ${
                            s.name
                          }`;
                        }
                      "
                      :data="options.students.items"
                      placeholder="Search student name or student number"
                      @hit="getStudentInfo($event)"
                      class="search-typeahead mt-1"
                    >
                      <template slot="suggestion" slot-scope="{ data }">
                        <div>
                          {{ data.studentNo ? data.studentNo : 'N/A' }}
                        </div>
                        <div>{{ data.name }}</div>
                      </template>
                    </vue-bootstrap-typeahead>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="3">
                    <b-form-group label="Firstname" labelClass="required">
                      <b-form-input
                        v-model="forms.student.fields.firstName"
                        :state="forms.student.states.firstName"
                      />
                      <b-form-invalid-feedback>
                        {{ forms.student.errors.firstName }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                  <b-col md="3">
                    <b-form-group label="Middlename">
                      <b-form-input v-model="forms.student.fields.middleName" />
                    </b-form-group>
                  </b-col>
                  <b-col md="3">
                    <b-form-group label="Lastname" labelClass="required">
                      <b-form-input
                        v-model="forms.student.fields.lastName"
                        :state="forms.student.states.lastName"
                      />
                      <b-form-invalid-feedback>
                        {{ forms.student.errors.lastName }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="3">
                    <b-form-group label="Birthdate" labelClass="required">
                      <b-form-input
                        type="date"
                        v-model="forms.student.fields.birthDate"
                        :state="forms.student.states.birthDate"
                      />
                      <b-form-invalid-feedback>
                        {{ forms.student.errors.birthDate }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                  <b-col md="3">
                    <b-form-group label="Mobile No.">
                      <b-form-input v-model="forms.student.fields.mobileNo" />
                    </b-form-group>
                  </b-col>
                  <b-col md="3">
                    <b-form-group label="Civil Status" labelClass="required">
                      <b-form-select
                        v-model="forms.student.fields.civilStatusId"
                        :state="forms.student.states.civilStatusId"
                      >
                        <template v-slot:first>
                          <b-form-select-option :value="null"
                            >-- Select Civil Status --</b-form-select-option
                          >
                        </template>
                        <b-form-select-option
                          v-for="status in $options.CivilStatuses.values"
                          :key="status.id"
                          :value="status.id"
                        >
                          {{ status.name }}
                        </b-form-select-option>
                      </b-form-select>
                      <b-form-invalid-feedback>
                        {{ forms.student.errors.civilStatusId }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-row>
                <!-- <div class="mb-2">
                  
                </div> -->
                <div class="academic-entry__info">
                  Account Info
                </div>
                <b-row>
                  <b-col md="3">
                    <b-form-group label="Email" labelClass="required">
                      <b-form-input
                        v-model="forms.user.fields.username"
                        :state="forms.user.states.userUsername"
                      />
                      <b-form-invalid-feedback>
                        {{ forms.user.errors.userUsername }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                  <b-col md="3">
                    <b-form-group label="Password" labelClass="required">
                      <b-form-input
                        type="password"
                        v-model="forms.user.fields.password"
                        :state="forms.user.states.userPassword"
                      />
                      <b-form-invalid-feedback>
                        {{ forms.user.errors.userPassword }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                  <b-col md="3">
                    <b-form-group
                      label="Confirm Password"
                      labelClass="required"
                    >
                      <b-form-input
                        v-model="forms.user.fields.passwordConfirmation"
                        type="password"
                      />
                    </b-form-group>
                  </b-col>
                </b-row>
                <div class="academic-entry__info">
                  Academic Info
                </div>
                <b-row>
                  <b-col md="3">
                    <b-form-group label="Level" labelClass="required">
                      <b-form-select
                        @input="
                          getSchoolCategoryId(),
                            (forms.academicRecord.fields.courseId = null)
                        "
                        v-model="forms.academicRecord.fields.levelId"
                        :state="
                          forms.academicRecord.states.academicRecordLevelId
                        "
                      >
                        <template v-slot:first>
                          <b-form-select-option :value="null"
                            >-- Select Level --</b-form-select-option
                          >
                        </template>
                        <b-form-select-option
                          v-for="level in options.levels.items"
                          :key="level.id"
                          :value="level.id"
                        >
                          {{ level.name }}
                        </b-form-select-option>
                      </b-form-select>
                      <b-form-invalid-feedback>
                        {{ forms.academicRecord.errors.academicRecordLevelId }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                  <b-col md="3">
                    <b-form-group label="School Year" labelClass="required">
                      <b-form-select
                        v-model="forms.academicRecord.fields.schoolYearId"
                        :state="
                          forms.academicRecord.states.academicRecordSchoolYearId
                        "
                      >
                        <template v-slot:first>
                          <b-form-select-option :value="null"
                            >-- Select School Year --</b-form-select-option
                          >
                        </template>
                        <b-form-select-option
                          v-for="schoolYear in options.schoolYears.items"
                          :key="schoolYear.id"
                          :value="schoolYear.id"
                        >
                          {{ schoolYear.name }}
                        </b-form-select-option>
                      </b-form-select>
                      <b-form-invalid-feedback>
                        {{
                          forms.academicRecord.errors.academicRecordSchoolYearId
                        }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row
                  v-if="
                    [
                      $options.SchoolCategories.SENIOR_HIGH_SCHOOL.id,
                      $options.SchoolCategories.COLLEGE.id,
                      $options.SchoolCategories.GRADUATE_SCHOOL.id,
                      $options.SchoolCategories.VOCATIONAL.id,
                    ].includes(forms.academicRecord.fields.schoolCategoryId)
                  "
                >
                  <b-col md="6">
                    <b-form-group label="Course" labelClass="required">
                      <b-form-select
                        v-model="forms.academicRecord.fields.courseId"
                        :state="
                          forms.academicRecord.states.academicRecordCourseId
                        "
                      >
                        <template v-slot:first>
                          <b-form-select-option :value="null"
                            >-- Select Course --</b-form-select-option
                          >
                        </template>
                        <b-form-select-option
                          v-for="course in options.courses.items"
                          :key="course.id"
                          :value="course.id"
                        >
                          {{
                            `${course.description} ${
                              course.major ? `- ${course.major}` : ``
                            }`
                          }}
                        </b-form-select-option>
                      </b-form-select>
                      <b-form-invalid-feedback>
                        {{ forms.academicRecord.errors.academicRecordCourseId }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                  <b-col md="3">
                    <b-form-group label="Semester" labelClass="required">
                      <b-form-select
                        v-model="forms.academicRecord.fields.semesterId"
                        :state="
                          forms.academicRecord.states.academicRecordSemesterId
                        "
                      >
                        <template v-slot:first>
                          <b-form-select-option :value="null"
                            >-- Select Semester --</b-form-select-option
                          >
                        </template>
                        <b-form-select-option
                          v-for="semester in $options.Semesters.values"
                          :key="semester.id"
                          :value="semester.id"
                        >
                          {{ semester.name }}
                        </b-form-select-option>
                      </b-form-select>
                      <b-form-invalid-feedback>
                        {{
                          forms.academicRecord.errors.academicRecordSemesterId
                        }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-row>
              </div>
            </div>
          </div>
          <div
            v-if="
              forms.academicRecord.fields.manualStepId ===
                $options.ManualSteps.EVALUATION.id
            "
          >
            <!-- <div class="academic-entry__headline-container">
              <div class="academic-entry__headline-highlight">
                <div class="academic-entry__headline-number">
                  2
                </div>
                <div class="academic-entry__headline-text">
                  EVALUATION
                </div>
              </div>
            </div> -->
            <div class="academic-entry__info">
              Student Information
            </div>
            <b-row>
              <b-col md="6">
                <div class="academic-entry__info-item">
                  <div class="mr-2 font-weight-bold">Student Number:</div>
                  <p>Awaiting Confirmation</p>
                </div>
              </b-col>
              <b-col md="6">
                <div class="academic-entry__info-item">
                  <div class="mr-2 font-weight-bold">Name:</div>
                  <p>{{ forms.student.fields.name }}</p>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="6">
                <div class="academic-entry__info-item">
                  <div class="mr-2 font-weight-bold">Email:</div>
                  <p>{{ forms.student.fields.email }}</p>
                </div>
              </b-col>
              <b-col md="6">
                <div class="academic-entry__info-item">
                  <div class="mr-2 font-weight-bold">Category :</div>
                  <p>
                    <b-badge
                      :variant="
                        forms.academicRecord.fields.studentCategoryId ===
                        $options.StudentCategories.NEW.id
                          ? 'success'
                          : forms.academicRecord.fields.studentCategoryId ===
                            $options.StudentCategories.OLD.id
                          ? 'primary'
                          : 'warning'
                      "
                    >
                      {{
                        forms.academicRecord.fields.studentCategoryId
                          ? $options.StudentCategories.getEnum(
                              forms.academicRecord.fields.studentCategoryId
                            ).name
                          : ''
                      }}
                    </b-badge>
                  </p>
                </div>
              </b-col>
            </b-row>
            <div class="academic-entry__info">
              Previous Educational Background
            </div>
            <b-row>
              <b-col md="6">
                <div class="academic-entry__info-item">
                  <b-form-group
                    label="Last School Attended"
                    labelClass="font-weight-bold"
                  >
                    <b-form-input
                      v-model="forms.evaluation.fields.lastSchoolAttended"
                    />
                  </b-form-group>
                </div>
              </b-col>
              <b-col md="3">
                <div class="academic-entry__info-item">
                  <b-form-group
                    label="Last School Level"
                    labelClass="font-weight-bold"
                  >
                    <b-form-select
                      v-model="forms.evaluation.fields.lastSchoolLevelId"
                    >
                      <template v-slot:first>
                        <b-form-select-option :value="null"
                          >-- Select Level --</b-form-select-option
                        >
                      </template>
                      <b-form-select-option
                        v-for="level in options.levels.items"
                        :key="level.id"
                        :value="level.id"
                      >
                        {{ level.name }}
                      </b-form-select-option>
                    </b-form-select>
                  </b-form-group>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="3">
                <div class="academic-entry__info-item">
                  <b-form-group label="From:" labelClass="font-weight-bold">
                    <b-form-input
                      v-model="forms.evaluation.fields.lastSchoolYearFrom"
                    />
                  </b-form-group>
                </div>
              </b-col>
              <b-col md="3">
                <div class="academic-entry__info-item">
                  <b-form-group label="To:" labelClass="font-weight-bold">
                    <b-form-input
                      v-model="forms.evaluation.fields.lastSchoolYearTo"
                    />
                  </b-form-group>
                </div>
              </b-col>
            </b-row>
            <div class="academic-entry__info">
              Application for Current Academic Year
            </div>
            <b-row>
              <b-col md="6">
                <div class="academic-entry__info-item">
                  <b-form-group
                    label="Curriculum"
                    labelClass="font-weight-bold"
                  >
                    <div v-if="!editStudentCurriculum" class="mb-3">
                      <span
                        :class="
                          `font-weight-bold ${
                            !studentCurriculum ? 'text-danger' : ''
                          }`
                        "
                      >
                        {{
                          studentCurriculum
                            ? studentCurriculum.name
                            : 'Nothing is Set'
                        }} </span
                      >&nbsp;
                      <b-link
                        @click="editStudentCurriculum = !editStudentCurriculum"
                      >
                        [Set Curriculum]
                      </b-link>
                    </div>
                    <b-form-select
                      v-else
                      @input="
                        forms.transcriptRecord.fields.curriculumId = $event
                      "
                      v-model="
                        forms.transcriptRecord.fields.studentCurriculumId
                      "
                    >
                      <template v-slot:first>
                        <b-form-select-option :value="null"
                          >-- Select Curriculum --</b-form-select-option
                        >
                      </template>
                      <b-form-select-option
                        v-for="curriculum in options.curriculums.items"
                        :key="curriculum.id"
                        :value="curriculum.id"
                      >
                        {{ curriculum.name }}
                      </b-form-select-option>
                    </b-form-select>
                  </b-form-group>
                </div>
              </b-col>
              <b-col md="3">
                <div class="academic-entry__info-item">
                  <div class="academic-entry__info-item">
                    <div class="mr-2 font-weight-bold">Level :</div>
                    <p>
                      {{
                        forms.evaluation.fields.levelId
                          ? options.levels.items.find(
                              (l) => l.id === forms.evaluation.fields.levelId
                            ).name
                          : ''
                      }}
                    </p>
                  </div>
                </div>
              </b-col>
            </b-row>
            <b-row v-if="forms.academicRecord.fields.courseId">
              <b-col md="6">
                <div class="academic-entry__info-item">
                  <div class="mr-2 font-weight-bold">Course :</div>
                  <p>
                    {{
                      forms.academicRecord.fields.courseId
                        ? options.courses.items.find(
                            (l) => l.id === forms.academicRecord.fields.courseId
                          ).description
                        : ''
                    }}
                  </p>
                </div>
              </b-col>
              <b-col md="3">
                <div class="academic-entry__info-item">
                  <div class="mr-2 font-weight-bold">Semester :</div>
                  <p>
                    {{
                      forms.academicRecord.fields.semesterId
                        ? $options.Semesters.values.find(
                            (l) =>
                              l.id === forms.academicRecord.fields.semesterId
                          ).name
                        : ''
                    }}
                  </p>
                </div>
              </b-col>
            </b-row>
            <div class="academic-entry__info">
              Evaluate Student Grade
            </div>
            <b-row class="mb-3 text-center">
              <b-col md="12">
                <h5>Evaluation Form</h5>
                <!-- data.item.curriculum.name -->
                <div
                  v-if="!editCurriculum"
                  :class="!curriculum ? 'text-danger' : ''"
                >
                  <b>{{
                    curriculum
                      ? curriculum.name
                      : curriculumMsg
                      ? `There's no active curriculum set. Please set a curriculum`
                      : 'Nothing is Set'
                  }}</b
                  >&nbsp;
                  <b-link @click="editCurriculum = !editCurriculum">
                    [Change]
                  </b-link>
                </div>
                <b-form-select
                  class="w-50"
                  v-else
                  v-model="forms.transcriptRecord.fields.curriculumId"
                  @input="loadCurriculum()"
                >
                  <template v-slot:first>
                    <b-form-select-option :value="null" disabled
                      >-- Curriculum --</b-form-select-option
                    >
                  </template>
                  <b-form-select-option
                    v-for="curriculum in options.curriculums.items"
                    :key="curriculum.id"
                    :value="curriculum.id"
                  >
                    {{ curriculum.name }}
                  </b-form-select-option>
                </b-form-select>
              </b-col>
            </b-row>
            <b-row v-if="forms.transcriptRecord.fields.courseId === null">
              <b-col md="12">
                <b-row>
                  <b-col md="6">
                    <h5>
                      {{
                        forms.transcriptRecord.fields.levelId
                          ? options.levels.items.find(
                              (l) => l.id === forms.evaluation.fields.levelId
                            ).name
                          : ''
                      }}
                    </h5>
                  </b-col>
                </b-row>
                <b-table
                  class="mb-4"
                  outlined
                  responsive
                  show-empty
                  :fields="tables.transcriptRecordSubjects.fields"
                  :items="forms.transcriptRecord.fields.subjects"
                  :busy="tables.transcriptRecordSubjects.isBusy"
                >
                  <template v-slot:head(pivot.isTaken)>
                    <b-form-checkbox
                      @input="
                        toggleCheckAll(
                          forms.transcriptRecord.fields.subjects,
                          $event
                        )
                      "
                    >
                      Credited
                    </b-form-checkbox>
                  </template>
                  <template v-slot:cell(pivot.isTaken)="row">
                    <b-form-checkbox
                      :value="1"
                      :unchecked-value="0"
                      v-model="row.item.pivot.isTaken"
                    />
                  </template>
                  <template v-slot:table-busy>
                    <div class="text-center my-2">
                      <v-icon name="spinner" spin class="mr-2" />
                      <strong>Loading...</strong>
                    </div>
                  </template>
                  <template v-slot:cell(pivot.grade)="row">
                    <vue-autonumeric
                      v-model="row.item.pivot.grade"
                      class="form-control text-right"
                      :options="[
                        {
                          minimumValue: 0,
                          modifyValueOnWheel: false,
                          emptyInputBehavior: 0,
                        },
                      ]"
                    >
                    </vue-autonumeric>
                  </template>
                  <template v-slot:cell(pivot.notes)="row">
                    <b-form-input v-model="row.item.pivot.notes">
                    </b-form-input>
                  </template>
                  <template v-slot:cell(labs)="row">
                    {{
                      forms.evaluation.fields.schoolCategoryId ===
                      $options.SchoolCategories.VOCATIONAL.id
                        ? 'N/A'
                        : row.item.labs
                    }}
                  </template>
                  <template v-slot:cell(units)="row">
                    {{
                      forms.evaluation.fields.schoolCategoryId ===
                      $options.SchoolCategories.VOCATIONAL.id
                        ? 'N/A'
                        : row.item.units
                    }}
                  </template>
                  <template v-slot:custom-foot>
                    <b-tr>
                      <b-td colspan="5" class="text-right">
                        <span class="text-danger">Total Units </span>
                      </b-td>
                      <b-td class="text-center">
                        <span class="text-danger">
                          {{
                            forms.evaluation.fields.schoolCategoryId ===
                            $options.SchoolCategories.VOCATIONAL.id
                              ? 'N/A'
                              : totalUnits('transcriptRecord', 'units')
                          }}
                        </span>
                      </b-td>
                      <b-td class="text-center">
                        <span class="text-danger">
                          {{
                            forms.evaluation.fields.schoolCategoryId ===
                            $options.SchoolCategories.VOCATIONAL.id
                              ? 'N/A'
                              : totalUnits('transcriptRecord', 'labs')
                          }}
                        </span>
                      </b-td>
                      <b-td class="text-center">
                        <span class="text-danger">
                          {{
                            forms.evaluation.fields.schoolCategoryId ===
                            $options.SchoolCategories.VOCATIONAL.id
                              ? 'N/A'
                              : totalUnits('transcriptRecord', 'totalUnits')
                          }}
                        </span>
                      </b-td>
                    </b-tr>
                  </template>
                </b-table>
              </b-col>
            </b-row>
            <b-row v-else>
              <b-col md="12">
                <b-list-group>
                  <b-list-group-item
                    v-for="level in options.levelsOfCourse.items"
                    :key="level.id"
                  >
                    <div
                      v-b-toggle="'level' + level.id"
                      class="d-flex justify-content-between align-items-center"
                    >
                      <h5>{{ level.name }}</h5>
                      <span class="when-open">
                        <v-icon name="caret-down" />
                      </span>
                      <span class="when-closed">
                        <v-icon name="caret-left" />
                      </span>
                    </div>
                    <b-collapse
                      :id="'level' + level.id"
                      class="mt-2"
                      role="tabpanel"
                      active
                    >
                      <b-form-checkbox
                        class="mb-2"
                        @input="getSemesters(level, $event)"
                      >
                        Show All Semesters
                      </b-form-checkbox>
                      <div
                        v-for="semester in filterSemester(level)"
                        :key="semester.id"
                      >
                        <b-row>
                          <b-col md="9">
                            <h6>{{ semester.name }}</h6>
                          </b-col>
                          <b-col md="3"> </b-col>
                        </b-row>
                        <b-row>
                          <b-col md="12">
                            <b-table
                              responsive
                              hover
                              striped
                              show-empty
                              :items="
                                filterSubjects(level.id, semester.id).items
                              "
                              :fields="tables.transcriptRecordSubjects.fields"
                              :busy="tables.transcriptRecordSubjects.isBusy"
                            >
                              <template v-slot:table-busy>
                                <div class="text-center my-2">
                                  <v-icon name="spinner" spin class="mr-2" />
                                  <strong>Loading...</strong>
                                </div>
                              </template>
                              <template v-slot:cell(pivot.grade)="row">
                                <vue-autonumeric
                                  v-model="row.item.pivot.grade"
                                  class="form-control text-right"
                                  :options="[
                                    {
                                      minimumValue: 0,
                                      modifyValueOnWheel: false,
                                      emptyInputBehavior: 0,
                                    },
                                  ]"
                                >
                                </vue-autonumeric>
                              </template>
                              <template v-slot:cell(pivot.notes)="row">
                                <b-form-input v-model="row.item.pivot.notes">
                                </b-form-input>
                              </template>
                              <template v-slot:cell(labs)="row">
                                {{
                                  forms.evaluation.fields.schoolCategoryId ===
                                  $options.SchoolCategories.VOCATIONAL.id
                                    ? 'N/A'
                                    : row.item.labs
                                }}
                              </template>
                              <template v-slot:cell(units)="row">
                                {{
                                  forms.evaluation.fields.schoolCategoryId ===
                                  $options.SchoolCategories.VOCATIONAL.id
                                    ? 'N/A'
                                    : row.item.units
                                }}
                              </template>
                              <template v-slot:custom-foot>
                                <b-tr>
                                  <b-td colspan="5" class="text-right">
                                    <span class="text-danger"
                                      >Total Units
                                    </span>
                                  </b-td>
                                  <b-td class="text-center">
                                    <span class="text-danger">
                                      {{
                                        forms.evaluation.fields
                                          .schoolCategoryId ===
                                        $options.SchoolCategories.VOCATIONAL.id
                                          ? 'N/A'
                                          : totalUnits(
                                              'transcriptRecord',
                                              'units'
                                            )
                                      }}
                                    </span>
                                  </b-td>
                                  <b-td class="text-center">
                                    <span class="text-danger">
                                      {{
                                        forms.evaluation.fields
                                          .schoolCategoryId ===
                                        $options.SchoolCategories.VOCATIONAL.id
                                          ? 'N/A'
                                          : totalUnits(
                                              'transcriptRecord',
                                              'labs'
                                            )
                                      }}
                                    </span>
                                  </b-td>
                                  <b-td class="text-center">
                                    <span class="text-danger">
                                      {{
                                        forms.evaluation.fields
                                          .schoolCategoryId ===
                                        $options.SchoolCategories.VOCATIONAL.id
                                          ? 'N/A'
                                          : totalUnits(
                                              'transcriptRecord',
                                              'totalUnits'
                                            )
                                      }}
                                    </span>
                                  </b-td>
                                </b-tr>
                              </template>
                              <template v-slot:head(pivot.isTaken)>
                                <b-form-checkbox
                                  @input="
                                    toggleCheckAll(
                                      filterSubjects(level.id, semester.id)
                                        .items,
                                      $event
                                    )
                                  "
                                >
                                  Credited
                                </b-form-checkbox>
                              </template>
                              <template v-slot:cell(pivot.isTaken)="row">
                                <b-form-checkbox
                                  :value="1"
                                  :unchecked-value="0"
                                  v-model="row.item.pivot.isTaken"
                                />
                              </template>
                            </b-table>
                          </b-col>
                        </b-row>
                      </div>
                    </b-collapse>
                  </b-list-group-item>
                </b-list-group>
              </b-col>
            </b-row>
          </div>
          <div
            v-if="
              forms.academicRecord.fields.manualStepId ===
                $options.ManualSteps.SUBJECT_ENLISTMENT.id
            "
          >
            <div class="academic-entry__info">
              Student Information
            </div>
            <b-row>
              <b-col md="6">
                <div class="academic-entry__info-item">
                  <div class="mr-2 font-weight-bold">Student Number:</div>
                  <p>Awaiting Confirmation</p>
                </div>
              </b-col>
              <b-col md="6">
                <div class="academic-entry__info-item">
                  <div class="mr-2 font-weight-bold">Name:</div>
                  <p>{{ forms.student.fields.name }}</p>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="6">
                <div class="academic-entry__info-item">
                  <div class="mr-2 font-weight-bold">Email:</div>
                  <p>{{ forms.student.fields.email }}</p>
                </div>
              </b-col>
              <b-col md="6">
                <div class="academic-entry__info-item">
                  <div class="mr-2 font-weight-bold">Category :</div>
                  <p>
                    <b-badge
                      :variant="
                        forms.academicRecord.fields.studentCategoryId ===
                        $options.StudentCategories.NEW.id
                          ? 'success'
                          : forms.academicRecord.fields.studentCategoryId ===
                            $options.StudentCategories.OLD.id
                          ? 'primary'
                          : 'warning'
                      "
                    >
                      {{
                        forms.academicRecord.fields.studentCategoryId
                          ? $options.StudentCategories.getEnum(
                              forms.academicRecord.fields.studentCategoryId
                            ).name
                          : ''
                      }}
                    </b-badge>
                  </p>
                </div>
              </b-col>
            </b-row>
            <div class="academic-entry__info">
              Application for Current Academic Year
            </div>
            <b-row>
              <b-col md="6">
                <div class="academic-entry__info-item">
                  <div class="academic-entry__info-item">
                    <div class="mr-2 font-weight-bold">Level :</div>
                    <p>
                      {{
                        forms.academicRecord.fields.levelId
                          ? options.levels.items.find(
                              (l) =>
                                l.id === forms.academicRecord.fields.levelId
                            ).name
                          : ''
                      }}
                    </p>
                  </div>
                </div>
              </b-col>
              <b-col md="6">
                <div class="academic-entry__info-item">
                  <div class="academic-entry__info-item">
                    <div class="mr-2 font-weight-bold">School Year :</div>
                    <p>
                      {{
                        forms.academicRecord.fields.schoolYearId
                          ? options.schoolYears.items.find(
                              (sy) =>
                                sy.id ===
                                forms.academicRecord.fields.schoolYearId
                            ).name
                          : ''
                      }}
                    </p>
                  </div>
                </div>
              </b-col>
            </b-row>
            <b-row v-if="forms.academicRecord.fields.courseId">
              <b-col md="6">
                <div class="academic-entry__info-item">
                  <div class="mr-2 font-weight-bold">Course :</div>
                  <p>
                    {{
                      forms.academicRecord.fields.courseId
                        ? options.courses.items.find(
                            (c) => c.id === forms.academicRecord.fields.courseId
                          ).name
                        : ''
                    }}
                  </p>
                </div>
              </b-col>
              <b-col md="3">
                <div class="academic-entry__info-item">
                  <div class="mr-2 font-weight-bold">Semester :</div>
                  <p>
                    {{
                      forms.academicRecord.fields.semesterId
                        ? $options.Semesters.values.find(
                            (s) =>
                              s.id === forms.academicRecord.fields.semesterId
                          ).name
                        : ''
                    }}
                  </p>
                </div>
              </b-col>
            </b-row>
            <div class="academic-entry__info">
              Subjects
            </div>
            <div class="details__section-button-container">
              <div class="section__container">
                <b-form-group>
                  <label>Section</label>
                  <b-form-select
                    class="section-select"
                    v-model="forms.academicRecord.fields.sectionId"
                    @change="prePopulateStudentSubjects()"
                    :state="forms.academicRecord.states.academicRecordSectionId"
                  >
                    <template v-slot:first>
                      <b-form-select-option :value="null" disabled
                        >-- Section --</b-form-select-option
                      >
                    </template>
                    <b-form-select-option
                      v-for="section in options.sections.items"
                      :key="section.id"
                      :value="section.id"
                    >
                      {{ section.name }}
                    </b-form-select-option>
                  </b-form-select>
                  <b-form-invalid-feedback>
                    {{ forms.academicRecord.errors.academicRecordSectionId }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </div>
              <button
                class="btn btn-outline-primary add-subject-button"
                @click="onAddSubject()"
              >
                <v-icon name="plus-circle" /> ADD SUBJECT
              </button>
            </div>
            <b-table
              class="mb-4"
              hover
              outlined
              small
              responsive
              show-empty
              :fields="tables.subjects.fields"
              :items="forms.academicRecord.fields.subjects"
              :busy="tables.subjects.isBusy"
            >
              <template v-slot:cell(action)="row">
                <b-button
                  @click="removeSubject(row)"
                  size="sm"
                  variant="danger"
                >
                  <v-icon name="trash" />
                </b-button>
              </template>
              <template v-slot:cell(section)="row">
                <span>{{ row.item.section ? row.item.section.name : '' }}</span>
                <span>
                  <a
                    class="float-right"
                    href="#"
                    @click.prevent="onShowModalSection(row.item)"
                    >[Change]</a
                  >
                  <br />
                  <a
                    class="float-right"
                    href="#"
                    @click.prevent="onSectionSubjectClear(row)"
                    >[Clear]</a
                  >
                </span>
              </template>
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <v-icon name="spinner" spin class="mr-2" />
                  <strong>Loading...</strong>
                </div>
              </template>
              <template v-slot:custom-foot>
                <b-tr class="font-weight-bold">
                  <b-td colspan="2" class="text-right">
                    <span class="text-danger">Total Units </span>
                  </b-td>
                  <b-td class="text-center">
                    <span class="text-danger">
                      {{ totalUnits('academicRecord', 'units') }}
                    </span>
                  </b-td>
                  <b-td class="text-center">
                    <span class="text-danger">
                      {{ totalUnits('academicRecord', 'labs') }}
                    </span>
                  </b-td>
                  <b-td class="text-center">
                    <span class="text-danger">
                      {{ totalUnits('academicRecord', 'totalUnits') }}
                    </span>
                  </b-td>
                  <b-td colspan="2"></b-td>
                </b-tr>
              </template>
            </b-table>
          </div>
          <div class="academic-entry__action-bar">
            <b-button
              variant="outline-secondary"
              class="academic-entry__back-action"
              @click="
                forms.academicRecord.fields.manualStepId !==
                $options.ManualSteps.STUDENT_REGISTRATION.id
                  ? forms.academicRecord.fields.manualStepId--
                  : ''
              "
            >
              Back
            </b-button>
            <b-button
              @click="onSaveAcademicRecordApplication()"
              variant="primary"
              class="academic-entry__main-action mr-5"
            >
              <v-icon v-if="isProcessing" name="sync" class="mr-2" spin />
              Next
            </b-button>
          </div>
        </div>
      </div>
    </b-overlay>
    <b-modal
      v-model="showModalSubjects"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
      size="xl"
    >
      <div slot="modal-title">
        <!-- modal title -->
        Subjects
      </div>
      <!-- modal title -->
      <b-row>
        <!-- modal body -->
        <b-col md="12">
          <b-row class="mb-2">
            <b-col md="4">
              <!-- <b-form-select
                v-if="showDepartment"
                @change="filterByDepartment()"
                v-model="filters.subject.departmentId">
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled>-- Department --</b-form-select-option>
                </template>
                <b-form-select-option :value="null">None</b-form-select-option>
                <b-form-select-option
                  v-for="department in options.departments.items"
                  :key="department.id"
                  :value="department.id">
                  {{department.name}}
                </b-form-select-option>
              </b-form-select> -->
            </b-col>
            <b-col offset-md="4" md="4">
              <b-form-input
                v-model="filters.subject.criteria"
                type="text"
                placeholder="Search"
                @update="loadSubjects()"
              >
              </b-form-input>
            </b-col>
          </b-row>
          <b-table
            small
            hover
            outlined
            show-empty
            :items.sync="tables.subjects.items"
            :fields="tables.subjects.fields2"
            :busy="tables.subjects.isBusy2"
          >
            <template v-slot:cell(action)="row">
              <b-button @click="addSubject(row)" size="sm" variant="success">
                <v-icon name="plus" />
              </b-button>
            </template>
            <template v-slot:table-busy>
              <div class="text-center my-2">
                <v-icon name="spinner" spin class="mr-2" />
                <strong>Loading...</strong>
              </div>
            </template>
          </b-table>
          <b-row>
            <b-col md="6">
              Showing {{ paginations.subject.from }} to
              {{ paginations.subject.to }} of
              {{ paginations.subject.totalRows }} records.
            </b-col>
            <b-col md="6">
              <b-pagination
                v-model="paginations.subject.page"
                :total-rows="paginations.subject.totalRows"
                :per-page="paginations.subject.perPage"
                size="sm"
                align="end"
                @input="loadSubjects()"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <!-- modal body -->
      <div slot="modal-footer" class="w-100">
        <!-- modal footer buttons -->
        <b-button
          class="float-right"
          variant="outline-danger"
          @click="showModalSubjects = false"
        >
          Close
        </b-button>
      </div>
      <!-- modal footer buttons -->
    </b-modal>
    <b-modal
      v-model="showModalSection"
      size="xl"
      header-bg-variant="success"
      header-text-variant="light"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        <!-- modal title -->
        Select Section
      </div>
      <!-- modal title -->
      <b-row class="justify-content-md-center">
        <!-- modal body -->
        <b-col md="12">
          <b-table
            class="c-app__table"
            small
            hover
            outlined
            show-empty
            :items.sync="tables.sectionsOfSubjects.items"
            :fields="tables.sectionsOfSubjects.fields"
            :busy="tables.sectionsOfSubjects.isBusy"
            :current-page="paginations.sectionsOfSubject.page"
            :per-page="paginations.sectionsOfSubject.perPage"
          >
            <template v-slot:table-busy>
              <div class="text-center my-2">
                <v-icon name="spinner" spin class="mr-2" />
                <strong>Loading...</strong>
              </div>
            </template>
            <template v-slot:cell(schedule)="row">
              <span>
                {{ row.item.schedules[0].personnel.name }}
              </span>
              <br />
              <span
                v-for="schedule in row.item.schedules"
                :key="schedule.id"
                class="item"
              >
                <small>{{
                  `${$options.Days.getEnum(schedule.dayId).abbrev} - Time: ${
                    schedule.startTime
                  } - ${schedule.endTime}`
                }}</small>
              </span>
            </template>
            <template v-slot:cell(action)="row">
              <b-button @click="onChangeSection(row)" variant="success">
                <v-icon name="check" />
              </b-button>
            </template>
          </b-table>
          <b-row>
            <b-col md="6">
              Showing {{ paginations.sectionsOfSubject.from }} to
              {{ paginations.sectionsOfSubject.to }} of
              {{ paginations.sectionsOfSubject.totalRows }} records.
            </b-col>
            <b-col md="6">
              <b-pagination
                v-model="paginations.sectionsOfSubject.page"
                :total-rows="paginations.sectionsOfSubject.totalRows"
                :per-page="paginations.sectionsOfSubject.perPage"
                size="sm"
                align="end"
                @input="recordDetails(paginations.sectionsOfSubject)"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <!-- modal body -->
      <div slot="modal-footer" class="w-100">
        <!-- modal footer buttons -->
        <b-button
          class="float-right"
          variant="outline-danger"
          @click="showModalSection = false"
        >
          Close
        </b-button>
      </div>
      <!-- modal footer buttons -->
    </b-modal>
  </div>
</template>
<script>
import AvatarMaker from '../../components/AvatarMaker';
import {
  Semesters,
  CivilStatuses,
  SchoolCategories,
  ManualSteps,
  StudentCategories,
  TranscriptRecordStatuses,
  Days,
  EvaluationStatuses,
  StudentFeeStatuses,
  ApplicationStatuses,
  ApplicationSteps,
  AcademicRecordStatuses,
} from '../../../helpers/enum';
import {
  CourseApi,
  CurriculumApi,
  LevelApi,
  SchoolYearApi,
  StudentApi,
  SectionApi,
  SubjectApi,
  AcademicRecordApi,
  EvaluationApi,
  TranscriptRecordApi,
} from '../../../mixins/api';
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead';
import { debounce } from 'lodash';
import { copyValue } from '../../../helpers/extractor';
import {
  clearFields,
  reset,
  showNotification,
  validate,
} from '../../../helpers/forms';

export default {
  components: { AvatarMaker, VueBootstrapTypeahead },
  mixins: [
    LevelApi,
    CourseApi,
    SchoolYearApi,
    StudentApi,
    CurriculumApi,
    SectionApi,
    SubjectApi,
    AcademicRecordApi,
    EvaluationApi,
    TranscriptRecordApi,
  ],
  props: {
    showEntry: Boolean,
    entryMode: String,
    isLoading: Boolean,
    isProcessing: Boolean,
    forms: Object,
  },
  Semesters,
  CivilStatuses,
  SchoolCategories,
  ManualSteps,
  StudentCategories,
  TranscriptRecordStatuses,
  Days,
  EvaluationStatuses,
  StudentFeeStatuses,
  ApplicationStatuses,
  ApplicationSteps,
  AcademicRecordStatuses,
  data() {
    return {
      studentQuery: null,
      isExisting: false,
      schoolCategoryId: null,
      editCurriculum: false,
      editStudentCurriculum: false,
      showModalSubjects: false,
      showModalSection: false,
      tables: {
        transcriptRecordSubjects: {
          isBusy: false,
          fields: [
            {
              key: 'pivot.isTaken',
              label: 'Credited',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '120px' },
            },
            {
              key: 'pivot.grade',
              label: 'Grade',
              tdClass: 'align-middle',
              thStyle: { width: '10%' },
            },
            {
              key: 'pivot.notes',
              label: 'Remarks',
              tdClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'name',
              label: 'Subject',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
              formatter: (value, key, item) => {
                return `${value} - ${item.description}`;
              },
            },
            // {
            // 	key: "description",
            // 	label: "Description",
            // 	tdClass: "align-middle",
            // 	thStyle: {width: "auto"}
            // },
            {
              key: 'prerequisites',
              label: 'Prerequisites',
              tdClass: 'align-middle',
              thStyle: { width: '15%' },
              formatter: (value, key, item) => {
                if (value.length > 0) {
                  return value
                    .map((subject) => {
                      return subject.name;
                    })
                    .join(', ');
                }
                return '';
              },
            },
            {
              key: 'units',
              label: 'Lec',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '6%' },
            },
            {
              key: 'labs',
              label: 'Lab',
              tdClass: 'align-middle text-center',
              thClass: 'text-right',
              thStyle: { width: '6%' },
            },
            {
              key: 'totalUnits',
              label: 'Total Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
          ],
          items: [],
          filteredItems: [],
        },
        subjects: {
          isBusy: false,
          fields: [
            // {
            // 	key: "code",
            // 	label: "Code",
            // 	tdClass: "align-middle",
            // 	thStyle: {width: "6%"}
            // },
            {
              key: 'name',
              label: 'Subject Code',
              tdClass: 'align-middle',
              thStyle: { width: '12%' },
            },
            {
              key: 'description',
              label: 'Description',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'units',
              label: 'Lec Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-right text-center',
              thStyle: { width: '8%' },
            },
            // {
            // 	key: "amountPerUnit",
            // 	label: "Amount per Lec Unit",
            // 	tdClass: "align-middle text-right",
            // 	thClass: "text-right",
            // 	thStyle: {width: "16%"}
            // },
            {
              key: 'labs',
              label: 'Lab Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-right',
              thStyle: { width: '8%' },
            },
            // {
            // 	key: "amountPerLab",
            // 	label: "Amount per Lab",
            // 	tdClass: "align-middle text-right",
            // 	thClass: "text-right",
            // 	thStyle: {width: "13%"}
            // },
            {
              key: 'totalUnits',
              label: 'Total Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '12%' },
            },
            {
              key: 'section',
              label: 'Section',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              thStyle: { width: '20%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '5%' },
            },
          ],
          fields2: [
            {
              key: 'name',
              label: 'Subject Code',
              tdClass: 'align-middle',
              thStyle: { width: '12%' },
            },
            {
              key: 'description',
              label: 'Description',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'units',
              label: 'Lec Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-right text-center',
              thStyle: { width: '8%' },
            },
            {
              key: 'labs',
              label: 'Lab Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-right',
              thStyle: { width: '8%' },
            },
            {
              key: 'totalUnits',
              label: 'Total Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '12%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '5%' },
            },
          ],
          items: [],
        },
        sectionsOfSubjects: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'SECTION',
              tdClass: 'align-middle ',
              thClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'level.name',
              label: 'LEVEL',
              tdClass: 'align-middle ',
              thClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'course.name',
              label: 'COURSE',
              tdClass: 'align-middle ',
              thClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'semester.name',
              label: 'SEMESTER',
              tdClass: 'align-middle ',
              thClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'schedule',
              label: 'SCHEDULE',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              thStyle: { width: 'AUTO' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '5%' },
            },
          ],
          items: [],
        },
        scheduledSubjects: {
          isBusy: false,
          fields: [
            {
              key: 'isAllowed',
              label: 'Allowed',
              thClass: 'align-middle',
              tdClass: 'align-middle text-center',
              thStyle: { width: '25px' },
            },
            {
              key: 'subject',
              label: 'SUBJECT',
              tdClass: 'align-middle ',
              thClass: 'align-middle',
              thStyle: { width: '20%' },
            },
            {
              key: 'schedule',
              label: 'SCHEDULE',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              thStyle: { width: 'auto', minWidth: '500px' },
            },
            {
              key: 'units',
              label: 'Lec Units',
              tdClass: 'align-middle text-right',
              thClass: 'align-middle text-right',
              thStyle: { width: '8%' },
            },
            {
              key: 'labs',
              label: 'Lab Units',
              tdClass: 'align-middle text-right',
              thClass: 'align-middle text-right',
              thStyle: { width: '8%' },
            },
            {
              key: 'totalUnits',
              label: 'TOTAL UNITS',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '8%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '5%' },
            },
          ],
          items: [],
        },
      },
      options: {
        levels: {
          items: [],
        },
        levelsOfCourse: {
          items: [],
        },
        schoolYears: {
          items: [],
        },
        courses: {
          items: [],
        },
        students: {
          items: [],
        },
        curriculums: {
          items: [],
        },
        sections: {
          items: [],
        },
      },
      paginations: {
        subject: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
        scheduledSubject: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
        sectionsOfSubject: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        subject: {
          criteria: null,
          schoolCategoryId: null,
        },
        scheduledSubject: {
          criteria: null,
          levelId: null,
          courseId: null,
          semesterId: null,
          sectionId: null,
          schoolCategory: null,
        },
        sectionsOfSubject: {
          criteria: null,
        },
      },
      filters: {
        subject: {
          criteria: null,
          schoolCategoryId: null,
        },
      },
      curriculumMsg: false,
      studentCurriculum: null,
      curriculum: null,
      selectedLevelSubject: null,
    };
  },
  created() {
    this.loadLevels();
    this.loadSchoolYears();
    this.loadCourses();
  },
  methods: {
    loadSections() {
      const {
        schoolYearId,
        courseId,
        levelId,
        semesterId,
      } = this.forms.academicRecord.fields;
      let params = {
        paginate: false,
        schoolYearId,
        courseId,
        levelId,
        semesterId,
      };
      this.getSectionList(params).then(({ data }) => {
        this.options.sections.items = data;
      });
    },
    loadLevels() {
      const { levels } = this.options;
      const params = { paginate: false };
      this.getLevelList(params).then(({ data }) => {
        levels.items = data;
      });
    },
    loadSchoolYears() {
      const { schoolYears } = this.options;
      const params = { paginate: false };
      this.getSchoolYearList(params).then(({ data }) => {
        schoolYears.items = data;
      });
    },
    loadCourses() {
      const { courses } = this.options;
      const params = { paginate: false };
      this.getCourseList(params).then(({ data }) => {
        courses.items = data;
      });
    },
    loadStudents() {
      const { students } = this.options;
      const { studentQuery } = this.studentQuery;
      const params = {
        paginate: false,
        criteria: studentQuery,
      };
      this.getStudentList(params).then(({ data }) => {
        students.items = data;
      });
    },
    loadCurriculum() {
      const { fields } = this.forms.transcriptRecord;
      const { subjects } = this.tables;
      subjects.isBusy = true;
      this.getCurriculum(fields.curriculumId).then(({ data }) => {
        this.curriculum = data;
        const newSubjects = data.subjects.map((obj) => ({
          ...obj,
          pivot: { ...obj.pivot, isTaken: 0, grade: 0, notes: '' },
        }));
        fields.subjects = newSubjects;
        subjects.isBusy = false;
        // this.$set(row.item, 'isTakenAll', false)
        // this.$set(row.item, 'subjects', newSubjects)
        // if (row.item.courseId) {
        //   this.loadLevelsOfCourse(row)
        // } else {
        //   row.item.isLoading = false
        // }
        // subjects.isBusy = false
      });
    },
    loadStudentCurriculum() {
      const { fields } = this.forms.transcriptRecord;
      this.getCurriculum(fields.studentCurriculumId).then(({ data }) => {
        this.studentCurriculum = data;
        // this.$set(row.item, 'isTakenAll', false)
        // this.$set(row.item, 'subjects', newSubjects)
        // if (row.item.courseId) {
        //   this.loadLevelsOfCourse(row)
        // } else {
        //   row.item.isLoading = false
        // }
        // subjects.isBusy = false
      });
    },
    loadCurriculumList() {
      const {
        fields,
        fields: { schoolCategoryId, courseId, levelId },
      } = this.forms.transcriptRecord;
      const { curriculums } = this.options;
      const params = { paginate: false, schoolCategoryId, courseId, levelId };
      this.getCurriculumList(params).then(({ data }) => {
        curriculums.items = data;
        if (data.length > 0) {
          if (fields.curriculumId === null) {
            const activeCurriculum = data.find((c) => c.active === 1);
            if (activeCurriculum) {
              fields.curriculumId = activeCurriculum.id;
              if (
                fields.studentCategoryId === StudentCategories.NEW.id ||
                !fields.studentCurriculumId
              ) {
                fields.studentCurriculumId = activeCurriculum.id;
                this.studentCurriculum = activeCurriculum;
              }
            } else {
              this.curriculumMsg = true;
              return;
            }
          }
          this.loadCurriculum();
          this.loadStudentCurriculum();
        } else {
          this.curriculumMsg = true;
        }
      });
    },
    getStudentInfo(student) {
      // check if student has active manual registration
      if (student.latestManualAcademicRecord) {
        showNotification(this, 'danger', 'Student had existing application.');
        return;
      }
      this.isExisting = false;
      const {
        student: { fields: studentFields },
        user,
      } = this.forms;
      copyValue(student, studentFields);
      user.fields.username = student.user.username;
      studentFields.studentCategoryId = this.$options.StudentCategories.OLD.id;
    },
    getSchoolCategoryId() {
      const { fields } = this.forms.academicRecord;
      const { items } = this.options.levels;
      const level = items.find((l) => l.id === fields.levelId);
      fields.schoolCategoryId = level.schoolCategoryId;
    },
    onSaveAcademicRecordApplication() {
      const {
        student: { fields: student },
        student: studentForm,
        user: { fields: user },
        user: userForm,
        academicRecord: { fields: academicRecord },
        academicRecord: academicRecordForm,
        evaluation: { fields: evaluation },
        evaluation: evaluationForm,
        transcriptRecord: { fields: transcriptRecord },
        transcriptRecord: transcriptRecordForm,
      } = this.forms;
      const {
        ManualSteps,
        TranscriptRecordStatuses,
        EvaluationStatuses,
        StudentFeeStatuses,
        ApplicationStatuses,
        ApplicationSteps,
        AcademicRecordStatuses,
      } = this.$options;
      reset(studentForm);
      reset(userForm);
      reset(academicRecordForm);
      reset(evaluationForm);
      reset(transcriptRecordForm);
      if (academicRecord.manualStepId === ManualSteps.STUDENT_REGISTRATION.id) {
        const { id, ...evaluationFields } = evaluation;
        const {
          id: transcriptRecordId,
          subjects,
          ...transcriptRecordFields
        } = transcriptRecord;
        student.email = user.username;
        copyValue(academicRecord, evaluation, Object.keys(evaluationFields));
        copyValue(
          academicRecord,
          transcriptRecord,
          Object.keys(transcriptRecordFields)
        );

        const { sectionId, ...academicRecordDataSet } = academicRecord;

        const data = {
          ...student,
          user,
          academicRecord: {
            ...academicRecordDataSet,
            manualStepId: ManualSteps.EVALUATION.id,
            isManual: 1,
          },
          transcriptRecord: {
            ...transcriptRecord,
            transcriptRecordStatusId: TranscriptRecordStatuses.DRAFT.id,
          },
          evaluation: {
            ...evaluation,
            evaluationStatusId: EvaluationStatuses.APPROVED.id,
          },
        };
        this.manualRegisterStudent(data)
          .then(({ data }) => {
            const {
              latestManualAcademicRecord: academicRecordData,
              evaluation: evaluationData,
              activeTranscriptRecord,
              ...studentData
            } = data;
            copyValue(studentData, student);
            copyValue(academicRecordData, academicRecord);
            copyValue(evaluationData, evaluation);
            copyValue(activeTranscriptRecord, transcriptRecord);
            transcriptRecord.subjects = [];
            this.loadCurriculumList();
            this.loadLevelsOfCourse();
          })
          .catch((error) => {
            // academicRecord.isProcessing = false
            const errors = error.response.data.errors;
            validate(studentForm, errors);
            validate(userForm, errors);
            validate(academicRecordForm, errors);
          });
      } else if (academicRecord.manualStepId === ManualSteps.EVALUATION.id) {
        const { subjects, ...transcriptData } = transcriptRecord;
        evaluation.curriculumId = transcriptData.curriculumId;
        evaluation.studentCurriculumId = transcriptData.studentCurriculumId;
        const subjectData = subjects.map((s) => {
          return {
            subjectId: s.id,
            levelId: s.pivot.levelId,
            semesterId: s.pivot.semesterId,
            grade: s.pivot.grade,
            notes: s.pivot.notes,
            isTaken: s.pivot.isTaken,
          };
        });

        const { sectionId, ...academicRecordDataSet } = academicRecord;

        const data = {
          ...student,
          evaluation: {
            ...evaluation,
            evaluationStatusId: EvaluationStatuses.APPROVED.id,
          },
          transcriptRecord: transcriptData,
          transcriptRecordSubjects: subjectData,
          academicRecord: {
            ...academicRecordDataSet,
            curriculumId: evaluation.curriculumId,
            manualStepId: ManualSteps.SUBJECT_ENLISTMENT.id,
          },
        };
        this.manualRegisterStudent(data)
          .then(({ data }) => {
            const {
              latestManualAcademicRecord: academicRecordData,
              evaluation: evaluationData,
              activeTranscriptRecord,
              ...studentData
            } = data;
            copyValue(studentData, student);
            copyValue(academicRecordData, academicRecord);
            copyValue(evaluationData, evaluation);
            copyValue(activeTranscriptRecord, transcriptRecord);
            academicRecord.subjects = [];
            this.loadSections();
            // this.loadCurriculumList();
            // this.loadLevelsOfCourse();
          })
          .catch((error) => {
            // academicRecord.isProcessing = false
            const errors = error.response.data.errors;
            validate(studentForm, errors);
            validate(userForm, errors);
            validate(academicRecordForm, errors);
          });
      } else if (
        academicRecord.manualStepId === ManualSteps.SUBJECT_ENLISTMENT.id
      ) {
        const { subjects, ...academicRecordData } = academicRecord;
        const subjectData = subjects.map((s) => {
          return {
            subjectId: s.id,
            sectionId: s.pivot.sectionId,
          };
        });

        const studentFee = {
          schoolYearId: academicRecord.schoolYearId,
          semesterId: academicRecord.semesterId,
          levelId: academicRecord.levelId,
          courseId: academicRecord.courseId,
          studentFeeStatusId: StudentFeeStatuses.DRAFT.id,
          academicRecordId: academicRecord.id,
        };

        const application = {
          applicationStatusId: ApplicationStatuses.SUBMITTED.id,
          schoolYearId: academicRecord.schoolYearId,
          applicationStepId: ApplicationSteps.STATUS.id,
        };

        const data = {
          ...student,
          academicRecordSubjects: subjectData,
          academicRecord: {
            ...academicRecordData,
            academicRecordStatusId: AcademicRecordStatuses.FINALIZED.id,
            manualStepId: ManualSteps.COMPLETED.id,
          },
          studentFee,
          application,
        };
        this.manualRegisterStudent(data)
          .then(({ data }) => {
            this.$emit('onCompleted');
          })
          .catch((error) => {
            // academicRecord.isProcessing = false
            const errors = error.response.data.errors;
            validate(studentForm, errors);
            validate(academicRecordForm, errors);
          });
      }
    },
    getName(item, child) {
      if (item) {
        let value = item[child];
        if (value) {
          return value['name'];
        }
      }
      return '';
    },
    getSemesters(level, event) {
      this.$set(level, 'isShowAll', event);
    },
    filterSemester(level) {
      let defaultSemesters = this.$options.Semesters.values.slice(0, 2);
      if (level.isShowAll) {
        return this.$options.Semesters.values;
      } else {
        const { subjects } = this.forms.transcriptRecord.fields;
        let filteredSubjects = subjects.filter(
          (subject) => subject.pivot.levelId === level.id
        );
        let distinctSemesters = [
          ...new Set(filteredSubjects.map((x) => x.pivot.semesterId)),
        ];
        distinctSemesters.forEach((d) => {
          if (d) {
            if (!defaultSemesters.map((x) => x.id).includes(d)) {
              defaultSemesters.push(Semesters.getEnum(d));
            }
          }
        });
        return defaultSemesters;
      }
    },
    loadLevelsOfCourse() {
      let params = { paginate: false };
      const { courseId } = this.forms.evaluation.fields;
      const { levelsOfCourse } = this.options;
      this.getLevelsOfCourse(1, params).then(({ data }) => {
        levelsOfCourse.items = data;
      });
    },
    filterSubjects(levelId, semesterId = null) {
      const { subjects } = this.forms.transcriptRecord.fields;
      let filteredSubjects = subjects.filter(
        (subject) =>
          subject.pivot.levelId === levelId &&
          subject.pivot.semesterId === semesterId
      );
      const data = { items: filteredSubjects, isTakenAll: false };
      return data;
    },
    toggleCheckAll(subjects, value) {
      subjects.forEach((subject) => {
        subject.pivot.isTaken = value ? 1 : 0;
      });
    },
    onShowModalSection(subject) {
      this.showModalSection = true;
      const { sectionsOfSubjects } = this.tables;
      const { sectionsOfSubject } = this.paginations;
      const { id: subjectId } = subject;
      const { schoolYearId } = this.forms.academicRecord.fields;

      this.selectedLevelSubject = null;
      this.selectedLevelSubject = subject;

      const params = { paginate: false, subjectId, schoolYearId };
      sectionsOfSubjects.isBusy = true;

      this.getSectionsOfSubject(params, subjectId)
        .then(({ data }) => {
          sectionsOfSubjects.items = data;
          sectionsOfSubject.totalRows = data.length;
          this.recordDetails(sectionsOfSubject);
          sectionsOfSubjects.isBusy = false;
        })
        .catch((error) => {
          sectionsOfSubjects.isBusy = false;
        });
    },
    onSectionSubjectClear(row) {
      this.$set(row.item.pivot, 'sectionId', null);
      this.$set(row.item, 'section', null);
    },
    onChangeSection(row) {
      // const { subjects } = this.tables
      this.$set(this.selectedLevelSubject.pivot, 'sectionId', row.item.id);
      this.$set(this.selectedLevelSubject, 'section', {
        id: row.item.id,
        name: row.item.name,
      });
      this.showModalSection = false;
    },
    prePopulateStudentSubjects() {
      const {
        fields,
        fields: { sectionId },
      } = this.forms.academicRecord;
      const { curriculumId } = this.forms.transcriptRecord.fields;
      const params = { paginate: false, curriculumId };

      if (!sectionId) {
        fields.subjects = [];
        return;
      }

      this.getSectionScheduledSubjectsWithStatus(params, sectionId).then(
        ({ data }) => {
          const allowedSubjects = data.filter((s) => s.isAllowed === true);
          fields.subjects = allowedSubjects;
          const section = this.options.sections.items.find(
            (s) => s.id === sectionId
          );
          fields.subjects.forEach((item) => {
            this.$set(item, 'pivot', {
              sectionId: section ? section.id : null,
            });
            this.$set(item, 'section', section ? section : null);
          });
        }
      );
    },
    onAddSubject(row) {
      const { schoolCategoryId } = this.forms.academicRecord.fields;
      this.showModalSubjects = true;
      this.filters.subject.criteria = null;
      this.filters.subject.schoolCategoryId = schoolCategoryId;
      this.loadSubjects();
    },
    addSubject(row) {
      const { item } = row;
      const { fields } = this.forms.academicRecord;
      const result = fields.subjects.find((subject) => subject.id === item.id);
      if (result) {
        showNotification(this, 'danger', item.name + ' is already added.');
        return;
      }
      this.$set(item, 'pivot', {});
      this.$set(item.pivot, 'sectionId', null);
      fields.subjects.push(item);
    },
    removeSubject(subjects, row) {
      const { fields } = this.forms.academicRecord;
      fields.subjects.splice(row.index, 1);
    },
    loadSubjects() {
      const { subjects } = this.tables;
      const { criteria, schoolCategoryId } = this.filters.subject;
      const {
        subject,
        subject: { perPage, page },
      } = this.paginations;
      subjects.items = [];
      const { SchoolCategories } = this.$options;

      subjects.isBusy2 = true;
      let params = {
        paginate: true,
        schoolCategoryId,
        perPage,
        page,
        criteria,
      };

      this.getSubjectList(params).then(({ data }) => {
        subjects.items = data.data;
        subject.from = data.meta.from;
        subject.to = data.meta.to;
        subject.totalRows = data.meta.total;
        subjects.isBusy2 = false;
      });
    },
  },
  computed: {
    totalUnits() {
      return (form, field) => {
        let units = 0;
        const { subjects } = this.forms[form].fields;
        if (subjects) {
          subjects.forEach((s) => {
            units += Number(s[field]);
          });
        }
        return units;
      };
    },
  },
  watch: {
    studentQuery: debounce(function() {
      this.loadStudents();
    }, 500),
    showEntry(value) {
      if (value) {
        if (this.entryMode === 'Add') {
          const {
            evaluation,
            academicRecord: { fields: academicRecord },
            student: { fields: student },
            user: { fields: user },
          } = this.forms;
          clearFields(evaluation);
          clearFields(academicRecord);
          clearFields(student);
          clearFields(user);
          academicRecord.subjects = [];
          academicRecord.manualStepId = 1;
          academicRecord.studentCategoryId = this.$options.StudentCategories.NEW.id;
        } else {
          const {
            academicRecord: { fields: academicRecord },
            evaluation: { fields: evaluation },
            transcriptRecord: { fields: transcriptRecord },
            student: { fields: student },
            user: { fields: user },
          } = this.forms;
          this.getAcademicRecord(academicRecord.id).then(({ data }) => {
            const { student: studentData } = data;
            copyValue(data, academicRecord);
            copyValue(studentData, student);
            user.username = student.email;
            const {
              schoolCategoryId,
              courseId,
              levelId,
              semesterId,
              studentId,
            } = data;
            const params = {
              schoolCategoryId,
              courseId,
              levelId,
              semesterId,
              studentId,
              paginate: false,
            };
            this.getEvaluationList(params).then(({ data }) => {
              const { transcriptRecord: transcriptRecordData } = data[0];
              copyValue(data[0], evaluation);
              copyValue(transcriptRecordData, transcriptRecord);

              this.getSubjectsOfTranscriptRecord(transcriptRecord.id, {
                paginate: false,
              }).then(({ data }) => {
                transcriptRecord.subjects = data;
                this.loadCurriculumList();
                this.loadLevelsOfCourse();
                this.loadSections();
              });
            });
          });
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/shared.scss';

.academic-entry__container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: $white;
  z-index: 3;
  overflow: auto;
}

.academic-entry__header {
  background-color: $light-gray-100;
  border-bottom: 1px solid $brand-border-color;
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 60px;
  z-index: 2;
}

.academic-entry__header-actions {
  width: 260px;
  padding-left: 20px;
  height: 100%;
  padding-top: 18px;

  @include for-size(tablet-landscape-down) {
    display: none;
  }
}

.academic-entry__header-action-back {
  border: 0;
  outline: 0;
  padding: 0;
  margin: 0;
  color: $dark-gray;
  margin: auto 15px;
  font-size: 16px;
  font-weight: 500;

  svg {
    margin-right: 20px;
  }

  &:hover {
    color: $dark-gray-500;
  }
}

.academic-entry__main-body {
  display: flex;
  flex-direction: column;
  position: relative;
}

.academic-entry__body {
  width: 100%;
  display: flex;
  overflow: auto;
  margin-top: 69px;
}

.academic-entry__side-nav {
  width: 260px;
  min-height: 100vh;
  @include for-size(tablet-landscape-down) {
    display: none;
  }
}

.academic-entry__content {
  flex: 1;
  padding: 40px;
  position: relative;
  border-left: 1px solid $brand-border-color;
  background-color: $light-gray;
}

.academic-entry__right-action {
  border: 0;
  background-color: none;
  outline: 0;
  padding: 2px;
  color: $dark-gray;
}

.academic-entry__header-right-actions {
  flex: 0;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 10px;
  position: relative;
}

.academic-entry__header-dropdown-container {
  position: absolute;
  top: 40px;
  width: 150px;
  background-color: $white;
  border: 1px solid $gray;
  border-radius: 3px;
  padding: 5px 0;
  right: 15px;
}

.academic-entry__header-dropdown {
  list-style: none;
  padding: 0;
  margin: 0;
}

.academic-entry__header-dropdown-item {
  padding: 5px 15px;
  cursor: pointer;

  &:hover {
    background-color: $light-gray-100;
  }
}

.academic-entry__headline-container {
  display: flex;
  align-items: center;
}

.academic-entry__headline-highlight {
  display: inline-flex;
  align-items: center;
  background-color: $light-orange;
  flex: 0 1 auto;
  border-radius: 32px;
  height: 32px;
}

.academic-entry__headline-number {
  height: 32px;
  width: 32px;
  border-radius: 50%;
  background-color: $orange;
  font-size: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $white;
  z-index: 1;
}

.academic-entry__headline-text {
  font-size: 14px;
  margin: 0 20px 0 10px;
  font-weight: 500;
}

.academic-entry__quick-links-container {
  position: fixed;
  width: 260px;
  min-height: 100vh;
  left: 0;
  bottom: 0;
  top: 100px;
  padding: 5px 10px;
}

.academic-entry__quick-links {
  list-style: none;
  padding: 0;
}

.academic-entry__quick-links-item {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  padding: 6px 15px;
  border-radius: 3px;
  margin-bottom: 4px;

  &.active {
    background-color: $light-blue;
    color: $dark-gray-600;
    font-weight: 500;
  }

  // &:hover {
  //   background-color: $light-blue;
  // }
}

.academic-entry__header-details-container {
  padding: 7px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
  border-left: 1px solid $brand-border-color;
}

.academic-entry__header-details {
  display: flex;
  flex-direction: column;
  margin: 0 10px;
  justify-content: center;
}

.academic-entry__header-name {
  margin: 0;
  font-weight: 500;
}

.academic-entry__header-email {
  margin: 0;
  color: $light-text-color;
  font-size: 13px;
}

.academic-entry__form-container {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 30px;
}
.academic-entry__action-bar {
  position: sticky;
  height: 60px;
  background-color: $white;
  bottom: 0;
  left: 0;
  right: 0;
  width: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid $brand-border-color;
}

.academic-entry__back-action {
  min-width: 140px;

  @include for-size(phone-only) {
    min-width: 80px;
  }
}

.academic-entry__main-action {
  margin-left: auto;
  min-width: 160px;

  @include for-size(phone-only) {
    min-width: 80px;
  }
}

.academic-entry__info {
  width: 100%;
  border-bottom: 1px solid $gray;
  font-size: 18px;
  font-style: italic;
  font-weight: 600;
  margin-bottom: 10px;
}

.academic-entry__info-item {
  flex: 50%;

  @include for-size(phone-only) {
    flex: 100%;
  }
}

.academic-entry__form {
  margin-left: 10px;
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
.details__section-button-container {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  @include for-size(phone-only) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.add-subject-button {
  width: 175px;

  @include for-size(phone-only) {
    width: 100%;
  }
}

.section__container {
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 10px;

  label {
    margin-right: 10px;
  }

  .section-select {
    width: 200px;
  }

  @include for-size(phone-only) {
    flex-direction: column;
    align-items: flex-start;
    margin-right: 0;
    margin-bottom: 10px;
    width: 100%;

    .section-select {
      width: 100%;
    }
  }
}
</style>
