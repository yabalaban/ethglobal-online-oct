import { Address, fromHex, toHex } from 'viem';
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
import { create } from 'domain';

export class GlobalState {
  static people: Record<Address, Person> = {};
  static companies: Record<Address, Company> = {};
  static promises: Record<Address, UmaPromise> = {};

  async prepare() {
    const [created, started, completed] = await GetCompanies();
    created.forEach(this.processCreatedCompany);
    started.forEach(this.processStartedCompany);
    completed.forEach(this.processCompletedCompany);
    Promise.all(Object.values(GlobalState.companies).map((c) => this.loadCompanyDetails(c)));

    const [requested, claimed, failed] = await GetPromises();
    requested.forEach(this.processRequestedPromise);
    claimed.forEach(this.processClaimedPromise);
    failed.forEach(this.processFailedPromise);

    const investments = await GetInvestments();
    investments.forEach(this.processInvestment);
    Promise.all(Object.values(GlobalState.people).map(this.loadPersonIdentities));
  }

  private processCreatedCompany(company: ProjectCreated) {
    const companyCreator = company.creator.toString() as Address;
    if (!GlobalState.people[companyCreator]) {
      GlobalState.people[companyCreator] = {
        address: companyCreator,
        ens: null,
        avatar: null,
        twitter: null,
      };
    }

    const companyProjectId = company.projectId.toString() as Address;
    GlobalState.companies[companyProjectId] = {
      cid: company.cid.toString() as Address,
      projectId: companyProjectId,
      creator: GlobalState.people[companyCreator],
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
    GlobalState.companies[companyId].status.safe = company.safe.toString() as Address;
  }

  private processCompletedCompany(company: ProjectCompleted) {
    const companyId = company.projectId.toString() as Address;
    GlobalState.companies[companyId].status.completed = true;
  }

  private async loadCompanyDetails(company: Company) {
    const data = await ipfsStorage.fetch(company.cid);
    company.details = data as CompanyDetails;
  }

  private processRequestedPromise(promise: TrancheRequested) {
    const promiseId = toHex(promise.id);
    GlobalState.promises[promiseId] = {
      id: promiseId,
      text: promise.claim.toString(),
      amount: Number(promise.amount),
      claimed: false,
      failed: false,
    };
    const companyId = toHex(promise.projectId);
    GlobalState.companies[companyId].status.promise = GlobalState.promises[promiseId];
  }

  private processClaimedPromise(promise: TrancheClaimed) {
    const promiseId = toHex(promise.id);
    GlobalState.promises[promiseId].failed = false;
    GlobalState.promises[promiseId].claimed = true;
  }

  private processFailedPromise(promise: TrancheFailed) {
    const promiseId = toHex(promise.id);
    GlobalState.promises[promiseId].failed = true;
    GlobalState.promises[promiseId].claimed = false;
  }

  private processInvestment(investment: ProjectFunded) {
    const funder = toHex(investment.funder);
    if (!GlobalState.people[funder]) {
      GlobalState.people[funder] = {
        address: funder,
        ens: null,
        avatar: null,
        twitter: null,
      };
    }
    const companyId = toHex(investment.projectId);
    GlobalState.companies[companyId].status.investments.push({
      investor: GlobalState.people[funder],
      amount: Number(investment.amount),
    });
  }

  private async loadPersonIdentities(person: Person) {
    const identity = await fetchIdentities(person.address);
    if (!identity) {
      return;
    }
    person.avatar = identity.avatarUrl ?? null;
    if (!person.avatar) {
      person.avatar = identity.profileUrl ?? null;
    }
    person.ens = identity.displayName ?? null;
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
      if (created.length > 0) {
        this.processCreatedCompany(created[0]);
        const projectId = toHex(created[0].projectId);
        GlobalState.companies[projectId].details = details;
        this.loadPersonIdentities(GlobalState.companies[projectId].creator);
        return GlobalState.companies[projectId];
      }
      counter += 1;
      console.log('counter:', counter);
      await cooldown();
    }
    console.log('40 sec spinning, no company');
    return Object.values(GlobalState.companies)[0];
  }
}

function cooldown(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

export const gs = new GlobalState();
