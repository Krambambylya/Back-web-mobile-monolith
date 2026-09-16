export interface FindPairingCodeOutput {
  id: string;
  workspaceId: string;
  createdAt: Date;
  expiresAt: Date;
  codeHash: string;
  usedAt: Date | null;
}
