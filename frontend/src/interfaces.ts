export const enum UserRole {
  ADMIN = "ADMIN",
  CONSUMER = "CONSUMER",
  RETAILER = "RETAILER",
  FACTORY = "FACTORY",
  PRODUCER = "PRODUCER",
}

export const mapRoleToLabel: Record<string, string> = {
  ADMIN: "Admin",
  CONSUMER: "Consumer",
  RETAILER: "Retailer",
  FACTORY: "Factory",
  PRODUCER: "Producer",
};

export enum AccountStatus {
  None,
  Pending,
  Approved,
  Rejected,
  Canceled,
}

export const mapStatusToLabel: Record<AccountStatus, string> = {
  [AccountStatus.None]: "Sin solicitud",
  [AccountStatus.Pending]: "En revisión",
  [AccountStatus.Approved]: "Aprobado",
  [AccountStatus.Rejected]: "Rechazado",
  [AccountStatus.Canceled]: "Cancelado",
};

export interface IAccountInfo {
  account: string;
  role: string;
  status: AccountStatus;
}

export enum ContractNames {
  ACCESS_MANAGER = "AccessManager",
}
