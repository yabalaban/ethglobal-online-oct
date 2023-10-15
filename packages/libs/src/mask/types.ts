export interface Identity {
  uuid: string;
  platform: string;
  identity: string;
  displayName: string | null;
  profileUrl: string | null;
  avatarUrl: string | null;
  createdAt: number;
  addedAt: number;
  updatedAt: number;
  neighbor: [{ sources: [string]; identity: Identity }];
}
