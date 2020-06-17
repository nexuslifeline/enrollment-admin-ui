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
  FIRST_SEM: { id: 1, name: '1st Sem', description: 'First Semester' },
  SECOND_SEM: { id: 2, name: '2nd Sem', description: 'Second Semester' },
  THIRD_SEM: { id: 3, name: '3rd Sem', description: 'Third Semester' }
});

export const Fees = new Enum({
  TUITION_FEE: { id: 1, name: 'Tuition Fee' }
});

