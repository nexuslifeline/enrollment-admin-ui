<template>
  <div class="c-app">
    <b-row>
      <b-col md=12 v-show="!showStudentEntry">
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
                      placeholder="Search"
                      debounce="500"
                      @update="loadStudents()">
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
                >
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
                        :to="`/student/${row.item.id}/academic-records`" >
                        Update Academic Records
                      </b-dropdown-item>
                      <b-dropdown-item
                        @click="setUpdateStudent(row)"
                        :disabled="showEntry">
                        Edit Student Record
                      </b-dropdown-item>
                      <b-dropdown-item
                        @click="setUpdateUser(row)"
                        :disabled="showModalUpdateUser" >
                        Edit Account
                      </b-dropdown-item>
                      <b-dropdown-item
                        @click="forms.user.fields.id = row.item.id, showModalConfirmation = true"
                        :disabled="showModalConfirmation">
                        Delete
                      </b-dropdown-item>
                    </b-dropdown>
                  </template>
								</b-table>
                <b-row>
                  <b-col md=6>
                    Showing {{ paginations.student.from }} to {{ paginations.student.to }} of {{ paginations.student.totalRows }} records.
                    </b-col>
                    <!--<b-col md=4>
                      <b-form-input
                        v-model="filters.student.criteria"
                        type="text" 
                        placeholder="Search"
                        debounce="500"
                        @update="loadStudents()">
                      </b-form-input>
                    </b-col>-->
                  </b-row>
              </b-col>
            </b-row>
            <!-- end table -->
          </b-card-body>
        </b-card>
      </b-col>
      <b-col md=12 v-show="showStudentEntry">
        <b-overlay :show="isLoading" rounded="sm">
          <b-card>
            <b-card-body>
              <b-row class="mb-4">
                <b-col md=12>
                  <h4>
                    {{ entryMode === 'Add' ? 'Student - Create' : 'Student - Edit'  }}
                  </h4>
                </b-col>
              </b-row>
              <b-row>
                <b-col md=12>
                  <b-tabs  pills vertical nav-wrapper-class="w-25" v-model="activeTabIndex">
                    <b-tab active>
                      <template>
                        <div slot="title">
                          <span>{{ tabHeaders[0].header }}</span>
                        </div>
                      </template>
                      <b-row class="mb-4">
                        <b-col md=12>
                          <h4>{{ tabHeaders[0].header }}</h4>
                          <small>{{ tabHeaders[0].description }}</small>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col md="6">
                          <b-form-group>
                            <label class="required">Firstname</label>
                            <b-form-input
                              v-model="forms.student.fields.firstName"
                              :state="forms.student.states.firstName"
                              debounce="500" />
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
                        </b-col>
                        <b-col md="6">
                          <div class="profile-photo-container">
                            <div class="profile-photo">
                              <PhotoViewer
                                @onPhotoChange="onPhotoChange"
                                @onPhotoRemove="onPhotoRemove"
                                :isBusy="isProfilePhotoBusy"
                                :imageUrl="studentPhotoUrl"
                              />
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
                              v-model="forms.student.fields.mobileNo"
                              debounce="500" />
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
                    <b-tab >
                      <template>
                        <div slot="title">
                          <span>{{ tabHeaders[1].header }}</span>
                        </div>
                      </template>
                      <b-row class="mb-4">
                        <b-col md=12>
                          <h4>{{ tabHeaders[1].header }}</h4>
                          <small>{{ tabHeaders[1].description }}</small>
                        </b-col>
                      </b-row>
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
                    </b-tab>
                    <b-tab >
                      <template>
                        <div slot="title">
                          <span>{{ tabHeaders[2].header }}</span>
                        </div>
                      </template>
                      <b-row class="mb-4">
                        <b-col md=12>
                          <h4>{{ tabHeaders[2].header }}</h4>
                          <small>{{ tabHeaders[2].description }}</small>
                        </b-col>
                      </b-row>
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
                    <b-tab >
                      <template>
                        <div slot="title">
                          <span>{{ tabHeaders[3].header }}</span>
                        </div>
                      </template>
                      <b-row class="mb-4">
                        <b-col md=12>
                          <h4>{{ tabHeaders[3].header }}</h4>
                          <small>{{ tabHeaders[3].description }}</small>
                        </b-col>
                      </b-row>
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
                    </b-tab>
                  </b-tabs>
                </b-col>
              </b-row>
            </b-card-body>
            <template v-slot:footer>
              <div class="w-100">
                <b-button class="float-right ml-2"
                  @click="showStudentEntry=false"
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
            </template>
          </b-card>
        </b-overlay>
      </b-col>
    </b-row>
    <b-modal
      @shown="$refs.username.focus()"
			v-model="showModalUpdateUser"
			:noCloseOnEsc="true"
			:noCloseOnBackdrop="true">
			<div slot="modal-title"> <!-- modal title -->
					User Account - Edit
			</div> <!-- modal title -->
      <!-- modal body -->
			<b-row>
				<b-col md=12>
          <b-form-group >
            <label class="required">Email</label>
            <b-form-input
              ref="username"
              v-model="forms.user.fields.username"
              :state="forms.user.states.userUsername"
              debounce="500" />
            <b-form-invalid-feedback>
              {{forms.user.errors.userUsername}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group >
            <label class="required">Password</label>
            <b-form-input
              type="password"
              v-model="forms.user.fields.password"
              :state="forms.user.states.userPassword"
              debounce="500" />
            <b-form-invalid-feedback>
              {{forms.user.errors.userPassword}}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group >
            <label class="required">Confirm Password</label>
            <b-form-input
              type="password"
              v-model="forms.user.fields.passwordConfirmation"
              debounce="500"/>
          </b-form-group>
				</b-col>
			</b-row>
      <!-- modal body -->
			<div slot="modal-footer" class="w-100"><!-- modal footer buttons -->
				<b-button
          variant="outline-danger"
          class="float-left btn-close"
          @click="showModalUpdateUser=false">
          Close
        </b-button>
        <b-button
          :disabled="isUserSaving"
          variant="outline-primary"
          class="float-right btn-save"
          @click="onStudentEntry()">
          <v-icon
            v-if="isUserSaving"
            name="sync"
            spin
            class="mr-2" />
          Save
        </b-button>
			</div> <!-- modal footer buttons -->
		</b-modal>
    <b-modal
      v-model="showModalConfirmation"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true" >
      <div slot="modal-title">
          Delete Student
      </div>
      Are you sure you want to delete this student ?
      <div slot="modal-footer">
        <b-button
          :disabled="isUserSaving"
          variant="outline-primary"
          class="mr-2 btn-save"
          @click="onStudentDelete()">
          <v-icon
            v-if="isUserSaving"
            name="sync"
            spin
            class="mr-2" />
          Yes
        </b-button>
        <b-button
          variant="outline-danger"
          class="btn-close"
          @click="showModalConfirmation=false">
          No
        </b-button>
      </div>
    </b-modal>
  </div>
</template>
<script>

const studentFields = {
  id: null,
  //studentNo: null,
  // studentNo: null,
  firstName: null,
  middleName: null,
  lastName: null,
  mobileNo: null,
  birthDate: null,
  civilStatusId: null,
  email: null,
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

const userFields = {
  username: null,
  password: null,
  passwordConfirmation: null,
}

const userErrorFields = {
  userUsername: null,
  userPassword: null,
}

import { StudentApi, UserGroupApi } from "../../mixins/api"
import { validate, reset, showNotification, clearFields } from '../../helpers/forms'
import { Countries, CivilStatuses } from "../../helpers/enum"
import Tables from "../../helpers/tables"
import PhotoViewer from '../components/PhotoViewer'
import { copyValue } from '../../helpers/extractor'
export default {
	name: "Student",
  mixins: [StudentApi, Tables],
  components: {
    PhotoViewer,
  },
	data() {
		return {
      showStudentEntry: false,
      showModalUpdateUser: false,
      showModalConfirmation: false,
      isProfilePhotoBusy: false,
      isProcessing : false,
      isUserSaving: false,
      studentPhotoUrl: null,
      Countries: Countries,
      CivilStatuses: CivilStatuses,
      selectedPhoto: null,
      entryMode: "",
      activeTabIndex: 0,
      isLoading: false,
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
        user: {
          fields: { ...userFields },
          states: { ...userErrorFields },
          errors: { ...userErrorFields }
        }
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
      tabHeaders: [
          { header: 'Profile', description: 'Officially registering you is just few steps away. First, tell us a bit about yourself.' },
          { header: 'Address', description: 'Let us know your address. Please include all required(*) fields.' },
          { header: 'Family', description: 'Details about your family. Please include all required(*) fields.' },
          { header: 'Education', description: 'Details about your previous educational background. Please include all required(*) fields.' }
      ],
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
    console.log(this.$route)
    this.loadStudents()
	},
	methods: {
		loadStudents() {
      const { students } = this.tables
      const { criteria } = this.filters.student
      const { student, student: { perPage, page } } = this.paginations

      students.isBusy = true

			let params = { paginate: true, perPage, page, criteria }
      this.getStudentList(params).then(({ data }) => {
        students.items = data.data
        student.from = data.meta.from
        student.to = data.meta.to
        student.totalRows = data.meta.total
        students.isBusy = false
      })
    },
    onStudentEntry() {
      const {
        student: { fields: { id: studentId } },
        student,
        address,
        family,
        education,
        user } = this.forms

      const { students } = this.tables

      reset(student)
      reset(address)
      reset(family)
      reset(education)
      reset(user)

      const data = {
        ...student.fields,
        address: { ...address.fields },
        family: { ...family.fields },
        education: { ...education.fields }
      }

      if(this.entryMode == "Add"){
        this.isProcessing = true;

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
            this.addRow(students, this.paginations.student, newStudent)

            showNotification(this, 'success', 'Student has been added.')
            this.showStudentEntry = false;
            this.isProcessing = false;
        }).catch(error => {
          console.log(error)
          const errors = error.response.data.errors
          console.log(error.response.data)
          validate(student, errors)
          validate(address, errors)
          validate(family, errors)
          validate(education, errors)
          this.showBulletedNotification(errors)
          this.isProcessing = false;
          // validate(user, errors)
          // validate(personnel, errors)
        })

      } else if (this.entryMode == "Edit Student") {
        this.isProcessing = true;
        this.updateStudent(data, studentId)
          .then(({ data }) => {
            this.updateRow(students, data)
            showNotification(this, 'success', 'Student has been updated.')
            this.showStudentEntry = false;
            this.isProcessing = false;
        }).catch(error => {
          const errors = error.response.data.errors
          
          validate(student, errors)
          validate(address, errors)
          validate(family, errors)
          validate(education, errors)
          this.isProcessing = false;
          this.showBulletedNotification(errors)
        })
      } else if (this.entryMode == "Edit User") {
        this.isUserSaving = true
        student.fields.email = user.fields.username
        const data = { id: student.fields.id, email: student.fields.email, user: user.fields }

        this.updateStudent(data, studentId)
          .then(({ data }) => {
            this.updateRow(students, data)
            showNotification(this, "success", "Student's Account is updated successfully.")
            this.showModalUpdateUser = false
            this.isUserSaving = false
          })
          .catch(error => {
            const errors = error.response.data.errors
            validate(user, errors)
            this.isUserSaving = false
          })
      }
    },
    setUpdateStudent(row) {
      this.studentPhotoUrl = null
      this.showStudentEntry = true
      const { student, address, family, education } = this.forms
      const { item } = row
      this.activeTabIndex = 0
      this.isLoading = true

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

      copyValue(item, student.fields)
      if (item.address)
      copyValue(item.address, address.fields)

      if (item.family)
      copyValue(item.family, family.fields)

      if (item.education)
      copyValue(item.education, education.fields)

      if (item.photo)
      this.studentPhotoUrl = process.env.VUE_APP_PUBLIC_PHOTO_URL + item.photo.hashName

      this.entryMode = "Edit Student"
      this.isLoading = false
    },
    setUpdateUser(row) {

      const { student, user } = this.forms
      const { item } = row
      this.showModalUpdateUser = true
      this.isLoading = true
      clearFields(user.fields)
      reset(user)

      copyValue(item, student.fields)

      if (row.item.user)
      user.fields.username = row.item.user.username

      this.entryMode = "Edit User"
      this.isLoading = false
    },
    setCreate() {

      this.studentPhotoUrl = null
      const { student, address, family, education } = this.forms
   
      this.entryMode='Add'

      this.showEntry = true
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
      
      this.entryMode = 'Add'
      this.showStudentEntry = true
    },
    onStudentDelete(){
      const { student, user: { fields: { id } } } = this.forms
      const { students } = this.tables
      this.isUserSaving = true
      this.deleteStudent(id)
        .then(({ data }) => {
          this.deleteRow(students, this.paginations.student, id)
          this.isUserSaving = false
          showNotification(this, "success", "User deleted successfully.")
          this.showModalConfirmation = false
        })
    },
    avatar(student){
      let src = ''
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName
      }
      return src
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
    }
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
