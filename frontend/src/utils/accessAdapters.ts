import { ethers } from "ethers";
import { UserRole, type IAccountInfo } from "../interfaces";

// --- Roles definidos en el contrato (hashes de keccak256) ---
export const ROLES: Record<string, string> = {
  [UserRole.ADMIN]: ethers.keccak256(ethers.toUtf8Bytes("ADMIN")),
  [UserRole.CONSUMER]: ethers.keccak256(ethers.toUtf8Bytes("CONSUMER")),
  [UserRole.RETAILER]: ethers.keccak256(ethers.toUtf8Bytes("RETAILER")),
  [UserRole.FACTORY]: ethers.keccak256(ethers.toUtf8Bytes("FACTORY")),
  [UserRole.PRODUCER]: ethers.keccak256(ethers.toUtf8Bytes("PRODUCER")),
} as const;

// --- Mapa inverso para decodificar desde la blockchain ---
export const ROLE_NAMES: Record<string, string> = Object.entries(ROLES).reduce(
  (acc, [name, hash]) => {
    acc[hash] = name;
    return acc;
  },
  {} as Record<string, string>
);

// --- Decodificador desde contrato → front ---
export function fromDtoToUi(accountInfo: any): IAccountInfo | null {
  const roleHash = accountInfo[0];
  const status = Number(accountInfo[1]);

  const role = ROLE_NAMES[roleHash];
  if (!role) return null;

  console.log("+++ Parsed data: ", { role, status });

  return { role, status };
}

// --- Codificador desde front → contrato ---
export function encodeRole(roleName: keyof typeof ROLES): string {
  const roleHash = ROLES[roleName];
  if (!roleHash) throw new Error(`Invalid role name: ${roleName}`);
  return roleHash;
}
