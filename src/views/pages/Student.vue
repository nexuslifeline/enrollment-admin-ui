<template>
  <div>
    <b-row>
      <b-col md=12 v-show="!showEntry">
        <b-card>
          <b-card-body>
            <!-- add button and search -->
            <b-row class="mb-3">
              <b-col md=12>
                <b-row>
                  <b-col md=8>
                    <b-button variant="outline-primary" 
                      @click="setCreate()">
                      <v-icon name="plus-circle" /> ADD NEW STUDENT
                    </b-button>
                  </b-col>
                  <b-col md=4>
                    <b-form-input
                      v-model="filters.student.criteria"
                      type="text" 
                      placeholder="Search">
                    </b-form-input>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <!-- end add button and search -->
            <!-- table -->
            <b-row >
              <b-col md=12>
                <b-table
									small hover outlined show-empty
									:fields="tables.students.fields"
                  :busy="tables.students.isBusy"
                  :items="tables.students.items"
                  :current-page="paginations.student.page"
                  :per-page="paginations.student.perPage"
                  :filter="filters.student.criteria"
                  @filtered="onFiltered($event, paginations.student)">
                  <template v-slot:cell(name)="data">
                    <b-media>
                      <template v-slot:aside>
                        <b-avatar 
                          rounded 
                          blank 
                          size="64" 
                          :text="data.item.firstName.charAt(0) + '' + data.item.lastName.charAt(0)"
                          :src="avatar(data.item)" />
                      </template>
                      <span>{{ data.item.name }}</span><br>
                      <small>Student no.: {{ data.item.studentNo ? data.item.studentNo : 'Awaiting Confirmation' }}</small><br>
                      <small>Address : {{ data.item.address ? 
                        data.item.address.currentCompleteAddress : "" }}
                      </small>
                    </b-media>
                  </template>
                  <template v-slot:cell(contact)="data">
                    Email : {{ data.item.email }} <br>
                    <small>Phone : {{ data.item.phoneNo }}</small> <br>
                    <small>Mobile : {{ data.item.mobileNo }}</small> <br>
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
                  <template v-slot:cell(action)="row">
                    <b-dropdown right variant="link" toggle-class="text-decoration-none" no-caret>
                      <template v-slot:button-content>
                        <v-icon name="ellipsis-v" />
                      </template>
                      <b-dropdown-item 
                        @click="setUpdatePersonnel(row)" >
                        Edit Personnel Info
                      </b-dropdown-item>
                      <b-dropdown-item 
                        @click="setUpdateUser(row)" >
                        Edit Account Info
                      </b-dropdown-item>
                      <b-dropdown-item 
                        @click="forms.user.fields.id = row.item.id, showModalConfirmation = true">
                        Delete
                      </b-dropdown-item>
                    </b-dropdown>
                  </template>
								</b-table>
                <b-row>
                  <b-col md=6>
                    Showing {{ paginations.student.from }} to {{ paginations.student.to }} of {{ paginations.student.totalRows }} records.
                    </b-col>
                  <b-col md=6>
                    <b-pagination
                      v-model="paginations.student.page"
                      :total-rows="paginations.student.totalRows"
                      :per-page="paginations.student.perPage"
                      size="sm"
                      align="end"
                      @input="recordDetails(paginations.student)" />
                    </b-col>
                  </b-row>
              </b-col>
            </b-row>
            <!-- end table -->
          </b-card-body>
        </b-card>
      </b-col>
      <b-col md=12 v-show="showEntry">
        <b-card>
          <b-card-body>
            <b-row>
              <b-col md=12>
                <b-tabs content-class="mt-3" pills vertical nav-wrapper-class="w-25">
                  <b-tab title="Personal Info" active>
                    <b-row>
                      <b-col md="6">
                        <b-form-group>
                          <label class="required">Firstname</label>
                          <b-form-input
                            v-model="forms.student.fields.firstName" 
                            :state="forms.student.states.firstName" />
                          <b-form-invalid-feedback>
                            {{forms.student.errors.firstName}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                        <b-form-group>
                          <label>Middlename</label>
                          <b-form-input
                            v-model="forms.student.fields.middleName" />
                        </b-form-group>
                        <b-form-group>
                          <label class="required">Lastname</label>
                          <b-form-input
                            v-model="forms.student.fields.lastName" 
                            :state="forms.student.states.lastName" />
                          <b-form-invalid-feedback>
                            {{forms.student.errors.lastName}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                      <b-col md="6">
                        <div class="profile-photo-container">
                          <div class="profile-photo">
                            <PhotoViewer
                              
                              :imageUrl="studentPhotoUrl"
                            />

                            <!-- @onPhotoChange="onPhotoChange"
                            @onPhotoRemove="onPhotoRemove" -->
                          </div>
                        </div>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="4">
                        <b-form-group>
                          <label class="required">Birthdate</label>
                          <b-form-input type="date" 
                            v-model="forms.student.fields.birthDate" 
                            :state="forms.student.states.birthDate" />
                          <b-form-invalid-feedback>
                            {{forms.student.errors.birthDate}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                      <b-col md="4">
                        <b-form-group>
                          <label>Mobile No.</label>
                          <b-form-input
                            v-model="forms.student.fields.mobileNo" />
                        </b-form-group>
                      </b-col>
                      <b-col md="4">
                        <b-form-group>
                          <label class="required">Civil Status</label>
                          <b-form-select 
                            v-model="forms.student.fields.civilStatusId"
                            :state="forms.student.states.civilStatusId" >
                            <template v-slot:first>
                              <b-form-select-option :value='null' disabled>--Select Civil Status --</b-form-select-option>
                            </template>
                            <b-form-select-option v-for='civilStatus in options.civilStatuses.items.values' :key='civilStatus.id' :value='civilStatus.id'>
                              {{ civilStatus.name }}
                            </b-form-select-option>
                          </b-form-select>
                          <b-form-invalid-feedback>
                            {{ forms.student.errors.civilStatusId }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                    </b-row>
                  </b-tab>
                  <b-tab title="Address">
                    <b-row>
                      <b-col md=12>
                        <h5>Current Address</h5>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="4">
                        <b-form-group>
                          <label class="required">House No/Street</label>
                          <b-form-input
                            v-model="forms.address.fields.currentHouseNoStreet" 
                            :state="forms.address.states.addressCurrentHouseNoStreet"
                            debounce="500" />
                          <b-form-invalid-feedback>
                            {{forms.address.errors.addressCurrentHouseNoStreet}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                      <b-col md="4">
                        <b-form-group>
                          <label class="required">City/Town</label>
                          <b-form-input
                            v-model="forms.address.fields.currentCityTown" 
                            :state="forms.address.states.addressCurrentCityTown"
                            debounce="500" />
                          <b-form-invalid-feedback>
                            {{forms.address.errors.addressCurrentCityTown}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                      <b-col md="4">
                        <b-form-group>
                          <label class="required">Province</label>
                          <b-form-input
                            v-model="forms.address.fields.currentProvince"
                            :state="forms.address.states.addressCurrentProvince"
                            debounce="500" />
                          <b-form-invalid-feedback>
                            {{forms.address.errors.addressCurrentProvince}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="4">
                        <b-form-group>
                          <label class="required">Postal Code</label>
                          <b-form-input
                            v-model="forms.address.fields.currentPostalCode"
                            :state="forms.address.states.addressCurrentPostalCode"
                            debounce="500" />
                          <b-form-invalid-feedback>
                            {{forms.address.errors.addressCurrentPostalCode}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                      <b-col md="4">
                        <b-form-group>
                          <label>District</label>
                          <b-form-input
                            v-model="forms.address.fields.currentDistrict"
                            debounce="500" />
                        </b-form-group>
                      </b-col>
                      <b-col md="4">
                        <b-form-group>
                          <label>Region</label>
                          <b-form-input
                            v-model="forms.address.fields.currentRegion" />
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="6">
                        <b-form-group>
                          <label class="required">Country</label>
                            <b-form-select 
                              v-model="forms.address.fields.currentCountryId"
                              :state="forms.address.states.addressCurrentCountryId">
                              <template v-slot:first>
                                <b-form-select-option :value='null' disabled>--Select Country --</b-form-select-option>
                              </template>
                              <b-form-select-option v-for='country in options.countries.items.values' :key='country.id' :value='country.id'>
                                {{country.name}}
                              </b-form-select-option>
                            </b-form-select>
                          <b-form-invalid-feedback>
                            {{forms.address.errors.addressCurrentCountryId}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                      <b-col md="6">
                        <b-form-group>
                          <label class="required">Home Landline/Mobile No.</label>
                          <b-form-input
                            v-model="forms.address.fields.currentHomeLandlineMobileNo"
                            :state="forms.address.states.addressCurrentHomeLandlineMobileNo"
                            debounce="500" />
                          <b-form-invalid-feedback>
                            {{forms.address.errors.addressCurrentHomeLandlineMobileNo}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="12">
                        <b-form-group>
                          <label>Complete Address</label>
                          <b-form-textarea
                            rows="3"
                            v-model="forms.address.fields.currentCompleteAddress"
                            :state="forms.address.states.addressCurrentCompleteAddress"
                            debounce="500" />
                          <b-form-invalid-feedback>
                            {{forms.address.errors.addressCurrentCompleteAddress}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <hr>
                    <b-row>
                      <b-col md=6>
                        <h5>Permanent Address</h5>
                      </b-col>
                      <b-col md=6 class="text-right">
                        <b-form-checkbox @input="onSameAddress($event)">Same as Current Address</b-form-checkbox>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="4">
                        <b-form-group>
                          <label class="required">House No/Street</label>
                          <b-form-input
                            v-model="forms.address.fields.permanentHouseNoStreet"
                            :state="forms.address.states.addressPermanentHouseNoStreet"
                            debounce="500" />
                          <b-form-invalid-feedback>
                            {{forms.address.errors.addressPermanentHouseNoStreet}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                      <b-col md="4">
                        <b-form-group>
                          <label class="required">City/Town</label>
                          <b-form-input
                            v-model="forms.address.fields.permanentCityTown"
                            :state="forms.address.states.addressPermanentCityTown"
                            debounce="500" />
                          <b-form-invalid-feedback>
                            {{forms.address.errors.addressPermanentCityTown}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                      <b-col md="4">
                        <b-form-group>
                          <label class="required">Province</label>
                          <b-form-input
                            v-model="forms.address.fields.permanentProvince"
                            :state="forms.address.states.addressPermanentProvince"
                            debounce="500" />
                          <b-form-invalid-feedback>
                            {{forms.address.errors.addressPermanentProvince}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="4">
                        <b-form-group>
                          <label class="required">Postal Code</label>
                          <b-form-input
                            v-model="forms.address.fields.permanentPostalCode"
                            :state="forms.address.states.addressPermanentPostalCode"
                            debounce="500" />
                          <b-form-invalid-feedback>
                            {{forms.address.errors.addressPermanentPostalCode}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                      <b-col md="4">
                        <b-form-group>
                          <label>District</label>
                          <b-form-input
                            v-model="forms.address.fields.permanentDistrict"
                            debounce="500" />
                        </b-form-group>
                      </b-col>
                      <b-col md="4">
                        <b-form-group>
                          <label>Region</label>
                          <b-form-input
                            v-model="forms.address.fields.permanentRegion"
                            debounce="500" />
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="6">
                        <b-form-group>
                          <label class="required">Country</label>
                          <b-form-select 
                            v-model="forms.address.fields.permanentCountryId"
                            :state="forms.address.states.addressPermanentCountryId" >                  
                            <template v-slot:first>
                              <b-form-select-option :value='null' disabled>--Select Country --</b-form-select-option>
                            </template>
                            <b-form-select-option v-for='country in options.countries.items.values' :key='country.id' :value='country.id'>
                              {{country.name}}
                            </b-form-select-option>
                          </b-form-select>
                          <b-form-invalid-feedback>
                            {{forms.address.errors.addressPermanentCountryId}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                      <b-col md="6">
                        <b-form-group>
                          <label class="required">Home Landline/Mobile No.</label>
                          <b-form-input
                            v-model="forms.address.fields.permanentHomeLandlineMobileNo"
                            :state="forms.address.states.addressPermanentHomeLandlineMobileNo"
                            debounce="500" />
                          <b-form-invalid-feedback>
                            {{forms.address.errors.addressPermanentHomeLandlineMobileNo}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="12">
                        <b-form-group>
                          <label>Complete Address</label>
                          <b-form-textarea
                            rows="3"
                            v-model="forms.address.fields.permanentCompleteAddress"
                            :state="forms.address.states.addressPermanentCompleteAddress"
                            debounce="500" />
                          <b-form-invalid-feedback>
                            {{forms.address.errors.addressPermanentCompleteAddress}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                    </b-row>
                  </b-tab>
                  <b-tab title="Family">
                    <b-row>
                      <b-col md="6">
                        <b-form-group>
                          <label class="required">Father</label>
                          <b-form-input
                            v-model="forms.family.fields.fatherName"
                            :state="forms.family.states.familyFatherName" 
                            debounce="500"/>
                          <b-form-invalid-feedback>
                            {{forms.family.errors.familyFatherName}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                      <b-col md="6">
                        <b-form-group>
                          <label>Contact No.</label>
                          <b-form-input
                            v-model="forms.family.fields.fatherMobileNo" 
                            debounce="500"/>
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="6">
                        <b-form-group>
                          <label>Occupation</label>
                          <b-form-input
                            v-model="forms.family.fields.fatherOccupation" 
                            debounce="500"/>
                        </b-form-group>
                      </b-col>
                      <b-col md="6">
                        <b-form-group>
                          <label>Email Address</label>
                          <b-form-input
                            v-model="forms.family.fields.fatherEmail"
                            :state="forms.family.states.familyFatherEmail"
                            debounce="500" />
                          <b-form-invalid-feedback>
                            {{forms.family.errors.familyFatherEmail}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row class="mt-3">
                      <b-col md="6">
                        <b-form-group>
                          <label class="required">Mother</label>
                          <b-form-input
                            v-model="forms.family.fields.motherName"
                            :state="forms.family.states.familyMotherName" 
                            debounce="500"/>
                          <b-form-invalid-feedback>
                            {{forms.family.errors.familyMotherName}}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </b-col>
                      <b-col md="6">
                        <b-form-group>
                          <label>Contact No.</label>
                          <b-form-input
                            v-model="forms.family.fields.motherMobileNo" 
                            debounce="500"/>
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="6">
                        <b-form-group>
                          <label>Occupation</label>
                          <b-form-input
                            v-model="forms.family.fields.motherOccupation" 
                            debounce="500"/>
                        </b-form-group>
                      </b-col>
                      <b-col md="6">
                        <b-form-group>
                          <label>Email Address</label>
                          <b-form-input
                            v-model="forms.family.fields.motherEmail"
                            :state="forms.family.states.familyMotherEmail" 
                            debounce="500"/>
                          <b-form-invalid-feedback>
                            {{forms.family.errors.familyMotherEmail}}
                          </b-form-invalid-feedback>
                          </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md=12>
                        <b-row>
                          <b-col md=12>
                            <h6>In case of emergency, Please contact : </h6>
                          </b-col>
                        </b-row>
                        <b-row>
                          <b-col md="6">
                            <b-form-group>
                              <label class="required">Parent/Guardian</label>
                              <b-form-input 
                                v-model="forms.family.fields.parentGuardianName"
                                :state="forms.family.states.familyParentGuardianName" 
                                debounce="500"/>
                              <b-form-invalid-feedback>
                                {{forms.family.errors.familyParentGuardianName}}
                              </b-form-invalid-feedback>
                            </b-form-group>
                          </b-col>
                          <b-col md="6">
                            <b-form-group>
                              <label class="required">Parent/Guardian Contact No.</label>
                              <b-form-input 
                                v-model="forms.family.fields.parentGuardianContactNo"
                                :state="forms.family.states.familyParentGuardianContactNo" 
                                debounce="500"/>
                              <b-form-invalid-feedback>
                                {{forms.family.errors.familyParentGuardianContactNo}}
                              </b-form-invalid-feedback>
                            </b-form-group>
                          </b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                  </b-tab>
                  <b-tab title="Education">
                    <b-row>
                      <b-col md="8">
                        <b-form-group>
                          <label>Last School Attended</label>
                          <b-form-input
                            v-model="forms.education.fields.lastSchoolAttended" 
                            debounce="500"/>
                        </b-form-group>
                      </b-col>
                      <b-col md="4">
                        <b-form-group>
                        <label>Level</label>
                        <b-form-input
                          v-model="forms.education.fields.year" 
                          debounce="500"/>
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="12">
                        <b-form-group>
                          <label>Last School Address</label>
                          <b-form-input
                            v-model="forms.education.fields.lastSchoolAddress" 
                            debounce="500"/>
                        </b-form-group>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="12">
                        <b-row>
                          <b-col md="6">
                            <b-form-group>
                            <label>Elementary Course Completed or Primary</label>
                            <b-form-input
                              v-model="forms.education.fields.elementaryCourse" 
                              debounce="500"/>
                            </b-form-group>
                          </b-col>
                          <b-col md="3">
                            <b-form-group>
                              <label>Year</label>
                              <b-form-input
                                v-model="forms.education.fields.elementaryCourseYear" 
                                debounce="500"/>
                            </b-form-group>
                          </b-col>
                          <b-col md="3">
                            <b-form-group>
                              <label>Honor Received</label>
                              <b-form-input
                                v-model="forms.education.fields.elementaryCourseHonors"
                                debounce="500"/>
                            </b-form-group>
                          </b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="12">
                        <b-row>
                          <b-col md="6">
                            <b-form-group>
                              <label>High School Course Completed or Secondary</label>
                              <b-form-input
                                v-model="forms.education.fields.highSchoolCourse" 
                                debounce="500"/>
                            </b-form-group>
                          </b-col>
                          <b-col md="3">
                            <b-form-group>
                              <label>Year</label>
                              <b-form-input
                                v-model="forms.education.fields.highSchoolCourseYear" 
                                debounce="500"/>
                            </b-form-group>
                          </b-col>
                          <b-col md="3">
                            <b-form-group>
                              <label>Honor Received</label>
                              <b-form-input
                                v-model="forms.education.fields.highSchoolCourseHonors" 
                                debounce="500"/>
                            </b-form-group>
                          </b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="12">
                        <b-row>
                          <b-col md="6">
                            <b-form-group>
                              <label style="font-size: 12px">Senior School Course Completed or Upper Secondary</label>
                              <b-form-input
                                v-model="forms.education.fields.seniorSchoolCourse" 
                                debounce="500"/>
                            </b-form-group>
                          </b-col>
                          <b-col md="3">
                            <b-form-group>
                              <label>Year</label>
                              <b-form-input
                                v-model="forms.education.fields.seniorSchoolCourseYear" 
                                debounce="500"/>
                            </b-form-group>
                          </b-col>
                          <b-col md="3">
                            <b-form-group>
                              <label>Honor Received</label>
                              <b-form-input
                                v-model="forms.education.fields.seniorSchoolCourseHonors" 
                                debounce="500"/>
                            </b-form-group>
                          </b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="12">
                        <b-row>
                          <b-col md="6">
                            <b-form-group>
                              <label >College Degree(if graduated) or Tertiary</label>
                              <b-form-input
                                v-model="forms.education.fields.collegeDegree" 
                                debounce="500"/>
                            </b-form-group>
                          </b-col>
                          <b-col md="3">
                            <b-form-group>
                              <label>Year</label>
                              <b-form-input
                                v-model="forms.education.fields.collegeDegreeYear" 
                                debounce="500"/>
                              </b-form-group>
                          </b-col>
                          <b-col md="3">
                            <b-form-group>
                              <label>Honor Received</label>
                              <b-form-input
                                v-model="forms.education.fields.collegeDegreeHonors" 
                                debounce="500"/>
                            </b-form-group>
                          </b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                  </b-tab>
                </b-tabs>
              </b-col>
            </b-row>
            
          </b-card-body>
          <template v-slot:footer>
            <b-row class="mt-3">
              <b-col md=2 offset-md="8">
                <b-button variant="outline-primary" block> Save </b-button>
              </b-col>
              <b-col md=2>
                <b-button @click="showEntry=false" variant="outline-danger" block> Cancel </b-button>
              </b-col>
            </b-row>
          </template>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>

const studentFields = {
  id: null,
  studentNo: null,
  firstName: null,
  middleName: null,
  lastName: null,
  mobileNo: null,
  birthDate: null,
  civilStatusId: null,
}

const addressFields = {
  currentHouseNoStreet: null,
  currentCityTown: null,
  currentProvince: null,
  currentRegion: null,
  currentDistrict: null,
  currentPostalCode: null,
  currentCountryId: Countries.PHILIPPINES.id,
  currentCompleteAddress: null,
  currentHomeLandlineMobileNo: null,
  permanentHouseNoStreet: null,
  permanentCityTown: null,
  permanentProvince: null,
  permanentRegion: null,
  permanentDistrict: null,
  permanentPostalCode: null,
  permanentCountryId: Countries.PHILIPPINES.id,
  permanentCompleteAddress: null,
  permanentHomeLandlineMobileNo: null
}

const addressErrorFields = {
  addressCurrentHouseNoStreet: null,
  addressCurrentCityTown: null,
  addressCurrentProvince: null,
  addressCurrentRegion: null,
  addressCurrentDistrict: null,
  addressCurrentPostalCode: null,
  addressCurrentCountryId: null,
  addressCurrentCompleteAddress: null,
  addressCurrentHomeLandlineMobileNo: null,
  addressPermanentHouseNoStreet: null,
  addressPermanentCityTown: null,
  addressPermanentProvince: null,
  addressPermanentRegion: null,
  addressPermanentDistrict: null,
  addressPermanentPostalCode: null,
  addressPermanentCountryId: null,
  addressPermanentCompleteAddress: null,
  addressPermanentHomeLandlineMobileNo: null
}

const familyFields = {
  fatherName: null,
  fatherOccupation: null,
  fatherMobileNo: null,
  fatherEmail: null,
  motherName: null,
  motherOccupation: null,
  motherMobileNo: null,
  motherEmail: null,
  parentGuardianName: null,
  parentGuardianContactNo: null
}

const familyErrorFields = {
  familyFatherName: null,
  familyFatherOccupation: null,
  familyFatherMobileNo: null,
  familyFatherEmail: null,
  familyMotherName: null,
  familyMotherOccupation: null,
  familyMotherMobileNo: null,
  familyMotherEmail: null,
  familyParentGuardianName: null,
  familyParentGuardianContactNo: null
}

const educationFields = {
  lastSchoolAttended: null,
  lastSchoolAddress: null,
  year: null,
  elementaryCourse: null,
  elementaryCourseYear: null,
  elementaryCourseHonors: null,
  highSchoolCourse: null,
  highSchoolCourseYear: null,
  highSchoolCourseHonors: null,
  seniorSchoolCourse: null,
  seniorSchoolCourseYear: null,
  seniorSchoolCourseHonors: null,
  collegeDegree: null,
  collegeDegreeYear: null,
  collegeDegreeHonors: null,
}

import { StudentApi, UserGroupApi } from "../../mixins/api"
import { validate, reset, showNotification, clearFields } from '../../helpers/forms'
import { Countries, CivilStatuses } from "../../helpers/enum"
import Tables from "../../helpers/tables"
import PhotoViewer from '../components/PhotoViewer'
export default {
	name: "Student",
  mixins: [StudentApi, Tables],
  components: {
    PhotoViewer,
  },
	data() {
		return {
      showModalEntry: false,
      showEntry: false,
      studentPhotoUrl: null,
      Countries: Countries,
      CivilStatuses: CivilStatuses,
      entryMode: "",
      forms: {
        student: {
          fields: { ...studentFields },
          states: { ...studentFields },
          errors: { ...studentFields }
        },
        address: {
          fields: { ...addressFields },
          states: { ...addressErrorFields },
          errors: { ...addressErrorFields }
        },
        family: {
          fields: { ...familyFields },
          states: { ...familyErrorFields },
          errors: { ...familyErrorFields }
        },
        education: {
          fields: { ...educationFields },
          states: { ...educationFields },
          errors: { ...educationFields }
        },
      },
			tables: {
				students: {
          isBusy: false,
					fields: [
						{
							key: "name",
							label: "Name",
							tdClass: "align-middle",
							thStyle: { width: "50%"},
							formatter: (value, key, item) => {
								if(!item.middleName) {
									item.middleName = ""
								}
								item.name = item.firstName + " " + item.middleName + " " + item.lastName
							} 
						},
						{
							key: "contact",
							label: "Contact Info",
							tdClass: "align-middle",
							thStyle: { width: "45%" },
						},
						{
							key: "action",
							label: "",
							tdClass: "align-middle",
							thStyle: { width: "40px"}
						},
					],
					items: []
				}
      },
      paginations: {
				student: {
					from: 0,
					to: 0,
					totalRows: 0,
					page: 1,
					perPage: 10,
				}
      },
      filters: {
        student: {
          criteria: null
        }
      },
      options: {
        civilStatuses: {
          items: CivilStatuses
        },
        countries: {
          items: Countries
        },
        
      }
		}
	},
	created() {
    this.loadStudents()
   
	},
	methods: {
		loadStudents() {
      const { students } = this.tables
      const { student } = this.paginations

      students.isBusy = true

			let params = { paginate: false }
      this.getStudentList(params).then(({ data }) =>{
        students.items = data
        console.log(students.items)
        student.totalRows = data.length
        this.recordDetails(student)
        students.isBusy = false
      })
    },
    onUserEntry() {
      // const { user, personnel, personnel: { fields: { id } } } = this.forms
      // const { users } = this.tables
      // user.isProcessing = true
      // reset(user)
      // reset(personnel)
      // if(this.entryMode == "Add"){
      //   const data = { ...personnel.fields, user: user.fields }
      //   this.addPersonnel(data)
      //     .then(({ data }) => {
      //       this.addRow(users, this.paginations.user, data)
      //       user.isProcessing = false
      //       showNotification(this, "success", "User created successfully.")
      //       this.showModalEntry = false
      //     })
      //     .catch(error => {
      //       const errors = error.response.data.errors
      //       user.isProcessing = false
      //       validate(user, errors)
      //       validate(personnel, errors)
      //     })
      // }
      // else if (this.entryMode == "Edit Personnel") {
      //   this.updatePersonnel(personnel.fields, id)
      //     .then(({ data }) => {
      //       this.updateRow(users, data)
      //       user.isProcessing = false
      //       showNotification(this, "success", "User updated successfully.")
      //       this.showModalUpdatePersonnel = false
      //     })
      //     .catch(error => {
      //       const errors = error.response.data.errors
      //       user.isProcessing = false
      //       validate(personnel, errors)
      //     })
      // }
      // else if (this.entryMode == "Edit User") {
      //   const data = { user: user.fields }
      //   this.updatePersonnel(data, id)
      //     .then(({ data }) => {
      //       this.updateRow(users, data)
      //       user.isProcessing = false
      //       showNotification(this, "success", "User updated successfully.")
      //       this.showModalUpdateUser = false
      //     })
      //     .catch(error => {
      //       const errors = error.response.data.errors
      //       user.isProcessing = false
      //       validate(user, errors)
      //     })
      // }
    },
    onUserGroupDelete() {
      // const { user, user: { fields: { id } } } = this.forms
      // const { users } = this.tables
      // user.isProcessing = true
      // this.deletePersonnel(id)
      //   .then(({ data }) => {
      //     this.deleteRow(users, this.paginations.user, id)
      //     user.isProcessing = false
      //     showNotification(this, "success", "User deleted successfully.")
      //     this.showModalConfirmation = false
      //   })
    },
    setUpdateUser(row) {
      // const { personnel, user, user: { fields } } = this.forms
      // const { item } = row
      // clearFields(fields)
      // reset(user)

      // personnel.fields.id = item.id
      // fields.username = item.user.username
      // fields.userGroupId = item.user.userGroupId

      // this.entryMode = "Edit User"
      // this.showModalUpdateUser = true
    },
    setUpdatePersonnel(row) {
      // const { personnel, personnel: { fields } } = this.forms
      // const { item } = row
      // clearFields(fields)
      // reset(personnel)
      // console.log(item)
      // fields.id = item.id
      // fields.firstName = item.firstName
      // fields.middleName = item.middleName
      // fields.lastName = item.lastName
      // fields.birthDate = item.birthDate

      // this.entryMode = "Edit Personnel"
      // this.showModalUpdatePersonnel = true
    },
    setCreate() {
      // const { user, personnel } = this.forms
      // reset(user)
      // reset(personnel)
      // clearFields(user.fields)
      // clearFields(personnel.fields)
      this.entryMode='Add'
      //this.showModalEntry = true
      this.showEntry = true
    },
    avatar(student){
      let src = ''
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName
      }
      return src
    },
	}
}
</script>
<style lang="scss" scoped >
  @import "../../assets/scss/shared.scss";

  .profile-photo {
    height: 200px;
    width: 200px;
  }

  .profile-photo-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
</style>