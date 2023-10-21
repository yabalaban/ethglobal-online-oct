'use client';

import { Address, toHex } from 'viem';
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
        goal: Number(company.fundingRequired),
        investments: [],
        promise: null,
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
    const promiseId = toHex(promise.id);
    this.promises[promiseId] = {
      id: promiseId,
      text: promise.claim.toString(),
      amount: Number(promise.amount),
      claimed: false,
      failed: false,
    };
    const companyId = toHex(promise.projectId);
    this.companies[companyId].status.promise = this.promises[promiseId];
  }

  private processClaimedPromise(promise: TrancheClaimed) {
    const promiseId = toHex(promise.id);
    this.promises[promiseId].failed = false;
    this.promises[promiseId].claimed = true;
  }

  private processFailedPromise(promise: TrancheFailed) {
    const promiseId = toHex(promise.id);
    this.promises[promiseId].failed = true;
    this.promises[promiseId].claimed = false;
  }

  private processInvestment(investment: ProjectFunded) {
    const funder = toHex(investment.funder);
    if (!this.people[funder]) {
      this.people[funder] = {
        address: funder,
        ens: null,
        avatar: null,
        twitter: null,
      };
    }
    const companyId = toHex(investment.projectId);
    this.companies[companyId].status.investments.push({
      investor: this.people[funder],
      amount: Number(investment.amount),
    });
  }

  private async loadPersonIdentities(person: Person) {
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
