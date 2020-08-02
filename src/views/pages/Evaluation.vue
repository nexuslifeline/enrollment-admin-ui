<template>
	<div>
    <b-row>
      <b-col md=12>
				<b-card>
					<b-card-body>
						<b-row>
							<b-col md=9>
								<SchoolCategoryTabs
                  :showAll="true" 
                  :schoolCategoryId="schoolCategoryId"
                  @clickAll="filters.student.schoolCategoryId = null, filters.student.courseId = null, loadEvaluation()"
                  @click="filters.student.schoolCategoryId = $event, filters.student.courseId = null, loadEvaluation()" />
							</b-col>
						</b-row>
						<hr>
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
              details-td-class="table-secondary"
							hover outlined small show-empty responsive
							:fields="tables.students.fields"
							:items="tables.students.items"
							:busy="tables.students.isBusy"
						>
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
									<span>{{ data.item.student.name }}</span><br>
                  <small>Student no.: {{ data.item.student.studentNo ? data.item.student.studentNo : 'Awaiting Confirmation' }}</small><br>
									<small>Address : {{ data.item.student.address ? 
                    data.item.student.address.currentCompleteAddress : "" }}
                  </small>
								</b-media>
							</template>
              <template v-slot:cell(contact)="data">
                Email : {{ data.item.student.email }} <br>
                <small>Phone : {{ data.item.student.phoneNo }}</small> <br>
                <small>Mobile : {{ data.item.student.mobileNo }}</small> <br>
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
							<template v-slot:cell(action)="row">
								<v-icon 
									:name="row.detailsShowing ? 'caret-down' : 'caret-left'" 
									@click="loadDetails(row)" />
							</template>
							<template v-slot:row-details="data">
								<b-overlay :show="data.item.isLoading" rounded="sm">
									<b-card>
                    <b-card>
                      <div v-if="data.item.files">
                        <h5>Files</h5>
                        <b-table
                          hover outlined small responsive show-empty
                          :fields="tables.files.fields"
                          :items="data.item.files"
                          :busy="tables.files.isBusy">
                          <template v-slot:cell(action)="row">
                            <b-button 
                              @click="previewFile(row)" 
                              size="sm" variant="secondary">
                              <v-icon 
                                name="search"/>
                            </b-button>
                          </template>
                        </b-table>
                      </div>
                    </b-card>
                    <b-card>
                      <b-row>
                        <b-col md="12">
                          <b-row class="mb-2">
                            <b-col md=12>
                              <span class="font-weight-bold">Student Information</span>
                              <hr class="m-0 border-light">
                            </b-col>
                          </b-row>
                          <b-row class="pb-1">
                            <b-col md=6>
                              Student Number : <span class="font-weight-bold">{{ data.item.student.studentNo ? data.item.student.studentNo : 'Awaiting Confirmation' }}</span>
                            </b-col>
                            <b-col md=6>
                              Name : <span class="font-weight-bold">{{ data.item.student.name }}</span>
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
                              Contact Number : <span class="font-weight-bold">{{ data.item.student.mobileNo }}</span>
                            </b-col>
                          </b-row>
                          <b-row class="pb-1">
                            <b-col md=6>
                              Email : <span class="font-weight-bold">{{ data.item.student.email }}</span>
                            </b-col>
                            <b-col md=6>
                              Address : 
                              <span class="font-weight-bold">
                                {{ data.item.student.address ? data.item.student.address.currentCompleteAddress : "" }}
                              </span>
                            </b-col>
                          </b-row>
                          <b-row class="my-2 pb-1">
                            <b-col md=12>
                              <span class="font-weight-bold">Previous Educational Background</span>
                              <hr class="m-0 border-light">
                            </b-col>
                          </b-row>
                          <b-row class="pb-1">
                            <b-col md=6>
                              Last School Attended : <span class="font-weight-bold">{{ data.item.lastSchoolAttended }}</span>
                            </b-col>
                            <b-col md=6 v-if="data.item.enrolledYear">
                              Enrolled Year : <span class="font-weight-bold">{{ data.item.enrolledYear }}</span>
                            </b-col>
                          </b-row>
                          <b-row class="pb-1">
                            <b-col md=6>
                              From : <span class="font-weight-bold"> {{ data.item.lastSchoolYearFrom }} </span> To : <span  class="font-weight-bold"> {{data.item.lastSchoolYearTo}}</span>
                            </b-col>
                          </b-row>
                          <b-row class="my-2 pb-1">
                            <b-col md=12>
                              <span class="font-weight-bold">Applying for Academic Record</span>
                              <hr class="m-0 border-light">
                            </b-col>
                          </b-row>
                          <b-row class="pb-1">
                            <b-col md=6>
                              <div class="d-flex flex-row">
                                <div>Curriculum : </div>
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
                            <b-col md=6 v-if="data.item.course">
                              Course : <span class="font-weight-bold">{{ data.item.course.description }}</span>
                            </b-col>
                          </b-row>
                          <b-row class="pb-1">
                            <b-col md=6>
                              Level : <span class="font-weight-bold">{{ getName(data.item, 'level') }}</span>
                            </b-col>
                            <b-col md=6 v-if="data.item.semesterId">
                              Semester : <span class="font-weight-bold">{{ semesters.getEnum(data.item.semesterId).name }}</span>
                            </b-col>
                          </b-row>
                        </b-col>
                      </b-row>
                    </b-card>
                    <b-card>
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

                            <!-- <b-form-select
                              @change="loadCurriculum($event, data)"
                              :disabled="!data.item.curriculumEdit"
                              v-model="data.item.curriculumId">
                              <template v-slot:first>
                                <b-form-select-option :value="null" disabled>-- Curriculum --</b-form-select-option>
                              </template>
                              <b-form-select-option 
                                v-for="curriculum in options.curriculums.items" 
                                :key="curriculum.id" 
                                :value="curriculum.id">
                                {{ curriculum.name }}
                              </b-form-select-option>
                            </b-form-select> -->
                              <!-- <template v-slot:append>
                                <b-btn 
                                  :disabled="data.item.evaluationStatusId !== evaluationStatuses.SUBMITTED.id"
                                  @click="data.item.curriculumEdit = !data.item.curriculumEdit"
                                  :variant="data.item.curriculumEdit ? 'outline-success' : 'outline-primary'">
                                  <v-icon
                                    :name="data.item.curriculumEdit ? 'check' : 'pen'" />
                                </b-btn>
                              </template> -->
                            <!-- <h5>
                              Curriculum : {{ data.item.curriculum.name }}
                            </h5> -->
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
                                <template v-slot:head(action)>
                                  <b-form-checkbox
                                    v-if="data.item.evaluationStatusId === evaluationStatuses.SUBMITTED.id"
                                    @input="toggleCheckAll(data.item.subjects, $event)"
                                    v-model="data.item.isTakenAll">
                                    Credited
                                  </b-form-checkbox>
                                </template>
                                <template v-slot:cell(action)="row">
                                  <b-form-checkbox
                                    :disabled="data.item.evaluationStatusId !== evaluationStatuses.SUBMITTED.id"
                                    :value=1
                                    :unchecked-value=0
                                    v-model="row.item.subject.pivot.isTaken" />
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
                                            <template v-slot:head(action)>
                                              <b-form-checkbox
                                                v-if="data.item.evaluationStatusId === evaluationStatuses.SUBMITTED.id"
                                                @input="toggleCheckAll(filterSubjects(data, level.id, semester.id).items, $event)"
                                                v-model="filterSubjects(data, level.id, semester.id).isTakenAll">
                                                Credited
                                              </b-form-checkbox>
                                            </template>
                                            <template v-slot:cell(action)="row">
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
                    </b-card>
									</b-card>
									<b-button
                    v-if="data.item.evaluationStatusId === evaluationStatuses.SUBMITTED.id"
                    @click="setDisapproval(data)"
                    class="float-right my-2 mr-2" 
                    variant="outline-danger">Reject</b-button>
									<b-button
                    v-if="data.item.evaluationStatusId === evaluationStatuses.SUBMITTED.id"
                    @click="setApproval(data)"
                    class="float-right m-2" 
                    variant="outline-primary">Approve</b-button>
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
					</b-card-body>
				</b-card>
      </b-col>
    </b-row>
    <!-- Modal Preview -->
    <b-modal 
			v-model="showModalPreview"
			size="xl"
			header-bg-variant="success"
			header-text-variant="light"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					Preview
			</div> <!-- modal title -->
			<b-row class="justify-content-md-center"> <!-- modal body -->
				<b-col md=12>
          <div v-if="file.src">
            <center>
              <b-img
                fluid 
                v-if="file.type.substr(0, file.type.indexOf('/')) == 'image'" 
                :src="file.src" />
              <b-embed
                v-else
                type="iframe"
                aspect="16by9"
                allowfullscreen
                :src="file.src"
              ></b-embed>
            </center>
          </div>
				</b-col>
			</b-row> <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button 
          class="float-right"
          variant="outline-danger"
          @click="showModalPreview=false">
          Close
        </b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
    <!-- Modal Preview -->
		<!-- Modal Approval -->
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
          variant="outline-primary">
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
          class="float-right" variant="outline-primary">
					Confirm
				</b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
		<!-- Modal Reject -->
    <!-- Modal Subject -->
    <div v-if="showModalPreview" class="preview__modal-description">
      <div class="mx-auto">
        Filename : {{ file.name }}<br>
        Notes : {{ file.notes }}
      </div>
    </div>
    <!-- Modal Subject -->
	</div> <!-- main container -->
