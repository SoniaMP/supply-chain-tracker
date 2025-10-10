import { ethers } from "ethers";
import { EUserRole, type IAccountInfo } from "../interfaces";

// --- Roles definidos en el contrato (hashes de keccak256) ---
export const ROLES: Record<EUserRole, string> = {
  [EUserRole.ADMIN]: ethers.keccak256(ethers.toUtf8Bytes("ADMIN")),
  [EUserRole.CONSUMER]: ethers.keccak256(ethers.toUtf8Bytes("CONSUMER")),
  [EUserRole.RETAILER]: ethers.keccak256(ethers.toUtf8Bytes("RETAILER")),
  [EUserRole.FACTORY]: ethers.keccak256(ethers.toUtf8Bytes("FACTORY")),
  [EUserRole.PRODUCER]: ethers.keccak256(ethers.toUtf8Bytes("PRODUCER")),
} as const;

// --- Mapa inverso para decodificar desde la blockchain ---
export const ROLE_NAMES: Record<string, EUserRole> = Object.entries(
  ROLES
).reduce((acc, [name, hash]) => {
  acc[hash] = name as EUserRole;
  return acc;
}, {} as Record<string, EUserRole>);

// --- Decodificador desde contrato → front ---
export function fromDtoToUi(accountInfo: IAccountInfo): IAccountInfo {
  const { role: roleHash, status } = accountInfo;
  const role = ROLE_NAMES[roleHash];
  const statusIndex = Number(status);

  return {
    role,
    status: statusIndex,
  };
}

// --- Codificador desde front → contrato ---
export function encodeRole(roleName: keyof typeof ROLES): string {
  const roleHash = ROLES[roleName];
  if (!roleHash) throw new Error(`Invalid role name: ${roleName}`);
  return roleHash;
}
