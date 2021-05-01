<template>
  <div class="main-container ">
    <b-overlay :show="isLoading" rounded="sm">
    <div>
      <h4>
        {{ entryMode === 'Add' ? 'Student - Create' : 'Student - Edit'  }}
      </h4>
    </div>
    <div class="content-container">
      <div class="left-pane">
        <ul class="sub-nav">
            <li
              v-for="(item, idx) in tabHeaders"
              :key="idx"
              class="sub-nav__item"
              :class="{ active: idx === activeTabIndex }">
              <span
                @click="setActiveIndex(idx)"
                class="sub-nav__link">
                {{item.header}}
              </span>
            </li>
          </ul>
      </div>
      <div class="right-pane">
        <div class="header-container">
          <h4>{{ tabHeaders[activeTabIndex].header }}</h4>
          <small>{{ tabHeaders[activeTabIndex].description }}</small>
        </div>
        <div >
          <div v-show="activeTabIndex === 0">
            <b-row>
              <b-col md="6">
                <b-form-group>
                  <label >Student No.</label>
                  <b-form-input
                    v-model="forms.student.fields.studentNo"
                    placeholder="Awaiting Confirmation"
                    readonly
                    debounce="500"/>
                </b-form-group>
                <b-form-group>
                  <label class="required">Firstname</label>
                  <b-form-input
                    v-model="forms.student.fields.firstName"
                    :state="forms.student.states.firstName"
                    debounce="500"/>
                  <b-form-invalid-feedback>
                    {{forms.student.errors.firstName}}
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group>
                  <label>Middlename</label>
                  <b-form-input
                    v-model="forms.student.fields.middleName"
                    debounce="500"/>
                </b-form-group>
                <b-form-group>
                  <label class="required">Lastname</label>
                  <b-form-input
                    v-model="forms.student.fields.lastName"
                    :state="forms.student.states.lastName"
                    debounce="500"/>
                  <b-form-invalid-feedback>
                    {{forms.student.errors.lastName}}
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group>
                  <label class="required">Birthdate</label>
                  <b-form-input type="date"
                    v-model="forms.student.fields.birthDate"
                    :state="forms.student.states.birthDate" />
                  <b-form-invalid-feedback>
                    {{forms.student.errors.birthDate}}
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group>
                  <label>Mobile No.</label>
                  <masked-input
                    type="text"
                    class="form-control"
                    v-model="forms.student.fields.mobileNo"
                    :mask="['(', '+', '6', '3', ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]"
                    :guide="false"
                    :showMask="false"
                    placeholderChar="_">
                  </masked-input>
                </b-form-group>
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
              <b-col md="6">
                <div class="profile-photo-container">
                  <div class="profile-photo">
                    <PhotoViewer
                      @onPhotoChange="onPhotoChange"
                      @onPhotoRemove="onPhotoRemove"
                      :imageUrl="studentPhotoUrl"
                    />
                  </div>
                </div>
              </b-col>
            </b-row>
          </div>
          <div v-show="activeTabIndex === 1">
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
                    debounce="500"/>
                  <b-form-invalid-feedback>
                    {{forms.address.errors.addressCurrentHouseNoStreet}}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group>
                  <label class="required">Barangay</label>
                  <b-form-input
                    v-model="forms.address.fields.currentBarangay"
                    :state="forms.address.states.addressCurrentBarangay"
                    debounce="500"/>
                  <b-form-invalid-feedback>
                    {{forms.address.errors.addressCurrentBarangay}}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group>
                  <label class="required">City/Town</label>
                  <b-form-input
                    v-model="forms.address.fields.currentCityTown"
                    :state="forms.address.states.addressCurrentCityTown"
                    debounce="500"/>
                  <b-form-invalid-feedback>
                    {{forms.address.errors.addressCurrentCityTown}}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="4">
                <b-form-group>
                  <label class="required">Province</label>
                  <b-form-input
                    v-model="forms.address.fields.currentProvince"
                    :state="forms.address.states.addressCurrentProvince"
                    debounce="500"/>
                  <b-form-invalid-feedback>
                    {{forms.address.errors.addressCurrentProvince}}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group>
                  <label class="required">Postal/Zip Code</label>
                  <b-form-input
                    v-model="forms.address.fields.currentPostalCode"
                    :state="forms.address.states.addressCurrentPostalCode"
                    debounce="500"/>
                  <b-form-invalid-feedback>
                    {{forms.address.errors.addressCurrentPostalCode}}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group>
                  <label >District</label>
                  <b-form-input
                    v-model="forms.address.fields.currentDistrict"
                    debounce="500"/>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="4">
                <b-form-group>
                  <label>Region</label>
                  <b-form-input
                    v-model="forms.address.fields.currentRegion"
                    debounce="500"/>
                </b-form-group>
              </b-col>
              <b-col md="4">
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
              <b-col md="4">
                <b-form-group>
                  <label class="required">Home Landline/Mobile No.</label>
                  <b-form-input
                    v-model="forms.address.fields.currentHomeLandlineMobileNo"
                    :state="forms.address.states.addressCurrentHomeLandlineMobileNo"
                    debounce="500"/>
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
                    debounce="500"/>
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
                    debounce="500"/>
                  <b-form-invalid-feedback>
                    {{forms.address.errors.addressPermanentHouseNoStreet}}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group>
                  <label class="required">Barangay</label>
                  <b-form-input
                    v-model="forms.address.fields.permanentBarangay"
                    :state="forms.address.states.addressPermanentBarangay"
                    debounce="500"/>
                  <b-form-invalid-feedback>
                    {{forms.address.errors.addressPermanentBarangay}}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group>
                  <label class="required">City/Town</label>
                  <b-form-input
                    v-model="forms.address.fields.permanentCityTown"
                    :state="forms.address.states.addressPermanentCityTown"
                    debounce="500"/>
                  <b-form-invalid-feedback>
                    {{forms.address.errors.addressPermanentCityTown}}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
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
              <b-col md="4">
                <b-form-group>
                  <label class="required">Postal/Zip Code</label>
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
            </b-row>
            <b-row>
              <b-col md="4">
                <b-form-group>
                  <label>Region</label>
                  <b-form-input
                    v-model="forms.address.fields.permanentRegion"
                    debounce="500" />
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group>
                  <label class="required">Country</label>
                  <b-form-select
                    v-model="forms.address.fields.permanentCountryId"
                    :state="forms.address.states.addressPermanentCountryId">
                    <template v-slot:first>
                      <b-form-select-option :value='null' disabled>--Select Contry --</b-form-select-option>
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
              <b-col md="4">
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
          </div>
          <div v-show="activeTabIndex === 2">
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
          </div>
          <div v-show="activeTabIndex === 3">
            <b-row>
              <b-col md="5">
                <b-form-group>
                  <label>Last School Attended</label>
                  <b-form-input
                    v-model="forms.education.fields.lastSchoolAttended"
                    debounce="500"/>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group>
                  <label>From</label>
                  <b-form-input
                    v-model="forms.education.fields.lastSchoolYearFrom"
                    debounce="500"/>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group>
                  <label>To</label>
                  <b-form-input
                    v-model="forms.education.fields.lastSchoolYearTo"
                    debounce="500"/>
                </b-form-group>
              </b-col>
              <b-col md="3">
                <b-form-group>
                  <label>Level</label>
                  <b-form-input
                    v-model="forms.education.fields.lastLevel"
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
                    debounce="500" />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <b-row>
                  <b-col md="5">
                    <b-form-group>
                      <label>Elementary or Primary</label>
                      <b-form-input
                          v-model="forms.education.fields.elementaryCourse"
                          debounce="500"/>
                    </b-form-group>
                  </b-col>
                  <b-col md="2">
                    <b-form-group>
                      <label>From</label>
                      <b-form-input
                          v-model="forms.education.fields.elementaryCourseYearFrom"
                          debounce="500" />
                    </b-form-group>
                  </b-col>
                  <b-col md="2">
                    <b-form-group>
                      <label>To</label>
                      <b-form-input
                          v-model="forms.education.fields.elementaryCourseYearTo"
                          debounce="500" />
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
                  <b-col md="5">
                    <b-form-group>
                      <label>High School or Secondary</label>
                      <b-form-input
                          v-model="forms.education.fields.highSchoolCourse"
                          debounce="500"/>
                    </b-form-group>
                  </b-col>
                  <b-col md="2">
                    <b-form-group>
                      <label>From</label>
                      <b-form-input
                          v-model="forms.education.fields.highSchoolCourseYearFrom"
                          debounce="500"/>
                    </b-form-group>
                  </b-col>
                  <b-col md="2">
                    <b-form-group>
                      <label>To</label>
                      <b-form-input
                          v-model="forms.education.fields.highSchoolCourseYearTo"
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
                  <b-col md="5">
                    <b-form-group>
                      <label>Senior School or Upper Secondary</label>
                      <b-form-input
                          v-model="forms.education.fields.seniorSchoolCourse"
                          debounce="500"/>
                    </b-form-group>
                  </b-col>
                  <b-col md="2">
                    <b-form-group>
                      <label>From</label>
                      <b-form-input
                          v-model="forms.education.fields.seniorSchoolCourseYearFrom"
                          debounce="500"/>
                    </b-form-group>
                  </b-col>
                  <b-col md="2">
                    <b-form-group>
                      <label>To</label>
                      <b-form-input
                          v-model="forms.education.fields.seniorSchoolCourseYearTo"
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
                  <b-col md="5">
                    <b-form-group>
                      <label >College Degree(if graduated) or Tertiary</label>
                      <b-form-input
                          v-model="forms.education.fields.collegeDegree"
                          debounce="500"/>
                    </b-form-group>
                  </b-col>
                  <b-col md="2">
                    <b-form-group>
                      <label>From</label>
                      <b-form-input
                          v-model="forms.education.fields.collegeDegreeYearFrom"
                          debounce="500"/>
                    </b-form-group>
                  </b-col>
                  <b-col md="2">
                    <b-form-group>
                      <label>To</label>
                      <b-form-input
                          v-model="forms.education.fields.collegeDegreeYearTo"
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
          </div>
        </div>
      </div>
    </div>
    <div class="action-container">
      <b-button class="float-right ml-2"
        :to="`/master-files/student`"
        variant="outline-danger"
        :disabled="isProcessing" > Cancel </b-button>
      <b-button class="float-right"
        variant="outline-primary"
        @click="onStudentEntry"
        :disabled="isProcessing">
        <v-icon
          v-if="isProcessing"
          name="sync"
          class="mr-2"
          spin />
          Save </b-button>
    </div>
    <!-- <b-row>
      <b-col md=12 >
        <b-overlay :show="isLoading" rounded="sm">
          <b-card>
            <b-card-body>
            </b-card-body>
            <template v-slot:footer>
            </template>
          </b-card>
        </b-overlay>
      </b-col>
    </b-row> -->
    </b-overlay>
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
  email: null,
  isManual: null,
}

