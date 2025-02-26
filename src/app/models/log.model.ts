export interface Log {
  _id: string;
  loggedAt: string;
  userId: {
    EmployeeCode: string;
    name: string;
    role: string;
  };
}
