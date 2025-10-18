import { ITokenInfo } from "interfaces";

export function getUiTokenInfo(tokens: any[]): ITokenInfo[] {
  return tokens.map((token) => ({
    id: Number(token.id),
    creator: token.creator,
    name: token.name,
    totalSupply: Number(token.totalSupply),
    citizenFeatures: token.citizenFeatures,
    processorFeatures: token.processorFeatures,
    dateCreated: Number(token.dateCreated),
    stage: Number(token.stage),
  }));
}