const addressFields = {
  currentHouseNoStreet: null,
  currentBarangay: null,
  currentCityTown: null,
  currentProvince: null,
  currentRegion: null,
  currentDistrict: null,
  currentPostalCode: null,
  currentCountryId: Countries.PHILIPPINES.id,
  currentCompleteAddress: null,
  currentHomeLandlineMobileNo: null,
  permanentHouseNoStreet: null,
  permanentBarangay: null,
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
  addressCurrentBarangay: null,
  addressCurrentCityTown: null,
  addressCurrentProvince: null,
  addressCurrentRegion: null,
  addressCurrentDistrict: null,
  addressCurrentPostalCode: null,
  addressCurrentCountryId: null,
  addressCurrentCompleteAddress: null,
  addressCurrentHomeLandlineMobileNo: null,
  addressPermanentHouseNoStreet: null,
  addressPermanentBarangay: null,
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
  lastSchoolYearFrom: null,
  lastSchoolYearTo: null,
  lastLevel: null,
  elementaryCourse: null,
  elementaryCourseYearFrom: null,
  elementaryCourseYearTo: null,
  elementaryCourseHonors: null,
  highSchoolCourse: null,
  highSchoolCourseYearFrom: null,
  highSchoolCourseYearTo: null,
  highSchoolCourseHonors: null,
  seniorSchoolCourse: null,
  seniorSchoolCourseYearFrom: null,
  seniorSchoolCourseYearTo: null,
  seniorSchoolCourseHonors: null,
  collegeDegree: null,
  collegeDegreeYearFrom: null,
  collegeDegreeYearTo: null,
  collegeDegreeHonors: null,
}

