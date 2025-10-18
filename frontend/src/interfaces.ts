export enum ContractNames {
  ACCESS_MANAGER = "AccessManager",
  TRACEABILITY = "Traceability",
}

export const enum UserRole {
  ADMIN = "ADMIN",
  CITIZEN = "CITIZEN",
  TRANSPORTER = "TRANSPORTER",
  PROCESSOR = "PROCESSOR",
  REWARD_AUTHORITY = "REWARD_AUTHORITY",
}

export enum TokenStage {
  None,
  Created,
  Collected,
  Processed,
  Rewarded,
}

export enum AccountStatus {
  None,
  Pending,
  Approved,
  Rejected,
  Canceled,
}

export const mapRoleToLabel: Record<string, string> = {
  ADMIN: "Admin",
  CITIZEN: "Ciudadano",
  TRANSPORTER: "Transportista",
  PROCESSOR: "Procesador",
  REWARD_AUTHORITY: "Autoridad de Recompensas",
};

export const mapStatusToLabel: Record<AccountStatus, string> = {
  [AccountStatus.None]: "Sin solicitud",
  [AccountStatus.Pending]: "En revisión",
  [AccountStatus.Approved]: "Aprobado",
  [AccountStatus.Rejected]: "Rechazado",
  [AccountStatus.Canceled]: "Cancelado",
};

export const mapTokenStageToLabel: Record<TokenStage, string> = {
  [TokenStage.None]: "Ninguno",
  [TokenStage.Created]: "Creado",
  [TokenStage.Collected]: "Recogido",
  [TokenStage.Processed]: "Procesado",
  [TokenStage.Rewarded]: "Recompensado",
};

export interface IAccountInfo {
  account: string;
  role: string;
  status: AccountStatus;
}

export interface ITokenInfo {
  id: number;
  creator: string;
  name: string;
  totalSupply: number;
  citizenFeatures: string;
  processorFeatures: string;
  dateCreated: number;
  stage: TokenStage;
}

export interface INewTokenForm {
  name: string;
  total: number;
  additionalInfo: string;
}

export interface ITokenHistoryEntry {
  id: number;
  previousHolder: string;
  newHolder: string;
  action: TokenStage;
  timestamp: string;
  txHash: string;
}
