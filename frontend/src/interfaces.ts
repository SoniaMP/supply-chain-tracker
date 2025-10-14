export const enum UserRole {
  ADMIN = "ADMIN",
  CONSUMER = "CONSUMER",
  RETAILER = "RETAILER",
  FACTORY = "FACTORY",
  PRODUCER = "PRODUCER",
}

export enum AccountStatus {
  None,
  Pending,
  Approved,
  Rejected,
  Canceled,
}

export interface IAccountInfo {
  role: string;
  status: AccountStatus;
}