import { StudentApi, UserGroupApi } from "../src/mixins/api"
import { validate, reset, showNotification, clearFields } from '../src/helpers/forms'
import { Countries, CivilStatuses, StudentPermissions } from "../src/helpers/enum"
import Tables from "../src/helpers/tables"
import PhotoViewer from '../../components/PhotoViewer'
import { copyValue } from '../src/helpers/extractor'
import Access from '../src/mixins/utils/Access'
import tabHeaders from "../src/views/pages/student/data/tabHeaders";

export default {
  name: "StudentEntry",
  mixins: [StudentApi, Tables, Access],
  components: {
    PhotoViewer,
  },
  StudentPermissions,
  data() {
		return {
      showStudentEntry: false,
      isProfilePhotoBusy: false,
      isProcessing : false,
      studentPhotoUrl: null,
      Countries: Countries,
      CivilStatuses: CivilStatuses,
      selectedPhoto: null,
      entryMode: "",
      activeTabIndex: 0,
      isLoading: false,
      tabHeaders: tabHeaders.items,
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
    this.isLoading = true
    if (this.$route.params.studentId && isNaN(this.$route.params.studentId)) {
      this.$router.push('/master-files/student')
      return
    }

    this.setCreate()
    this.entryMode = this.$route?.params?.studentId ? 'Edit' : 'Add'
    if (this.entryMode === 'Edit') {
      const { studentId } = this.$route.params
      const { student, address, family, education } = this.forms
      this.getStudent(studentId).then(({ data }) => {
        this.studentPhotoUrl = null
        this.showStudentEntry = true

        //clear fields value
        clearFields(student.fields)
        clearFields(address.fields)
        clearFields(family.fields)
        clearFields(education.fields)

        //reset state
        reset(student)
        reset(address)
        reset(family)
        reset(education)

        address.fields.currentCountryId = Countries.PHILIPPINES.id
        address.fields.permanentCountryId = Countries.PHILIPPINES.id

        copyValue(data, student.fields)
        if (data.address)
          copyValue(data.address, address.fields)

        if (data.family)
        copyValue(data.family, family.fields)

        if (data.education)
        copyValue(data.education, education.fields)

        if (data.photo)
        this.studentPhotoUrl = process.env.VUE_APP_PUBLIC_PHOTO_URL + data.photo.hashName

        this.isLoading = false
      }).catch(error => {
        console.log(error)
      })
    }
    else {
      this.isLoading = false
    }
  },
  methods: {
    onStudentEntry() {
      const {
        student: { fields: { id: studentId } },
        student,
        address,
        family,
        education
        } = this.forms

      const { students } = this.tables

      reset(student)
      reset(address)
      reset(family)
      reset(education)

      const { studentNo, ...studentFields } = student.fields

      const data = {
        ...studentFields,
        address: { ...address.fields },
        family: { ...family.fields },
        education: { ...education.fields }
      }

      if(this.entryMode == "Add"){
        this.isProcessing = true;
        data.isManual = 1 //set is manual to true

        this.addStudent(data)
          .then(({ data }) => {
            let newStudent = data
            if (this.selectedPhoto) {
              const formData = new FormData();
              formData.append('photo', this.selectedPhoto);
              this.savePhoto(formData, newStudent.id).then(({ data }) => {
                this.studentPhotoUrl = process.env.VUE_APP_PUBLIC_PHOTO_URL + data.hashName
                newStudent.photo = data
              })
            }
            showNotification(this, 'success', 'Student has been added.')
            this.isProcessing = false;
            this.$router.push({ path: '/master-files/student' })
        }).catch(error => {
          const errors = error.response.data.errors
          validate(student, errors)
          validate(address, errors)
          validate(family, errors)
          validate(education, errors)
          this.showBulletedNotification(errors)
          this.isProcessing = false;
          // validate(user, errors)
          // validate(personnel, errors)
        })

      } else if (this.entryMode == "Edit") {
        this.isProcessing = true;
        this.updateStudent(data, studentId)
          .then(({ data }) => {
            showNotification(this, 'success', 'Student has been updated.')
            this.isProcessing = false;
            this.$router.push({ path: '/master-files/student' })
        }).catch(error => {
          const errors = error.response.data.errors
          validate(student, errors)
          validate(address, errors)
          validate(family, errors)
          validate(education, errors)
          this.isProcessing = false;
          this.showBulletedNotification(errors)
        })
      }
    },
    setCreate() {

      this.studentPhotoUrl = null
      const { student, address, family, education } = this.forms
      this.entryMode='Add'

      this.showStudentEntry = true
      this.activeTabIndex = 0

      //reset state
      reset(student)
      reset(address)
      reset(family)
      reset(education)

      //clear fields value
      clearFields(student.fields)
      clearFields(address.fields)
      clearFields(family.fields)
      clearFields(education.fields)

      // set default country
      address.fields.currentCountryId = Countries.PHILIPPINES.id
      address.fields.permanentCountryId = Countries.PHILIPPINES.id
      student.fields.civilStatusId = CivilStatuses.SINGLE.id

      this.entryMode = 'Add'
    },
    onSameAddress(isSame) {
      const { address: { fields: address } } = this.forms
      if (isSame) {
        address.permanentHouseNoStreet = address.currentHouseNoStreet
        address.permanentBarangay = address.currentBarangay
        address.permanentCityTown = address.currentCityTown
        address.permanentProvince = address.currentProvince
        address.permanentRegion = address.currentRegion
        address.permanentDistrict = address.currentDistrict
        address.permanentPostalCode = address.currentPostalCode
        address.permanentCountryId = address.currentCountryId
        address.permanentCompleteAddress = address.currentCompleteAddress
        address.permanentHomeLandlineMobileNo = address.currentHomeLandlineMobileNo
      } else {
        address.permanentHouseNoStreet = null
        address.permanentCityTown = null
        address.permanentProvince = null
        address.permanentRegion = null
        address.permanentDistrict = null
        address.permanentPostalCode = null
        address.permanentCountryId = Countries.PHILIPPINES.id
        address.permanentCompleteAddress = null
        address.permanentHomeLandlineMobileNo = null
      }
    },
    onPhotoChange(file) {
      this.studentPhotoUrl = null
      this.isProfilePhotoBusy = true

      if (this.entryMode == "Add") {
        this.createBase64Image(file)
        this.selectedPhoto = file
      }
      else {
        const formData = new FormData();
        const { id: studentId } = this.forms.student.fields
        formData.append('photo', file);

        this.savePhoto(formData, studentId).then(({ data }) =>{
          this.studentPhotoUrl = process.env.VUE_APP_PUBLIC_PHOTO_URL + data.hashName
          setTimeout(() => this.isProfilePhotoBusy = false, 3000)
        })
      }
    },
    onPhotoRemove() {
      if (this.entryMode == "Add") {
        this.studentPhotoUrl = ""
      } else {
        const { id: studentId } = this.forms.student.fields

        this.deletePhoto(studentId).then(({ data }) =>{
          this.studentPhotoUrl = ""
        })
      }

      this.selectedPhoto = null
    },
    createBase64Image(fileObject) {
      const reader = new FileReader()

      reader.onload = (e) => {
        this.studentPhotoUrl = e.target.result
      }
      reader.readAsDataURL(fileObject)
      setTimeout(() => this.isProfilePhotoBusy = false, 1000)
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
      showNotification(this, "danger", vNodesMsg, 4000)
    },
    setActiveIndex(index) {
      this.activeTabIndex = index
    }
	}
}
</script>

<style lang="scss" scoped >
  @import "../../../assets/scss/_shared.scss";

  .main-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px;

    @include for-size(phone-only) {
      margin-top: 30px;
    }
  }

  .content-container {
    display: flex;
    height: 100%;

    @include for-size(phone-only) {
      flex-direction: column;
    }
  }

  .header-container {
    margin-bottom: 20px;
  }

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

  .sub-nav__link {
    font-size: 14px;
  }

  .sub-nav {
    list-style: none;
    padding: 0;
  }

  .sub-nav__item {
    margin-bottom: 10px;
    padding: 6px 20px;

    &.active {
      background-color: $light-blue-10;
      border-radius: 3px;

      .sub-nav__link {
        color: $brand-primary;
        font-weight: 500;
      }
    }

    :hover {
      cursor: pointer;
    }
  }

  .sub-nav__title {
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .left-pane {
    min-width: 230px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    // border-right: 1px solid $light-gray-10;
  }

  .right-pane {
    flex: 1;
    border: solid whitesmoke 1px;
    padding: 20px;

    @include for-size(phone-only) {
      margin-top: 20px;
    }
  }

  .action-container {
    margin: 20px 0;
    height: 50px;
  }

</style>
