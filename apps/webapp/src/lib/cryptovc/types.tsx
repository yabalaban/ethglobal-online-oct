export type Menu = {
  title: string;
  path: string;
  enabled: boolean;
};

export type Company = {
  id: string;
  creator: Person;
  path: string;
  name: string;
  description: string;
  pic: string | null;
  investors: Person[];
  // Progress
  progress: number;
  goal: number;
  currency: string;
  // Storage
  ipfs: string;
};

export type Person = {
  address: string; // 0x...
  identities: any[]; // nextid
  // populated from nextid
  handle: string | null;
  pic: string;
};

export type Promise = {
  address: string; // promise id
  claim: string;
  // false if failed, true otherwise, null for ongoing
  asserted: boolean | null;
};
