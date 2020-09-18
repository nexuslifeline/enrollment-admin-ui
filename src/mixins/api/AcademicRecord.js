import { apiVersion, apiPrefix } from './config';

export default {
  methods: {
    getAcademicRecordList(params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/academic-records`, { params: params });
    },
    getAcademicRecord(id) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/academic-records/${id}`);
    },
    getSubjectsOfAcademicRecord(academicRecordId, params) {
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/academic-records/${academicRecordId}/subjects`, { params: params });
    },
    getStudentFeeOfAcademicRecord(academicRecordId){
      return this.$authHttp.get(`${apiPrefix}/${apiVersion}/academic-records/${academicRecordId}/student-fees`);
    },
    updateAcademicRecord(data, academicRecordId) {
      return this.$authHttp.put(`${apiPrefix}/${apiVersion}/academic-records/${academicRecordId}`, data)
    },
  }
}