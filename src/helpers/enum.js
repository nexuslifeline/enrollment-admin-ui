export class Enum {
  constructor(enums) {
    this.enums = enums;
    this.values = Object.values(enums);
    for (const prop in enums) {
      if (enums.hasOwnProperty(prop)) {
        this[prop] = enums[prop];
      }
    }
  }

  getEnum = (id) => {
    return this.values.find((e) => e.id === id);
  };

  getName = (id) => {
    const en = this.values.find((e) => e.id === id);
    if (en) {
      return en.name;
    }
    return null;
  };

  getEnumByValue = (value, fromKey) => {
    return this.values.find((e) => e[fromKey || 'name'] === value);
  };
}

export const StudentTypes = new Enum({
  REGULAR: { id: 1, name: 'Regular' },
  IRREGULAR: { id: 2, name: 'Irregular' }
});

export const StudentCategories = new Enum({
  NEW: { id: 1, name: 'New Student' },
  OLD: { id: 2, name: 'Old Student' }
});

export const SchoolCategories = new Enum({
  PRE_SCHOOL: { id: 1, name: 'Pre-School' },
  PRIMARY_SCHOOL: { id: 2, name: 'Primary School' },
  JUNIOR_HIGH_SCHOOL: { id: 3, name: 'Junior High School' },
  SENIOR_HIGH_SCHOOL: { id: 4, name: 'Senior High School' },
  COLLEGE: { id: 5, name: 'College' },
  GRADUATE_SCHOOL: { id: 6, name: 'Graduate School' }
});

export const AdmissionSteps = new Enum({
  PROFILE: { id: 1, name: 'Profile', description: 'Lorem ipsum dolor amet' },
  ADDRESS: { id: 2, name: 'Address', description: 'Lorem ipsum dolor amet' },
  FAMILY: { id: 3, name: 'Family', description: 'Lorem ipsum dolor amet' },
  EDUCATION: { id: 4, name: 'Education', description: 'Lorem ipsum dolor amet' },
  ACADEMIC_YEAR_ADMISSION: { id: 5, name: 'Academic Year - Admission', description: 'Lorem ipsum dolor amet' },
  REQUIREMENTS: { id: 6, name: 'Requirements', description: 'Lorem ipsum dolor amet' },
  STATUS: { id: 7, name: 'Status', description: 'Lorem ipsum dolor amet' },
  PAYMENTS: { id: 8, name: 'Billing', description: 'Lorem ipsum dolor amet' },
  WAITING: { id: 9, name: 'Waiting', description: 'Lorem ipsum dolor amet' }
});

export const ApplicationSteps = new Enum({
  PROFILE: { id: 1, name: 'Profile' },
  ADDRESS: { id: 2, name: 'Address' },
  FAMILY: { id: 3, name: 'Family' },
  EDUCATION: { id: 4, name: 'Education' },
  ACADEMIC_YEAR_APPLICATION: { id: 5, name: 'Academic Year - Application' },
  STATUS: { id: 6, name: 'Status', description: 'Lorem ipsum dolor amet' },
  PAYMENTS: { id: 7, name: 'Payments', description: 'Lorem ipsum dolor amet' },
  WAITING: { id: 8, name: 'Waiting', description: 'Lorem ipsum dolor amet' }
});

export const ApplicationStatuses = new Enum({
  APPROVED: { id: 1, name: 'Approved' },
  DRAFT: { id: 2, name: 'Draft' },
  REJECTED: { id: 3, name: 'Reject' },
  SUBMITTED: { id: 4, name: 'Submitted' },
  APPROVED_ASSESMENT: { id: 5, name: 'Approved Assesment' },
  PAYMENT_SUBMITTED: { id: 6, name: 'Payment Submitted' },
  COMPLETED: { id: 7, name: 'Completed' },
});

export const TranscriptStatuses = new Enum({
  DRAFT: { id: 1, name: 'Draft' },
  FINALIZED: { id: 2, name: 'Finalized' },
});

export const StudentFeeStatuses = new Enum({
  DRAFT: { id: 1, name: 'Draft/Pending' },
  APPROVED: { id: 2, name: 'Approved' },
});

export const Semesters = new Enum({
  FIRST_SEM: { id: 1, name: '1st Semester', description: 'First Semester' },
  SECOND_SEM: { id: 2, name: '2nd Semester', description: 'Second Semester' },
  THIRD_SEM: { id: 3, name: '3rd Semster', description: 'Third Semester' },
  SUMMER: { id: 4, name: 'Summer', description: 'Summer' }
});

