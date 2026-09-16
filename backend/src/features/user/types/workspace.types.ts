export interface CreateWorkspaceRepositoryInput {
  pairingCodeHash: string;
  pairingCodeExpiresAt: Date;
  recoveryKeyHash: string;
  deviceName: string;
  refreshTokenHash: string;
  refreshTokenExpiresAt: Date;
}

export interface CreateWorkspaceRepositoryResult {
  workspaceId: string;
  deviceId: string;
}
