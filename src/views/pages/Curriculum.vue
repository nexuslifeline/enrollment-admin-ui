<template>
  <PageContent
    title="Curriculum Management"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadCurriculums"
    :filterVisible="isFilterVisible"
    @create="setCreate()"
    :createButtonVisible="isAccessible($options.CurriculumPermissions.ADD.id) && checkIfHasSchoolCategoryAccess()">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.curriculum.criteria"
        debounce="500"
        type="text"
        placeholder="Search"
      />
      <!--<v-select
        :options="options.schoolCategories.values"
        :value="filters.curriculum.schoolCategoryItem"
        @input="onCategoryFilterChange"
        label="name"
        placeholder="School Category"
        class="mt-2"
        :searchable="checkIfAllowedAll() || checkIfSuperUser()"
        :selectable="option =>  checkIfSuperUser() || isAccessibleSchoolCategory(option.id)"
        :clearable="checkIfAllowedAll()"
      />-->
      <SelectCategory
        :value="filters.curriculum.schoolCategoryItem"
        @input="onCategoryFilterChange"
        label="name"
        placeholder="School Category"
        class="mt-2"
      />
      <!-- <v-select
        :options="options.levels.fixItems"
        :value="filters.curriculum.levelItem"
        @input="onLevelFilterChange"
        label="name"
        placeholder="Level"
        class="mt-2"
      /> -->
      <v-select
        v-if="isCourseVisible"
        :options="options.courses.fixItems"
        :value="filters.curriculum.courseItem"
        @input="onCourseFilterChange"
        label="name"
        placeholder="Course"
        class="mt-2"
      />
    </template>
    <template v-slot:content>
      <!-- <SchoolCategoryTabs
        :showAll="true"
        @loadSchoolCategoryId="
          (filters.curriculum.schoolCategoryId = $event), loadCurriculums()
        "
        @clickAll="
          (filters.curriculum.schoolCategoryId = null),
            loadCurriculums(),
            loadLevelList(),
            loadCourseList()
        "
        @click="
          (filters.curriculum.schoolCategoryId = $event),
            loadCurriculums(),
            loadLevelList(),
            loadCourseList()
        "
      /> -->
      <div v-show="!showEntry && checkIfHasSchoolCategoryAccess()" >
        <div>
          <!-- <b-row class="mb-3">
            <b-col md="12">
              <b-row>
                <b-col md="3" class="bottom-space">
                  <b-button
                    v-if="isAccessible($options.CurriculumPermissions.ADD.id)"
                    variant="primary"
                    @click="setCreate()"
                  >
                    <v-icon name="plus-circle" /> ADD NEW CURRICULUM
                  </b-button>
                </b-col>
                <b-col md="3">
                  <b-form-select
                    :disabled="
                      ![
                        options.schoolCategories.COLLEGE.id,
                        options.schoolCategories.SENIOR_HIGH_SCHOOL.id,
                        options.schoolCategories.VOCATIONAL.id,
                        options.schoolCategories.GRADUATE_SCHOOL.id,
                      ].includes(filters.curriculum.schoolCategoryId)
                    "
                    @change="loadCurriculums()"
                    v-model="filters.curriculum.courseId"
                    class="float-right"
                  >
                    <template v-slot:first>
                      <b-form-select-option :value="null" disabled
                        >-- Course --</b-form-select-option
                      >
                    </template>
                    <b-form-select-option :value="null"
                      >None</b-form-select-option
                    >
                    <b-form-select-option
                      v-for="course in options.courses.fixItems"
                      :key="course.id"
                      :value="course.id"
                    >
                      {{ course.name }}
                    </b-form-select-option>
                  </b-form-select>
                </b-col>
                <b-col md="3">
                  <b-form-select
                    :disabled="
                      ![
                        options.schoolCategories.PRE_SCHOOL.id,
                        options.schoolCategories.PRIMARY_SCHOOL.id,
                        options.schoolCategories.JUNIOR_HIGH_SCHOOL.id,
                        options.schoolCategories.VOCATIONAL.id,
                        options.schoolCategories.GRADUATE_SCHOOL.id,
                      ].includes(filters.curriculum.schoolCategoryId) &&
                        filters.curriculum.schoolCategoryId !== null
                    "
                    @change="loadCurriculums()"
                    v-model="filters.curriculum.levelId"
                    class="float-right"
                  >
                    <template v-slot:first>
                      <b-form-select-option :value="null" disabled
                        >-- Level --</b-form-select-option
                      >
                    </template>
                    <b-form-select-option :value="null"
                      >None</b-form-select-option
                    >
                    <b-form-select-option
                      v-for="level in options.levels.fixItems"
                      :key="level.id"
                      :value="level.id"
                    >
                      {{ level.name }}
                    </b-form-select-option>
                  </b-form-select>
                </b-col>
                <b-col md="3">
                  <b-form-input
                    v-model="filters.curriculum.criteria"
                    type="text"
                    placeholder="Search"
                  >
                  </b-form-input>
                </b-col>
              </b-row>
            </b-col>
          </b-row> -->
          <!-- end add button and search -->
          <!-- table -->
          <b-row>
            <b-col md="12">
              <b-table
                class="c-table"
                small
                hover
                outlined
                show-empty
                :responsive="tables.curriculums.items.length > 3"
                :fields="tables.curriculums.fields"
                :busy="tables.curriculums.isBusy"
                :items.sync="tables.curriculums.items"
                :current-page="paginations.curriculum.page"
                :per-page="paginations.curriculum.perPage"
                :filter="filters.curriculum.criteria"
                @filtered="onFiltered($event, paginations.curriculum)"
              >
                <template v-slot:table-busy>
                  <div class="text-center my-2">
                    <v-icon name="spinner" spin class="mr-2" />
                    <strong>Loading...</strong>
                  </div>
                </template>
                <template v-slot:cell(name)="{ item, value }">
                  <b-link
                    @click="setUpdate(item.id)"
                    :disabled="
                      !isAccessible($options.CurriculumPermissions.EDIT.id)
                    "
                    >{{ value }}
                  </b-link>
                </template>
                <template v-slot:cell(active)="row">
                  <b-badge :variant="row.item.active ? 'success' : 'warning'">
                    {{ row.item.active ? 'NEW' : 'OLD' }}
                  </b-badge>
                </template>
                <template v-slot:cell(action)="row">
                  <b-dropdown
                    right
                    variant="link"
                    toggle-class="text-decoration-none"
                    no-caret
                  >
                    <template v-slot:button-content>
                      <v-icon name="ellipsis-v" />
                    </template>
                    <b-dropdown-item @click="setViewDetails(row)">
                      {{ row.detailsShowing ? 'Hide' : 'View' }} Details
                    </b-dropdown-item>
                    <b-dropdown-item
                      v-if="
                        isAccessible($options.CurriculumPermissions.EDIT.id)
                      "
                      @click="setUpdate(row.item.id)"
                      :disabled="showEntry"
                    >
                      Edit
                    </b-dropdown-item>
                    <b-dropdown-item
                      v-if="
                        isAccessible($options.CurriculumPermissions.DELETE.id)
                      "
                      @click="
                        (forms.curriculum.fields.id = row.item.id),
                          (showModalConfirmation = true)
                      "
                      :disabled="showModalConfirmation"
                    >
                      Delete
                    </b-dropdown-item>
                  </b-dropdown>
                </template>
                <template v-slot:row-details="data">
                  <b-overlay :show="data.item.isBusy" rounded="sm">
                    <b-card>
                      <b-row>
                        <b-col md="4">
                          <h6>Curriculum Name : {{ data.item.name }}</h6>
                          <h6 v-if="data.item.course">
                            {{ `Course : ${data.item.course.name}` }}
                          </h6>
                          <!-- <h6 v-if="data.item.level">
                            {{ `Level : ${data.item.level.name}` }}
                          </h6> -->
                        </b-col>
                        <b-col md="4">
                          <h6>Description : {{ data.item.description }}</h6>
                          <h6 v-if="data.item.course">
                            Major : {{ data.item.course.major }}
                          </h6>
                          <h6>
                            Effectivity Year : {{ data.item.effectiveYear }}
                          </h6>
                        </b-col>
                        <b-col md="4">
                          <h6>Notes : {{ data.item.notes }}</h6>
                        </b-col>
                      </b-row>
                      <b-row v-if="data.item.subjects && data.item.levels">
                        <b-col md="12">
                          <div
                            v-for="level in data.item.levels"
                            :key="
                              `${level.id} - ${
                                level.semesterId ? level.semesterId : ''
                              }`
                            "
                          >
                            <hr />
                            <h6>
                              {{ level.name }}
                              {{
                                level.semesterId
                                  ? `- ${
                                      options.semesters.getEnum(
                                        level.semesterId
                                      ).name
                                    }`
                                  : ''
                              }}
                            </h6>
                            <b-table
                              class="table-preview"
                              responsive
                              small
                              hover
                              outlined
                              show-empty
                              :items="
                                filterPreviewSubjects(
                                  data.item.subjects,
                                  level.id,
                                  level.semesterId ? level.semesterId : null
                                )
                              "
                              :fields="tables.previewSubjects.fields"
                              :busy="data.item.isBusy"
                            >
                              <template v-slot:table-busy>
                                <div class="text-center my-2">
                                  <v-icon name="spinner" spin class="mr-2" />
                                  <strong>Loading...</strong>
                                </div>
                              </template>
                              <template v-slot:cell(labs)="row">
                                {{
                                  data.item.schoolCategoryId ===
                                  options.schoolCategories.VOCATIONAL.id
                                    ? 'N/A'
                                    : row.item.labs
                                }}
                              </template>
                              <template v-slot:cell(units)="row">
                                {{
                                  data.item.schoolCategoryId ===
                                  options.schoolCategories.VOCATIONAL.id
                                    ? 'N/A'
                                    : row.item.units
                                }}
                              </template>
                              <template v-slot:custom-foot>
                                <b-tr class="font-weight-bold">
                                  <b-td colspan="2" class="text-right">
                                    <span class="text-danger"
                                      >Total Units
                                    </span>
                                  </b-td>
                                  <b-td class="text-center">
                                    <span class="text-danger">
                                      {{
                                        data.item.schoolCategoryId ===
                                        options.schoolCategories.VOCATIONAL.id
                                          ? 'N/A'
                                          : totalUnits(
                                              filterPreviewSubjects(
                                                data.item.subjects,
                                                level.id,
                                                level.semesterId
                                                  ? level.semesterId
                                                  : null
                                              ),
                                              'labs'
                                            )
                                      }}
                                    </span>
                                  </b-td>
                                  <b-td class="text-center">
                                    <span class="text-danger">
                                      {{
                                        data.item.schoolCategoryId ===
                                        options.schoolCategories.VOCATIONAL.id
                                          ? 'N/A'
                                          : totalUnits(
                                              filterPreviewSubjects(
                                                data.item.subjects,
                                                level.id,
                                                level.semesterId
                                                  ? level.semesterId
                                                  : null
                                              ),
                                              'units'
                                            )
                                      }}
                                    </span>
                                  </b-td>
                                  <b-td class="text-center">
                                    <span class="text-danger">
                                      {{
                                        data.item.schoolCategoryId ===
                                        options.schoolCategories.VOCATIONAL.id
                                          ? 'N/A'
                                          : totalUnits(
                                              filterPreviewSubjects(
                                                data.item.subjects,
                                                level.id,
                                                level.semesterId
                                                  ? level.semesterId
                                                  : null
                                              ),
                                              'totalUnits'
                                            )
                                      }}
                                    </span>
                                  </b-td>
                                  <b-td></b-td>
                                </b-tr>
                              </template>
                            </b-table>
                          </div>
                        </b-col>
                      </b-row>
                    </b-card>
                  </b-overlay>
                </template>
              </b-table>
              <b-row>
                <b-col md="6">
                  Showing {{ paginations.curriculum.from }} to
                  {{ paginations.curriculum.to }} of
                  {{ paginations.curriculum.totalRows }} records.
                </b-col>
                <b-col md="6">
                  <b-pagination
                    class="c-pagination"
                    v-model="paginations.curriculum.page"
                    :total-rows="paginations.curriculum.totalRows"
                    :per-page="paginations.curriculum.perPage"
                    size="sm"
                    align="end"
                    @input="paginate(paginations.curriculum)"
                  />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </div>
      </div>
      <div v-show="showEntry && checkIfHasSchoolCategoryAccess()">
        <div>
          <b-overlay blur="blur" :show="forms.curriculum.isLoading" rounded="sm">
            <b-row>
              <b-col md="12">
                <b-card>
                  <h5 slot="header">
                    <span>
                      Curriculum - {{ entryMode }} <br />
                      <small
                        >Details about the subjects comprising the Course or
                        Program.</small
                      >
                    </span>
                  </h5>
                  <b-card-body>
                    <b-row>
                      <b-col md="6">
                        <b-form-group>
                          <label class="required">Name</label>
                          <b-form-input
                            v-model="forms.curriculum.fields.name"
                            :state="forms.curriculum.states.name"
                          >
                          </b-form-input>
                          <b-form-invalid-feedback>
                            {{ forms.curriculum.errors.name }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group>
                          <label>Description</label>
                          <b-form-textarea
                            debounce="500"
                            cols="3"
                            v-model="forms.curriculum.fields.description"
                            :state="forms.curriculum.states.description"
                          >
                          </b-form-textarea>
                          <b-form-invalid-feedback>
                            {{ forms.curriculum.errors.description }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group>
                          <label>Notes</label>
                          <b-form-textarea
                            debounce="500"
                            cols="3"
                            v-model="forms.curriculum.fields.notes"
                            :state="forms.curriculum.states.notes"
                          >
                          </b-form-textarea>
                          <b-form-invalid-feedback>
                            {{ forms.curriculum.errors.notes }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                      <b-col md="6">
                        <b-row>
                          <b-col md="6">
                            <!-- <b-form-group>
                              <label class="required">School Category</label>
                              <b-form-select
                                @change="
                                  loadLevelsOfSchoolCategoryList(),
                                    (forms.curriculum.fields.courseId = null),
                                    (forms.curriculum.fields.levelId = null)
                                "
                                v-model="forms.curriculum.fields.schoolCategoryId"
                                :state="forms.curriculum.states.schoolCategoryId"
                              >
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled
                                    >-- School Category --</b-form-select-option
                                  >
                                </template>
                                <b-form-select-option
                                  v-for="category in options.schoolCategories
                                    .values"
                                  :key="category.id"
                                  :value="category.id"
                                >
                                  {{ category.name }}
                                </b-form-select-option>
                              </b-form-select>
                              <b-form-invalid-feedback>
                                {{ forms.curriculum.errors.schoolCategoryId }}
                              </b-form-invalid-feedback>
                            </b-form-group> -->
                            <b-form-group>
                              <label>
                                Course
                                <v-icon
                                  v-if="options.courses.isLoading"
                                  name="spinner"
                                  spin
                                />
                              </label>
                              <b-form-select
                                :disabled="
                                  (!checkSchoolCategory() &&
                                    !checkSchoolCategory(true)) ||
                                    forms.curriculum.fields.schoolCategories ==
                                      null ||
                                    options.courses.isLoading
                                "
                                @change="loadLevelsOfCourse()"
                                v-model="forms.curriculum.fields.courseId"
                                :state="forms.curriculum.states.courseId"
                              >
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled
                                    >-- Course --</b-form-select-option
                                  >
                                </template>
                                <b-form-select-option
                                  v-for="course in options.courses.items"
                                  :key="course.id"
                                  :value="course.id"
                                >
                                  {{ course.description }}
                                  {{ course.major ? `(${course.major})` : '' }}
                                </b-form-select-option>
                              </b-form-select>
                              <b-form-invalid-feedback>
                                {{ forms.curriculum.errors.courseId }}
                              </b-form-invalid-feedback>
                            </b-form-group>
                            <b-form-group>
                              <label class="required">Effective Year</label>
                              <b-form-input
                                no-wheel
                                debounce="500"
                                type="number"
                                v-model="forms.curriculum.fields.effectiveYear"
                                :state="forms.curriculum.states.effectiveYear"
                              >
                              </b-form-input>
                              <b-form-invalid-feedback>
                                {{ forms.curriculum.errors.effectiveYear }}
                              </b-form-invalid-feedback>
                            </b-form-group>
                            <!-- <b-form-group>
                              <label>
                                Level
                                <v-icon
                                  v-if="options.levels.isLoading"
                                  name="spinner"
                                  spin
                                />
                              </label>
                              <b-form-select
                                :disabled="
                                  checkSchoolCategory() ||
                                    forms.curriculum.fields.schoolCategoryId ==
                                      null ||
                                    options.levels.isLoading
                                "
                                @change="getSelectedLevel()"
                                v-model="forms.curriculum.fields.levelId"
                                :state="forms.curriculum.states.levelId"
                              >
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled
                                    >-- Level --</b-form-select-option
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
                                {{ forms.curriculum.errors.levelId }}
                              </b-form-invalid-feedback>
                            </b-form-group> -->
                            <b-form-group>
                              <b-form-checkbox
                                v-model="forms.curriculum.fields.active"
                                :value="1"
                                :unchecked-value="0"
                              >
                                New
                              </b-form-checkbox>
                            </b-form-group>
                            <b-button
                              @click="showModalSchoolCategory = true"
                              variant="outline-primary">
                              Add School Category
                            </b-button>
                          </b-col>
                          <b-col md="6">
                            <!-- <b-form-group>
                              <label class="required">Effective Year</label>
                              <b-form-input
                                no-wheel
                                debounce="500"
                                type="number"
                                v-model="forms.curriculum.fields.effectiveYear"
                                :state="forms.curriculum.states.effectiveYear"
                              >
                              </b-form-input>
                              <b-form-invalid-feedback>
                                {{ forms.curriculum.errors.effectiveYear }}
                              </b-form-invalid-feedback>
                            </b-form-group> -->
                            <!-- <b-form-group>
                              <label>
                                Level
                                <v-icon
                                  v-if="options.levels.isLoading"
                                  name="spinner"
                                  spin
                                />
                              </label>
                              <b-form-select
                                :disabled="
                                  checkSchoolCategory() ||
                                    forms.curriculum.fields.schoolCategoryId ==
                                      null ||
                                    options.levels.isLoading
                                "
                                @change="getSelectedLevel()"
                                v-model="forms.curriculum.fields.levelId"
                                :state="forms.curriculum.states.levelId"
                              >
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled
                                    >-- Level --</b-form-select-option
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
                                {{ forms.curriculum.errors.levelId }}
                              </b-form-invalid-feedback>
                            </b-form-group> -->
                            <!-- <b-form-group>
                              <b-form-checkbox
                                v-model="forms.curriculum.fields.active"
                                :value="1"
                                :unchecked-value="0"
                              >
                                New
                              </b-form-checkbox>
                            </b-form-group> -->
                          </b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                    <b-overlay :show="isLoading" rounded="sm">
                      <b-row>
                        <b-col md="12">
                          <b-list-group>
                            <b-list-group-item
                              v-for="level in levels"
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
                              >
                                <div
                                  v-if="
                                    checkSchoolCategory() &&
                                      forms.curriculum.fields.courseId !== null
                                  "
                                >
                                  <b-form-checkbox
                                    class="mb-2"
                                    @input="getSemesters(level, $event)"
                                  >
                                    Show All Semesters
                                  </b-form-checkbox>
                                  <b-card
                                    v-for="semester in filterSemester(level)"
                                    :key="semester.id"
                                  >
                                    <b-row>
                                      <b-col md="9">
                                        <h6>{{ semester.name }}</h6>
                                      </b-col>
                                      <b-col md="3">
                                        <b-button
                                          class="float-right mb-2"
                                          variant="outline-primary"
                                          @click="
                                            onAddSubject(level, semester.id)
                                          "
                                        >
                                          <v-icon name="plus-circle" /> ADD NEW SUBJECT
                                        </b-button>
                                      </b-col>
                                    </b-row>
                                    <b-row>
                                      <b-col md="12">
                                        <b-table
                                          responsive
                                          small
                                          hover
                                          outlined
                                          show-empty
                                          :items="
                                            filterSubjects(level.id, semester.id)
                                          "
                                          :fields="tables.subjects.fields"
                                          :busy="tables.subjects.isBusy"
                                        >
                                          <template v-slot:table-busy>
                                            <div class="text-center my-2">
                                              <v-icon
                                                name="spinner"
                                                spin
                                                class="mr-2"
                                              />
                                              <strong>Loading...</strong>
                                            </div>
                                          </template>
                                          <template v-slot:cell(labs)="row">
                                            {{
                                              forms.curriculum.fields
                                                .schoolCategoryId ===
                                              options.schoolCategories.VOCATIONAL
                                                .id
                                                ? 'N/A'
                                                : row.item.labs
                                            }}
                                          </template>
                                          <template v-slot:cell(units)="row">
                                            {{
                                              forms.curriculum.fields
                                                .schoolCategoryId ===
                                              options.schoolCategories.VOCATIONAL
                                                .id
                                                ? 'N/A'
                                                : row.item.units
                                            }}
                                          </template>
                                          <template
                                            v-slot:cell(prerequisites)="row"
                                          >
                                            <!-- <Select2
                                              class="w-100"
                                              multiple
                                              v-model="row.item.prerequisites"
                                              :disabled="isLoading"
                                              :allowClear="false">
                                              <option
                                                v-for="subject in tables.subjects.items"
                                                :key="subject.id"
                                                :value="subject.id">
                                                {{subject.name}}
                                              </option>
                                            </Select2> -->
                                            <v-select
                                              v-model="row.item.prerequisites"
                                              :reduce="(item) => item.id"
                                              multiple
                                              label="name"
                                              :options="tables.subjects.items"
                                            />
                                          </template>
                                          <template v-slot:custom-foot>
                                            <b-tr class="font-weight-bold">
                                              <b-td
                                                colspan="3"
                                                class="text-right"
                                              >
                                                <span class="text-danger"
                                                  >Total Units
                                                </span>
                                              </b-td>
                                              <b-td class="text-center">
                                                <span class="text-danger">
                                                  {{
                                                    forms.curriculum.fields
                                                      .schoolCategoryId ===
                                                    options.schoolCategories
                                                      .VOCATIONAL.id
                                                      ? 'N/A'
                                                      : totalUnits(
                                                          filterSubjects(
                                                            level.id,
                                                            semester.id
                                                          ),
                                                          'labs'
                                                        )
                                                  }}
                                                </span>
                                              </b-td>
                                              <b-td class="text-center">
                                                <span class="text-danger">
                                                  {{
                                                    forms.curriculum.fields
                                                      .schoolCategoryId ===
                                                    options.schoolCategories
                                                      .VOCATIONAL.id
                                                      ? 'N/A'
                                                      : totalUnits(
                                                          filterSubjects(
                                                            level.id,
                                                            semester.id
                                                          ),
                                                          'units'
                                                        )
                                                  }}
                                                </span>
                                              </b-td>
                                              <b-td class="text-center">
                                                <span class="text-danger">
                                                  {{
                                                    forms.curriculum.fields
                                                      .schoolCategoryId ===
                                                    options.schoolCategories
                                                      .VOCATIONAL.id
                                                      ? 'N/A'
                                                      : totalUnits(
                                                          filterSubjects(
                                                            level.id,
                                                            semester.id
                                                          ),
                                                          'totalUnits'
                                                        )
                                                  }}
                                                </span>
                                              </b-td>
                                              <b-td></b-td>
                                            </b-tr>
                                          </template>
                                          <template v-slot:cell(action)="row">
                                            <b-button
                                              @click="removeSubject(row)"
                                              size="sm"
                                              variant="danger"
                                            >
                                              <v-icon name="trash" />
                                            </b-button>
                                          </template>
                                        </b-table>
                                      </b-col>
                                    </b-row>
                                  </b-card>
                                </div>
                                <b-card v-else>
                                  <b-row>
                                    <b-col md="3" offset-md="9">
                                      <b-button
                                        class="float-right mb-2"
                                        variant="outline-primary"
                                        @click="onAddSubject(level)"
                                      >
                                        <v-icon name="plus-circle" /> ADD NEW
                                        SUBJECT
                                      </b-button>
                                    </b-col>
                                  </b-row>
                                  <b-row>
                                    <b-col md="12">
                                      <b-table
                                        responsive
                                        small
                                        hover
                                        outlined
                                        show-empty
                                        :items="filterSubjects(level.id)"
                                        :fields="tables.subjects.fields"
                                        :busy="tables.subjects.isBusy"
                                      >
                                        <template v-slot:table-busy>
                                          <div class="text-center my-2">
                                            <v-icon
                                              name="spinner"
                                              spin
                                              class="mr-2"
                                            />
                                            <strong>Loading...</strong>
                                          </div>
                                        </template>
                                        <template v-slot:cell(labs)="row">
                                          {{
                                            forms.curriculum.fields
                                              .schoolCategoryId ===
                                            options.schoolCategories.VOCATIONAL.id
                                              ? 'N/A'
                                              : row.item.labs
                                          }}
                                        </template>
                                        <template v-slot:cell(units)="row">
                                          {{
                                            forms.curriculum.fields
                                              .schoolCategoryId ===
                                            options.schoolCategories.VOCATIONAL.id
                                              ? 'N/A'
                                              : row.item.units
                                          }}
                                        </template>
                                        <template
                                          v-slot:cell(prerequisites)="row"
                                        >
                                          <!-- <Select2
                                            class="w-100"
                                            multiple
                                            v-model="row.item.prerequisites"
                                            :disabled="isLoading"
                                            :allowClear="false">
                                            <option
                                              v-for="subject in tables.subjects.items"
                                              :key="subject.id"
                                              :value="subject.id">
                                              {{subject.name}}
                                            </option>
                                          </Select2> -->
                                          <v-select
                                            v-model="row.item.prerequisites"
                                            :reduce="(item) => item.id"
                                            multiple
                                            label="name"
                                            :options="tables.subjects.items"
                                          />
                                        </template>
                                        <template v-slot:custom-foot>
                                          <b-tr class="font-weight-bold">
                                            <b-td colspan="3" class="text-right">
                                              <span class="text-danger"
                                                >Total Units
                                              </span>
                                            </b-td>
                                            <b-td class="text-center">
                                              <span class="text-danger">
                                                {{
                                                  forms.curriculum.fields
                                                    .schoolCategoryId ===
                                                  options.schoolCategories
                                                    .VOCATIONAL.id
                                                    ? 'N/A'
                                                    : totalUnits(
                                                        filterSubjects(level.id),
                                                        'labs'
                                                      )
                                                }}
                                              </span>
                                            </b-td>
                                            <b-td class="text-center">
                                              <span class="text-danger">
                                                {{
                                                  forms.curriculum.fields
                                                    .schoolCategoryId ===
                                                  options.schoolCategories
                                                    .VOCATIONAL.id
                                                    ? 'N/A'
                                                    : totalUnits(
                                                        filterSubjects(level.id),
                                                        'units'
                                                      )
                                                }}
                                              </span>
                                            </b-td>
                                            <b-td class="text-center">
                                              <span class="text-danger">
                                                {{
                                                  forms.curriculum.fields
                                                    .schoolCategoryId ===
                                                  options.schoolCategories
                                                    .VOCATIONAL.id
                                                    ? 'N/A'
                                                    : totalUnits(
                                                        filterSubjects(level.id),
                                                        'totalUnits'
                                                      )
                                                }}
                                              </span>
                                            </b-td>
                                            <b-td></b-td>
                                          </b-tr>
                                        </template>
                                        <template v-slot:cell(action)="row">
                                          <b-button
                                            @click="removeSubject(row)"
                                            size="sm"
                                            variant="danger"
                                          >
                                            <v-icon name="trash" />
                                          </b-button>
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
                    </b-overlay>
                  </b-card-body>
                  <template v-slot:footer>
                    <b-button
                      class="float-right btn-save ml-2"
                      @click="showEntry = false"
                      variant="outline-danger"
                    >
                      Close
                    </b-button>
                    <b-button
                      :disabled="forms.curriculum.isProcessing"
                      class="float-right btn-save"
                      @click="onCurriculumEntry()"
                      variant="outline-primary"
                    >
                      <v-icon
                        v-if="forms.curriculum.isProcessing"
                        name="sync"
                        spin
                        class="mr-2"
                      />
                      Save
                    </b-button>
                  </template>
                </b-card>
              </b-col>
            </b-row>
          </b-overlay>
        </div>
      </div>
      <NoAccess v-if="!checkIfHasSchoolCategoryAccess()"/>
    <!-- MODAL SUBJECT -->
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
            <b-col md="4"> </b-col>
            <b-col offset-md="4" md="4">
              <b-form-input
                v-model="filters.subject.criteria"
                type="text"
                placeholder="Search"
                debounce="500"
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
            :filter="filters.subject.criteria"
            :busy="tables.subjects.isBusy2"
            :current-page="paginations.subject.page"
            :per-page="paginations.subject.perPage"
            @filtered="onFiltered($event, paginations.subject)"
          >
            <template class="d-none" v-slot:cell(prerequisites)>
              <b-tr class="d-none"> </b-tr>
            </template>
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
                @input="paginate(paginations.subject)"
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
      v-model="showModalSchoolCategory"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        School Categories
      </div>
      <b-table
        class="c-table"
        small
        hover
        outlined
        show-empty
        :fields="tables.schoolCategories.fields"
        :items.sync="options.schoolCategories.values"
      >
        <template v-slot:cell(action)="{ item }">
          <b-button
            v-if="!forms.curriculum.fields.schoolCategories.find(sc => sc.id === item.id)"
            :disabled="checkIfSchoolCategoryCanPair(item)"
            @click="addSchoolCategory(item)" 
            size="sm" 
            variant="success">
            <v-icon name="plus" />
          </b-button>
          <b-button
            v-else
            @click="removeSchoolCategory(item)" 
            size="sm" 
            variant="danger">
            <v-icon name="trash" />
          </b-button>
        </template>
      </b-table>
      <div slot="modal-footer">
        <b-button
          class="btn-close"
          variant="outline-danger"
          @click="showModalSchoolCategory = false"
        >
          Close
        </b-button>
      </div>
    </b-modal>
    <!-- Modal Confirmation -->
    <b-modal
      v-model="showModalConfirmation"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        Delete Curriculum
      </div>
      Are you sure you want to delete this curriculum?
      <div slot="modal-footer">
        <b-button
          variant="outline-primary"
          class="mr-2 btn-save"
          @click="onCurriculumDelete()"
        >
          <v-icon
            v-if="forms.curriculum.isProcessing"
            name="sync"
            spin
            class="mr-2"
          />
          Yes
        </b-button>
        <b-button
          class="btn-close"
          variant="outline-danger"
          @click="showModalConfirmation = false"
        >
          No
        </b-button>
      </div>
    </b-modal>
    <!-- End Modal Confirmation -->
    </template>
  </PageContent>
</template>
<script>
import {
  SchoolCategoryApi,
  LevelApi,
  SemesterApi,
  CourseApi,
  SubjectApi,
  DepartmentApi,
  CurriculumApi,
} from '../../mixins/api';
import {
  SchoolCategories,
  Semesters,
  UserGroups,
  CurriculumPermissions,
} from '../../helpers/enum';
import {
  showNotification,
  validate,
  clearFields,
  reset,
} from '../../helpers/forms';
import { copyValue } from '../../helpers/extractor';
import Tables from '../../helpers/tables';
import SchoolCategoryTabs from '../components/SchoolCategoryTabs';
import Access from '../../mixins/utils/Access';
import Card from '../components/Card';
import PageContent from '../components/PageContainer/PageContent'
import NoAccess from "../components/NoAccess";
import SchoolCategory from '../../mixins/api/SchoolCategory';

const curriculumFields = {
  id: null,
  name: null,
  description: null,
  schoolCategories: [],
  courseId: null,
  effectiveYear: null,
  notes: null,
  subjects: null,
  active: null,
};

export default {
  name: 'Curriculum',
  mixins: [
    SchoolCategoryApi,
    LevelApi,
    SemesterApi,
    CourseApi,
    SubjectApi,
    DepartmentApi,
    CurriculumApi,
    Tables,
    Access,
  ],
  components: {
    SchoolCategoryTabs,
    Card,
    PageContent,
    NoAccess
  },
  CurriculumPermissions,
  data() {
    return {
      isFilterVisible: true,
      showModalSubjects: false,
      showModalConfirmation: false,
      showEntry: false,
      showModalSchoolCategory: false,
      entryMode: 'Add',
      isLoading: false,
      forms: {
        curriculum: {
          isProcessing: false,
          isLoading: false,
          fields: { ...curriculumFields },
          states: { ...curriculumFields },
          errors: { ...curriculumFields },
        },
      },
      tables: {
        curriculums: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            // {
            //   key: "description",
            // 	label: "Description",
            // 	tdClass: "align-middle",
            // 	thStyle: {width: "auto"}
            // },
            {
              key: 'effectiveYear',
              label: 'Effective',
              tdClass: 'align-middle',
              thStyle: { width: '10%' },
            },
            {
              key: 'schoolCategories',
              label: 'School',
              tdClass: 'align-middle',
              thStyle: { width: '15%' },
              formatter: (value) => {
                let text = '';
                value.forEach(v => {
                  text = text + v.name + ', '
                });
                text = text.slice(0, -2)
                return text;
              }
            },
            {
              key: 'course.name',
              label: 'Course',
              tdClass: 'align-middle',
              thStyle: { width: '10%' },
              formatter: (value) => {
                if (value) {
                  return value;
                } else {
                  return 'N/A';
                }
              },
            },
            // {
            // 	key: "course.major",
            // 	label: "Major",
            // 	tdClass: "align-middle",
            // 	thStyle: {width: "10%"}
            // },
            // {
            //   key: 'level.name',
            //   label: 'Level',
            //   tdClass: 'align-middle',
            //   thStyle: { width: '8%' },
            //   formatter: (value) => {
            //     if (value) {
            //       return value;
            //     } else {
            //       return 'N/A';
            //     }
            //   },
            // },
            // {
            // 	key: "notes",
            // 	label: "Notes",
            // 	tdClass: "align-middle",
            // 	thStyle: {width: "15%"}
            // },
            {
              key: 'active',
              label: 'Status',
              tdClass: 'align-middle',
              thStyle: { width: '5%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '40px' },
            },
          ],
          items: [],
        },
        subjects: {
          isBusy: false,
          isBusy2: false,
          fields: [
            // {
            // 	key: "code",
            // 	label: "CODE",
            // 	tdClass: "align-middle",
            // 	thStyle: {width: "15%"}
            // },
            {
              key: 'name',
              label: 'SUBJECT CODE',
              tdClass: 'align-middle',
              thStyle: { width: '18%' },
            },
            {
              key: 'description',
              label: 'DESCRIPTION',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'prerequisites',
              label: 'PREREQUISITES',
              tdClass: 'align-middle',
              thStyle: { width: '20%' },
              // formatter: (value, key, item) => {
              //   if (value.length > 0) {
              //      return value.map(subject => { return subject.id; }).join(", ");
              //   }
              //   return ''
              // }
            },
            {
              key: 'labs',
              label: 'LAB UNITS',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'units',
              label: 'LEC UNITS',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'totalUnits',
              label: 'TOTAL UNITS',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '5%' },
            },
          ],
          fields2: [
            // {
            // 	key: "code",
            // 	label: "CODE",
            // 	tdClass: "align-middle",
            // 	thStyle: {width: "15%"}
            // },
            {
              key: 'name',
              label: 'SUBJECT CODE',
              tdClass: 'align-middle',
              thStyle: { width: '18%' },
            },
            {
              key: 'description',
              label: 'DESCRIPTION',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'labs',
              label: 'LAB UNITS',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'units',
              label: 'LEC UNITS',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'totalUnits',
              label: 'TOTAL UNITS',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '5%' },
            },
          ],
          items: [],
          filteredItems: [],
        },
        previewSubjects: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Subject Code',
              tdClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'description',
              label: 'Description',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'labs',
              label: 'Lab Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'units',
              label: 'Lec Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'totalUnits',
              label: 'Total Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'prerequisites',
              label: 'Prerequisites',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
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
          ],
        },
        schoolCategories: {
          fields: [
            {
              key: 'name',
              label: 'NAME',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '5%' },
            },
          ],
          items: []
        }
      },
      paginations: {
        subject: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
        curriculum: {
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
          departmentId: null,
        },
        curriculum: {
          criteria: null,
          schoolCategoryId: null,
          schoolCategoryItem: null,
          levelId: null,
          levelItem: null,
          courseId: null,
          courseItem: null,
        },
      },
      options: {
        schoolCategories: SchoolCategories,
        levels: {
          isLoading: false,
          items: [],
          fixItems: [],
        },
        courses: {
          isLoading: false,
          items: [],
          fixItems: [],
        },
        semesters: Semesters,
        departments: {
          items: [],
        },
      },
      level: null,
      schoolCategoryId: null,
      userGroupId: null,
      semesters: [],
      levels: [],
    };
  },
  created() {
    const { curriculum } = this.filters
    if (!this.checkIfSuperUser()) {
      curriculum.schoolCategoryId =  this.getDefaultSchoolCategory()?.id
      curriculum.schoolCategoryItem =  this.getDefaultSchoolCategory()
    }
    // this.loadLevelList();
    this.loadCourseList();
    this.loadCurriculums()
    // this.checkRights()
    // this.loadDepartments()
  },
  methods: {
    loadCurriculums() {
      const { curriculums } = this.tables;
      const { curriculum } = this.paginations;
      const { schoolCategoryId, levelId, courseId } = this.filters.curriculum;
      curriculums.isBusy = true;

      let params = { paginate: false, schoolCategoryId, levelId, courseId };
      this.getCurriculumList(params).then(({ data }) => {
        curriculums.items = data;
        curriculum.totalRows = data.length;
        this.paginate(curriculum);
        curriculums.isBusy = false;
      });
    },
    // loadLevelList() {
    //   const { levels } = this.options;
    //   const {
    //     curriculum,
    //     curriculum: { schoolCategoryId },
    //   } = this.filters;
    //   curriculum.levelId = null;
    //   if (schoolCategoryId) {
    //     let params = { paginate: false };
    //     this.getLevelsOfSchoolCategoryList(schoolCategoryId, params).then(
    //       ({ data }) => {
    //         levels.fixItems = data;
    //       }
    //     );
    //   } else {
    //     let params = { paginate: false, schoolCategoryId };
    //     this.getLevelList(params).then(({ data }) => {
    //       levels.fixItems = data;
    //     });
    //   }
    // },
    loadCourseList() {
      const { courses } = this.options;
      const {
        curriculum,
        curriculum: { schoolCategoryId },
      } = this.filters;
      curriculum.courseId = null;
      if (
        [
          SchoolCategories.COLLEGE.id,
          SchoolCategories.SENIOR_HIGH_SCHOOL.id,
          SchoolCategories.GRADUATE_SCHOOL.id,
          SchoolCategories.VOCATIONAL.id,
        ].includes(schoolCategoryId)
      ) {
        let params = { paginate: false };
        this.getCoursesOfSchoolCategoryList(schoolCategoryId, params).then(
          ({ data }) => {
            courses.fixItems = data;
          }
        );
      }
    },
    loadLevelsOfSchoolCategoryList(getSelectedLevel = false) {
      const {
        fields,
        fields: { schoolCategoryId },
      } = this.forms.curriculum;
      this.levels = [];
      if (this.entryMode === 'Add') {
        fields.courseId = null;
        fields.subjects = [];
      }

      if (this.checkSchoolCategory()) {
        fields.levelId = null;
        this.loadCoursesOfSchoolCategoryList();
        return;
      }
      if (this.checkSchoolCategory(true)) {
        // fields.levelId = null
        this.loadCoursesOfSchoolCategoryList();
      }

      if (!getSelectedLevel) {
        fields.courseId = null;
      }

      let params = { paginate: false };
      const { levels } = this.options;
      levels.isLoading = true;
      //to edit
      // this.getLevelsOfSchoolCategoryList(5, params)
      //   .then(({ data }) => {
      //     levels.items = data;
      //     levels.isLoading = false;
      //     if (getSelectedLevel) {
      //       this.getSelectedLevel();
      //       return;
      //     }
      //     fields.levelId = null;
      //   })
      //   .catch((error) => {
      //     levels.isLoading = false;
      //     console.log(error);
      //   });
    },
    loadSubjectsOfLevelList() {
      const { subjects } = this.tables;
      subjects.isBusy = true;
      const {
        fields,
        fields: { levelId, courseId, semesterId },
      } = this.forms.curriculum;
      let params = { courseId, semesterId, paginate: false };
      this.getSubjectsOfLevelList(levelId, params).then(({ data }) => {
        fields.subjects = data;
        subjects.isBusy = false;
      });
    },
    loadCoursesOfSchoolCategoryList(schoolCategoryId) {
      const { courses } = this.options;
      let params = { paginate: false };
      courses.isLoading = true;
      this.getCoursesOfSchoolCategoryList(schoolCategoryId, params).then(
        ({ data }) => {
          courses.items = data;
          courses.isLoading = false;
        }
      );
    },
    loadLevelsOfCourse() {
      const {
        fields,
        fields: { courseId },
      } = this.forms.curriculum;
      const { items } = this.options.courses;
      // if (items.length > 0) {
      //   fields.description = items.find(i => i.id === courseId).description
      // }
      this.isLoading = true;
      let params = { paginate: false };
      this.getLevelsOfCourse(courseId, params).then(({ data }) => {
        this.levels = data;
        this.isLoading = false;
      });
    },
    setCreate() {
      const {
        curriculum,
        curriculum: { fields },
      } = this.forms;
      this.showEntry = true;
      curriculum.isLoading = true;
      reset(curriculum);
      clearFields(fields);
      this.entryMode = 'Add';
      fields.schoolCategories = [];
      fields.courseId = null;
      fields.subjects = [];
      this.levels = [];
      fields.active = 1;
      curriculum.isLoading = false;
    },
    setUpdate(id) {
      this.entryMode = 'Edit';
      this.showEntry = true;
      this.levels = [];
      const {
        curriculum,
        curriculum: {
          fields,
          fields: { subjects, schoolCategories, ...newFields },
        },
      } = this.forms;
      curriculum.isLoading = true;
      this.getCurriculum(id).then(({ data }) => {
        console.log(data)
        copyValue(data, fields, Object.keys(newFields));
        data.subjects.forEach((s) => {
          s.prerequisites = s.prerequisites.map((p) => p.id);
        });
        
        
        fields.subjects = data.subjects;
        fields.schoolCategories = data.schoolCategories.map(sc => {
          const schoolCategory = SchoolCategories.getEnum(sc.id)
          return {
            ...schoolCategory
          }
        })
        fields.schoolCategories.forEach(sc => {
          this.getSelectedLevel(sc.id)
        })
        if (data.courseId) {
          this.loadCoursesOfSchoolCategoryList(fields.schoolCategories[0]?.id)
        }
        
        // let getSelectedLevel = false;
        // if (this.checkSchoolCategory()) {
        //   this.loadLevelsOfCourse();
        // } else {
        //   getSelectedLevel = true;
        // }
        // this.loadLevelsOfSchoolCategoryList(getSelectedLevel);
        curriculum.isLoading = false;
      });
    },
    onCurriculumEntry() {
      const {
        curriculum,
        curriculum: {
          fields: { subjects, schoolCategories, ...fields },
        },
      } = this.forms;
      curriculum.isProcessing = true;
      const { curriculums } = this.tables;
      let data = {
        subjects: [],
        prerequisites: [],
        schoolCategories: [],
        ...fields,
      };

      data.schoolCategories = schoolCategories.map(sc => sc.id)

      subjects.forEach((s) => {
        data.subjects.push({
          subjectId: s.id,
          levelId: s.pivot.levelId,
          semesterId: s.pivot.semesterId,
          schoolCategoryId: s.pivot.schoolCategoryId
        });
        s.prerequisites.forEach((p) => {
          data.prerequisites.push({
            subjectId: s.id,
            prerequisiteSubjectId: Number(p),
          });
        });
      });

      reset(curriculum);
      if (this.entryMode === 'Add') {
        this.addCurriculum(data)
          .then(({ data }) => {
            this.addRow(curriculums, this.paginations.curriculum, data);
            curriculum.isProcessing = false;
            showNotification(
              this,
              'success',
              'Curriculum created successfully.'
            );
            this.updateOldCurriculum(data);
            this.showEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            curriculum.isProcessing = false;
            validate(curriculum, errors, this);
            this.showBulletedNotification(errors);
          });
      } else {
        this.updateCurriculum(data, fields.id)
          .then(({ data }) => {
            curriculum.isProcessing = false;
            this.updateRow(curriculums, data);
            showNotification(
              this,
              'success',
              'Curriculum updated successfully.'
            );
            this.updateOldCurriculum(data);
            this.showEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            curriculum.isProcessing = false;
            validate(curriculum, errors, this);
            this.showBulletedNotification(errors);
          });
      }
    },
    onCurriculumDelete() {
      const {
        curriculum,
        curriculum: {
          fields: { id },
        },
      } = this.forms;
      const { curriculums } = this.tables;
      curriculum.isProcessing = true;
      this.deleteCurriculum(id).then(({ data }) => {
        curriculum.isProcessing = false;
        let row = curriculums.items.find((c) => c.id === id);
        this.deleteRow(curriculums, this.paginations.curriculum, id);

        if (row.active) {
          let curricula = curriculums.items.filter(
            (c) =>
              c.active === 0 &&
              c.schoolCategoryId === row.schoolCategoryId &&
              c.levelId === row.levelId &&
              c.courseId === row.courseId &&
              c.id !== row.id
          );

          // return
          let latestYear = Math.max(
            ...curricula.map((c) => c.effectiveYear),
            0
          );
          let curr = curricula.filter(
            (c) => Number(c.effectiveYear) === latestYear
          );
          let latestId = Math.max(...curr.map((c) => c.id), 0);
          curr = curr.find((c) => c.id === latestId);

          if (curr) {
            const data = {
              name: curr.name,
              schoolCategoryId: curr.schoolCategoryId,
              courseId: curr.courseId,
              levelId: curr.levelId,
              effectiveYear: curr.effectiveYear,
              active: 1,
            };

            this.updateCurriculum(data, curr.id)
              .then(({ data }) => {
                this.updateRow(curriculums, data);
              })
              .catch((error) => {
                const errors = error.response.data.errors;
                // curriculum.isProcessing = false
                // validate(curriculum, errors, this)
              });
          }
        }

        showNotification(this, 'success', 'Curriculum deleted successfully.');
        this.showModalConfirmation = false;
      });
    },
    loadSubjects(schoolCategoryId) {
      // const { schoolCategoryId } = this.forms.curriculum.fields;
      const { subjects } = this.tables;
      const { subject } = this.paginations;
      subjects.isBusy2 = true;
      let params = { paginate: false, schoolCategoryId };
      this.getSubjectList(params).then(({ data }) => {
        subjects.items = data;
        // subjects.filteredItems = data
        subject.totalRows = data.length;
        this.paginate(subject);
        subjects.isBusy2 = false;
      });
    },
    onAddSubject(level, semesterId = null) {
      this.loadSubjects(level.schoolCategoryId)
      this.showModalSubjects = true;
      this.level = level;
      this.semesterId = semesterId;
      this.filters.subject.departmentId = null;
      this.filters.subject.criteria = null;
    },
    addSubject(row) {
      const { fields } = this.forms.curriculum;
      const { item } = row;
      // check if subject exist in the table
      const result = fields.subjects.find((subject) => subject.id === item.id);
      if (result) {
        showNotification(this, 'danger', item.name + ' is already added.');
        return;
      }
      fields.subjects.push({
        ...item,
        prerequisites: [],
        pivot: {
          levelId: this.level.id,
          schoolCategoryId: this.level.schoolCategoryId,
          semesterId: this.semesterId,
        },
      });
    },
    removeSubject(row) {
      const { subjects } = this.forms.curriculum.fields;
      const index = subjects.findIndex((i) => i.id === row.item.id);
      subjects.splice(index, 1);
    },
    checkRights() {
      const userGroupId = localStorage.getItem('userGroupId');
      const userGroup = UserGroups.getEnum(Number(userGroupId));
      let result = false;

      if (userGroup) {
        this.filters.curriculum.schoolCategoryId = userGroup.schoolCategoryId;
        this.schoolCategoryId = userGroup.schoolCategoryId;
      }
      this.loadCurriculums();
    },
    loadDepartments() {
      let params = { paginate: false };
      const { departments } = this.options;
      this.getDepartmentList(params).then(({ data }) => {
        departments.items = data;
      });
    },
    checkSchoolCategory(isGradSchoolVoc = false) {
      const { schoolCategories: schoolCategoryIds } = this.forms.curriculum.fields;
      const { schoolCategories } = this.options;
      let result = false;
      const ids = schoolCategoryIds.map(s => s.id)
      if (isGradSchoolVoc) {
        result =
          ids.includes(schoolCategories.GRADUATE_SCHOOL.id) || ids.includes(schoolCategories.VOCATIONAL.id)
      } else {
        result =
          ids.includes(schoolCategories.SENIOR_HIGH_SCHOOL.id) || ids.includes(schoolCategories.COLLEGE.id)
      }
      return result;
    },
    filterSubjects(levelId, semesterId = null) {
      const { subjects } = this.forms.curriculum.fields;
      let filteredSubjects = subjects.filter(
        (subject) =>
          subject.pivot.levelId === levelId &&
          subject.pivot.semesterId === semesterId
      );
      return filteredSubjects;
    },
    getSelectedLevel(schoolCategoryId) {
      this.isLoading = true;
      // this.levels = [
      //   this.options.levels.items.find(
      //     (level) => level.id === this.forms.curriculum.fields.levelId
      //   ),
      // ];
      
      const params = { schoolCategoryId, paginate: false }
      this.getLevelList(params).then(({data}) => {
        this.levels.push(...data)
        this.isLoading = false;
      })
      // console.log(this.levels)
    },
    getSemesters(level, event) {
      this.$set(level, 'isShowAll', event);
    },
    filterSemester(level) {
      let defaultSemesters = this.options.semesters.values.slice(0, 2);
      // return defaultSemesters
      if (level.isShowAll) {
        return this.options.semesters.values;
      } else {
        if (this.entryMode === 'Add') {
          return defaultSemesters;
        } else {
          const { subjects } = this.forms.curriculum.fields;
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
      }
    },
    setViewDetails(row) {
      if (!row.detailsShowing) {
        this.$set(row.item, 'isBusy', true);
        this.getCurriculum(row.item.id).then(({ data }) => {
          this.$set(row.item, 'subjects', data.subjects);
          if (
            data.schoolCategoryId === SchoolCategories.SENIOR_HIGH_SCHOOL.id ||
            data.schoolCategoryId === SchoolCategories.COLLEGE.id
          ) {
            // let distinctSemesters = [...new Set(data.subjects.map(subject => subject.pivot.semesterId))]
            let levelsWithSemester = [];
            let params = { paginate: false };
            this.getLevelsOfCourse(data.courseId, params).then(({ data }) => {
              data.forEach((level) => {
                let distinctSemesters = [
                  ...new Set(
                    row.item.subjects
                      .filter((subject) => subject.pivot.levelId === level.id)
                      .map((subject) => subject.pivot.semesterId)
                  ),
                ];
                distinctSemesters.forEach((semester) => {
                  levelsWithSemester.push({
                    ...level,
                    semesterId: semester,
                  });
                });
              });
            });
            this.$set(row.item, 'levels', levelsWithSemester);
          } else {
            this.$set(row.item, 'levels', [data.level]);
          }
          row.item.isBusy = false;
        });
      }
      row.toggleDetails();
    },
    filterPreviewSubjects(subjects, levelId, semesterId) {
      let filteredSubjects = subjects.filter(
        (subject) =>
          subject.pivot.levelId === levelId &&
          subject.pivot.semesterId === semesterId
      );
      return filteredSubjects;
    },
    updateOldCurriculum(data) {
      if (data.active) {
        let curriculum = this.tables.curriculums.items.find(
          (c) =>
            c.active === data.active &&
            c.schoolCategoryId === data.schoolCategoryId &&
            c.levelId === data.levelId &&
            c.courseId === data.courseId &&
            c.id !== data.id
        );
        if (curriculum) {
          curriculum.active = 0;
        }
      }
    },
    showBulletedNotification(errors) {
      const h = this.$createElement;
      const errorList = [];
      Object.keys(errors).forEach((key) => {
        errorList.push(h('li', errors[key][0]));
      });
      const vNodesMsg = h('ul', errorList);
      showNotification(this, 'danger', vNodesMsg);
    },
    onCategoryFilterChange(item) {
      const { curriculum } = this.filters;
      curriculum.schoolCategoryId = item?.id || 0;
      curriculum.schoolCategoryItem = item;
      curriculum.levelId = null,
      curriculum.levelItem = null,
      curriculum.courseId = null
      curriculum.courseItem = null
      // this.loadLevelList()
      this.loadCourseList()
      this.loadCurriculums();
    },
    onLevelFilterChange(item) {
      const { curriculum } = this.filters;
      curriculum.levelId = item?.id || 0;
      curriculum.levelItem = item;
      this.loadCurriculums();
    },
    onCourseFilterChange(item) {
      const { curriculum } = this.filters;
      curriculum.courseId = item?.id || 0;
      curriculum.courseItem = item;
      this.loadCurriculums();
    },
    addSchoolCategory(item) {
      const { schoolCategories } = this.forms.curriculum.fields
      schoolCategories.push({
        id: item.id,
        isCanBePaired: item.isCanBePaired
      })

      if (item.isCanBePaired) {
        this.getSelectedLevel(item.id)
      } else {
        this.loadCoursesOfSchoolCategoryList(item.id)
      }
    },
    removeSchoolCategory(item) {
      const { schoolCategories } = this.forms.curriculum.fields
      const index = schoolCategories.findIndex((i) => i.id === item.id);
      schoolCategories.splice(index, 1);
      const levelIds = this.levels.filter(l => l.schoolCategoryId === item.id).map(l => l.id)
      levelIds.forEach(id => {
        const levelIndex = this.levels.findIndex((i) => i.id === id)
        this.levels.splice(levelIndex, 1);
      })
  
    },
    checkIfSchoolCategoryCanPair(schoolCategory) {
      if (schoolCategory.isCanBePaired) {
        const { schoolCategories } = this.options;
        const { schoolCategories: schoolCategoryIds } = this.forms.curriculum.fields
        const ids = schoolCategoryIds.filter(sc => !sc.isCanBePaired)
        if (ids.length > 0) {
          return true
        }
      } else {
        const { schoolCategories } = this.forms.curriculum.fields
        return schoolCategories.length > 0 ? true : false
      }
    }
  },
  computed: {
    totalUnits() {
      return (subjects, field) => {
        let units = 0;
        subjects.forEach((s) => {
          units += Number(s[field]);
        });
        return units;
      };
    },
    isCourseVisible() {
      const { schoolCategoryId } = this.filters.curriculum;
      const { schoolCategories } = this.options;
      return [
        schoolCategories.SENIOR_HIGH_SCHOOL.id,
        schoolCategories.COLLEGE.id,
        schoolCategories.GRADUATE_SCHOOL.id
      ].includes(schoolCategoryId);
    }
    // totalLabs() {
    //   return subjects => {
    //     let labs = 0
    //     subjects.forEach(s => {
    //       labs += Number(s.labs)
    //     })
    //     return labs
    //   }
    // }
  },
};
</script>
<style>
.collapsed .when-open,
.not-collapsed .when-closed {
  display: none;
}
</style>
