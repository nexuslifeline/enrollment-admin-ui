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
  REQUIREMENTS: { id: 6, name: 'Requirements', description: 'Lorem ipsum dolor amet' }
});

export const ApplicationSteps = new Enum({
  PROFILE: { id: 1, name: 'Profile', description: 'Lorem ipsum dolor amet' },
  ADDRESS: { id: 2, name: 'Address', description: 'Lorem ipsum dolor amet' },
  FAMILY: { id: 3, name: 'Family', description: 'Lorem ipsum dolor amet' },
  EDUCATION: { id: 4, name: 'Education', description: 'Lorem ipsum dolor amet' },
  ACADEMIC_YEAR_APPLICATION: { id: 5, name: 'Academic Year - Application', description: 'Lorem ipsum dolor amet' },
  BILLING: { id: 6, name: 'BILLING', description: 'Lorem ipsum dolor amet' }
});

export const Semesters = new Enum({
  FIRST_SEM: { id: 1, name: '1st Sem', description: 'First Semester' },
  SECOND_SEM: { id: 2, name: '2nd Sem', description: 'Second Semester' },
  THIRD_SEM: { id: 3, name: '3rd Sem', description: 'Third Semester' }
});