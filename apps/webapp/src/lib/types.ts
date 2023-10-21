import { Address } from 'viem';

export interface Person {
  address: Address;
  ens: string | null;
  avatar: string | null;
  twitter: string | null;
}

export interface UmaPromise {
  id: string;
  text: string;
  amount: number;
  claimed: boolean;
  failed: boolean;
}

export type Company = {
  cid: Address;
  projectId: Address;
  creator: Person;
  status: CompanyStatus;
  details: CompanyDetails | null;
};

export type CompanyStatus = {
  completed: boolean;
  safe: Address;
  goal: string;
  investments: Investment[];
  promises: UmaPromise[];
};

export type CompanyDetails = {
  name: string;
  description: string;
  image: string;
  goal: string;
};

export interface Investment {
  investor: Person;
  amount: number;
}
