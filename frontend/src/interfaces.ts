export enum EUserRole {
  ADMIN = "ADMIN",
  CONSUMER = "CONSUMER",
  RETAILER = "RETAILER",
  FACTORY = "FACTORY",
  PRODUCER = "PRODUCER",
}

export enum EAccountStatus {
  Pending,
  Approved,
  Rejected,
  Canceled,
}

export interface IAccountInfo {
  role: EUserRole;
  status: EAccountStatus;
}