</template>
<script>
import { EvaluationApi, EvaluationFileApi, CurriculumApi, CourseApi } from "../../mixins/api"
import { SchoolCategories, EvaluationStatuses, Semesters, UserGroups, StudentCategories } from "../../helpers/enum"
import { showNotification, formatNumber, clearFields } from "../../helpers/forms"
import Tables from "../../helpers/tables"
import SchoolCategoryTabs from "../components/SchoolCategoryTabs"
import { copyValue } from '../../helpers/extractor'

const evaluationFields = {
  evaluationStatusId: null,
  approvalNotes: null,
  disapprovalNotes: null
}

export default {
	name: "Evaluation",
  mixins: [EvaluationApi, EvaluationFileApi, CurriculumApi, CourseApi, Tables],
  components: {
    SchoolCategoryTabs
  },
	data() {
		return {
      showModalPreview: false,
			showModalApproval: false,
      showModalRejection: false,
      showModalSubjects: false,
			isLoading: false,
      evaluationStatuses: EvaluationStatuses,
      semesters: Semesters,
      studentCategories: StudentCategories,
      file: {
        type: null,
        src: null,
        name: null,
        notes: null
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
							formatter: (value, key, item) => {
								if(!item.student.middleName){
									item.student.middleName = ""
								}
								item.student.name = item.student.firstName + " " + item.student.middleName + " " + item.student.lastName
							} 
						},
						{
							key: "contact",
							label: "Contact Info",
							tdClass: "align-middle",
							thStyle: { width: "20%" },
							
						},
						{
							key: "education",
							label: "Education",
							tdClass: "align-middle",
              thStyle: { width: "20%"}
            },
            {
              key: "studentCategory.name",
							label: "Student Category",
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
							key: "action",
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
      if (row.item.curriculumMsg) {
        showNotification(this, 'danger', 'Please set a curriculum before approving.')
        return
      }
      this.row = row
      this.showModalApproval = true
    },
    onApproval() {
      const { 
        item,
        item: {
          id: evaluationId
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
      const curriculumId = item.curriculumId
      const studentCurriculumId = item.studentCurriculumId

      const data = {
        ...evaluation,
        curriculumId,
        studentCurriculumId,
        subjects
      }

      this.isProcessing = true;
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
      this.row = row
      this.showModalRejection = true
    },
    onDisapproval() {
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

      this.isProcessing = true;
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
			let params = { 
				paginate: true, 
				perPage, page, 
        evaluationStatusId, 
        schoolCategoryId,
        courseId,
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
    getName(item, child){
      if (item) {
        let value = item[child]
        if (value) {
          return value['name']
        }
      }
      return ''
    },
    previewFile(row) {
      const { evaluationId, id, name, notes } = row.item
      this.file.type = null
      this.file.src = null
      this.file.name = name
      this.file.notes = notes
      this.getEvaluationFilePreview(evaluationId, id)
        .then(response => {
          this.file.type = response.headers.contentType
          const file = new Blob([response.data], { type: response.headers.contentType })
          const reader = new FileReader();
          
          reader.onload = e => this.file.src = e.target.result
          reader.readAsDataURL(file);
          this.showModalPreview = true
        })
    },
    loadCurriculum(id, row) {
      const { subjects } = this.tables
      subjects.isBusy = true
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
    },
  }
}
</script>
<style scoped lang="scss">
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