export const Fees = new Enum({
  TUITION_FEE: { id: 1, name: 'Tuition Fee' }
});

export const DegreeTypes = new Enum({
  SENIOR_HIGH: { id: 1, name: 'Senior High', levels: [
    { levelId: 13, schoolCategoryId: 4 }, 
    { levelId: 14, schoolCategoryId: 4 }
  ]},
  ASSOCIATE_DEGREE: { id: 2, name: 'Associate Degree', levels: [
    { levelId: 15, schoolCategoryId: 5 }, 
    { levelId: 16, schoolCategoryId: 5 },
    { levelId: 17, schoolCategoryId: 5 },
  ]},
  BACHELORS_DEGREE_4_YEARS: { id: 3, name: "Bachelor's Degree (4 yrs)", levels: [
    { levelId: 15, schoolCategoryId: 5 }, 
    { levelId: 16, schoolCategoryId: 5 },
    { levelId: 17, schoolCategoryId: 5 },
    { levelId: 18, schoolCategoryId: 5 }
  ]},
  BACHELORS_DEGREE_5_YEARS: { id: 4, name: "Bachelor's Degree (5 yrs)", levels: [
    { levelId: 15, schoolCategoryId: 5 }, 
    { levelId: 16, schoolCategoryId: 5 },
    { levelId: 17, schoolCategoryId: 5 },
    { levelId: 18, schoolCategoryId: 5 },
    { levelId: 19, schoolCategoryId: 5 },
  ]},
  MASTERS_DEGREE: { id: 5, name: "Master's Degree", levels: [
    { levelId: 20, schoolCategoryId: 6 }
  ]},
  DOCTORATE_DEGREE: { id: 6, name: 'Doctorate Degree', levels: [
    { levelId: 21, schoolCategoryId: 6 }
  ]},
});


//user type: registrar = 1, finance = 2
export const UserGroups = new Enum({
  SUPER_USER: { id: 1, name: 'Super User', schoolCategoryId: null, userType: 0 },
  REGISTRAR_PRE_SCHOOL: { id: 2, name: 'Registrar - Pre-School', schoolCategoryId: 1, userType: 1 },
  FINANCE_PRE_SCHOOL: { id: 3, name: 'Finance - Pre-School', schoolCategoryId: 1, userType: 2 },
  REGISTRAR_PRIMARY_SCHOOL: { id: 4, name: 'Registrar - Primary School', schoolCategoryId: 2, userType: 1 },
  FINANCE_PRIMARY_SCHOOL: { id: 5, name: 'Finance - Primary School', schoolCategoryId: 2, userType: 2 },
  REGISTRAR_JUNIOR_HIGH_SCHOOL: { id: 6, name: 'Registrar - Junior High School', schoolCategoryId: 3, userType: 1 },
  FINANCE_JUNIOR_HIGH_SCHOOL: { id: 7, name: 'Finance - Junior High School', schoolCategoryId: 3, userType: 2 },
  REGISTRAR_SENIOR_HIGH_SCHOOL: { id: 8, name: 'Registrar - Senior High School', schoolCategoryId: 4, userType: 1 },
  FINANCE_SENIOR_HIGH_SCHOOL: { id: 9, name: 'Finance - Senior High School', schoolCategoryId: 4, userType: 2 },
  REGISTRAR_COLLEGE: { id: 10, name: 'Registrar - College', schoolCategoryId: 5, userType: 1 },
  FINANCE_COLLEGE: { id: 11, name: 'Finance - College', schoolCategoryId: 5, userType: 2 },
  REGISTRAR_GRADUATE_SCHOOL: { id: 12, name: 'Registrar - Graduate School', schoolCategoryId: 6, userType: 1 },
  FINANCE_GRADUATE_SCHOOL: { id: 13, name: 'Finance - Graduate School', schoolCategoryId: 6, userType: 2 },
});

// export const DegreeTypeLevels = new Enum({
//   ASSOCIATE_DEGREE: { id: 1, levels: [15, 16, 17] },
//   BACHELORS_DEGREE_4_YEARS: { id: 2, name: "Bachelor's Degree (4 yrs)" },
//   BACHELORS_DEGREE_5_YEARS: { id: 3, name: "Bachelor's Degree (5 yrs)" },
//   MASTERS_DEGREE: { id: 4, name: "Master's Degree" },
//   DOCTORATE_DEGREE: { id: 5, name: 'Doctorate Degree' }
// });