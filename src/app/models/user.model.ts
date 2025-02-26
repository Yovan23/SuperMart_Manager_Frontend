export interface User {
    _id: string;
    name: string;
    email: string;
    mobileNumber: number;
    role: string;
    profilePicture: string;
    EmployeeCode: string;
    dateOfBirth: Date;
    isDeleted: boolean;
    isActive: boolean;
  }