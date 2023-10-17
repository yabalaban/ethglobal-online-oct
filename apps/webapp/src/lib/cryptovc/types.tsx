export type Menu = {
  title: string;
  path: string;
  enabled: boolean;
};

export type Company = {
  creator: Person;
  path: string;
  name: string;
  description: string;
  pic: string | null;
  goal: string;
  progress: string;
  investors: Person[];
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
