'use client';

import { Address, formatEther } from 'viem';
import { GetCompanies, GetCompany, GetInvestments, GetPromises } from './queries';
import {
  ProjectCompleted,
  ProjectCreated,
  ProjectFunded,
  ProjectStarted,
  TrancheClaimed,
  TrancheFailed,
  TrancheRequested,
} from './subgraph/generated/schema';
import { Company, CompanyDetails, Person, UmaPromise } from './types';
import { ipfsStorage } from './storage';
import { fetchIdentities } from './mask';
import { atom } from 'jotai';
import { fakerEN } from '@faker-js/faker';

export class GlobalState {
  people: Record<Address, Person> = {};
  companies: Record<Address, Company> = {};
  promises: Record<Address, UmaPromise> = {};
  private completed: Record<Address, boolean> = {};
  private prepared = false;

  async prepare() {
    if (this.prepared) {
      return;
    }
    const [created, started, completed] = await GetCompanies();
    created.forEach((company) => this.processCreatedCompany(company));
    started.forEach((company) => this.processStartedCompany(company));
    completed.forEach((company) => this.processCompletedCompany(company));
    await Promise.all(Object.values(this.companies).map((c) => this.loadCompanyDetails(c)));

    const [requested, claimed, failed] = await GetPromises();
    requested.forEach((promise) => this.processRequestedPromise(promise));
    claimed.forEach((promise) => this.processClaimedPromise(promise));
    failed.forEach((promise) => this.processFailedPromise(promise));

    const investments = await GetInvestments();
    investments.forEach((inv) => this.processInvestment(inv));
    await Promise.all(Object.values(this.people).map((p) => this.loadPersonIdentities(p)));
    this.prepared = true;
  }

  private processCreatedCompany(company: ProjectCreated) {
    const companyCreator = company.creator.toString() as Address;
    if (!this.people[companyCreator]) {
      this.people[companyCreator] = {
        address: companyCreator,
        ens: null,
        avatar: null,
        twitter: null,
      };
    }

    const companyProjectId = company.projectId.toString() as Address;
    this.companies[companyProjectId] = {
      cid: company.cid.toString() as Address,
      projectId: companyProjectId,
      creator: this.people[companyCreator],
      status: {
        completed: false,
        safe: '0x0',
        goal: formatEther(BigInt(company.fundingRequired.toString())),
        investments: [],
        promises: [],
      },
      details: null,
    };
  }

  private processStartedCompany(company: ProjectStarted) {
    const companyId = company.projectId.toString() as Address;
    this.companies[companyId].status.safe = company.safe.toString() as Address;
  }

  private processCompletedCompany(company: ProjectCompleted) {
    const companyId = company.projectId.toString() as Address;
    this.companies[companyId].status.completed = true;
  }

  private async loadCompanyDetails(company: Company) {
    const data = await ipfsStorage.fetch(company.cid);
    company.details = data as CompanyDetails;
  }

  private processRequestedPromise(promise: TrancheRequested) {
    const promiseId = promise.trancheId.toString() as Address;
    this.promises[promiseId] = {
      id: promiseId,
      text: promise.claim.toString(),
      amount: Number(formatEther(BigInt(promise.amount.toString()))),
      claimed: false,
      failed: false,
    };
    const companyId = promise.projectId.toString() as Address;
    this.companies[companyId].status.promises.push(this.promises[promiseId]);
  }

  private processClaimedPromise(promise: TrancheClaimed) {
    const promiseId = promise.trancheId.toString() as Address;
    this.promises[promiseId].failed = false;
    this.promises[promiseId].claimed = true;
  }

  private processFailedPromise(promise: TrancheFailed) {
    const promiseId = promise.trancheId.toString() as Address;
    this.promises[promiseId].failed = true;
    this.promises[promiseId].claimed = false;
  }

  private processInvestment(investment: ProjectFunded) {
    console.log(investment);
    const funder = investment.funder.toString() as Address;
    if (!this.people[funder]) {
      this.people[funder] = {
        address: funder,
        ens: null,
        avatar: null,
        twitter: null,
      };
    }
    const companyId = investment.projectId;
    this.companies[companyId.toString() as Address].status.investments.push({
      investor: this.people[funder],
      amount: Number(formatEther(BigInt(investment.amount.toString()))),
    });
  }

  private async loadPersonIdentities(person: Person) {
    if (this.completed[person.address]) {
      return;
    }
    const identity = await fetchIdentities(person.address.toLowerCase());
    console.log('identity', identity);
    if (!identity) {
      console.log('wwww');
      return;
    }
    person.avatar = identity.avatarUrl;
    if (!person.avatar) {
      person.avatar = identity.profileUrl ?? null;
    }
    person.avatar = person.avatar === '' ? fakerEN.image.avatarGitHub() : person.avatar;
    person.ens = identity.displayName;
    if (!person.ens) {
      person.ens = '[fake]' + fakerEN.company.catchPhraseNoun() + '.eth';
    }
    for (const i of identity.neighbor) {
      if (i.identity.platform == 'twitter') {
        person.twitter = i.identity.displayName;
      }
    }
    this.completed[person.address] = true;
  }

  async fetchNewCompany(cid: Address, details: CompanyDetails): Promise<Company> {
    let counter = 0;
    while (counter < 30) {
      const created = await GetCompany(cid);
      console.log(created);
      if (created.length > 0) {
        const company = created[0];
        this.processCreatedCompany(company);
        const projectId = company.projectId.toString() as Address;
        this.companies[projectId].details = details;
        await this.loadPersonIdentities(this.companies[projectId].creator);
        return this.companies[projectId];
      }
      counter += 1;
      console.log('counter:', counter);
      await cooldown();
    }
    console.log('40 sec spinning, no company');
    return Object.values(this.companies)[0];
  }

  getTwitterHandle(address: Address): string {
    return this.people[address].twitter ?? '';
  }
}

function cooldown(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

const stateAtom = atom(new GlobalState());
export const globalStateAtom = atom(async (get) => {
  const state = get(stateAtom);
  await state.prepare();
  return state;
});

export function isCreatorContext(address: Address, company: Company): boolean {
  return company.creator.address.toLowerCase() === address.toLowerCase();
}

export function isInvestorContext(address: Address, company: Company): boolean {
  return (
    company.status.investments.find(
      (inv) => inv.investor.address.toLowerCase() === address.toLowerCase(),
    ) != null
  );
}

export function getFunds(company: Company): number {
  return company.status.investments.reduce((acc, inv) => acc + inv.amount, 0);
}

export function getClaimed(company: Company): number {
  return company.status.promises.reduce((acc, pr) => acc + pr.amount, 0);
}
