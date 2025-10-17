export const enum UserRole {
  ADMIN = "ADMIN",
  CITIZEN = "CITIZEN",
  TRANSPORTER = "TRANSPORTER",
  PROCESSOR = "PROCESSOR",
  REWARD_AUTHORITY = "REWARD_AUTHORITY",
}

export const mapRoleToLabel: Record<string, string> = {
  ADMIN: "Admin",
  CITIZEN: "Citizen",
  TRANSPORTER: "Transporter",
  PROCESSOR: "Processor",
  REWARD_AUTHORITY: "Reward Authority",
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
