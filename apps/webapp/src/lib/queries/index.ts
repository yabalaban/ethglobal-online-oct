import { Address } from 'viem';
import { GRAPH_QUERY_URL } from '../constants';
import {
  ProjectCompleted,
  ProjectCreated,
  ProjectFunded,
  ProjectStarted,
  TrancheClaimed,
  TrancheFailed,
  TrancheRequested,
} from '../subgraph/generated/schema';

const CompaniesStatusQuery = `query CompaniesQuery {
    projectCreateds {
        projectId
        creator
        ethCollateralDeposit
        fundingRequired
        cid
        blockNumber
    }
    projectStarteds {
        projectId
        safe
    }
    projectCompleteds {
        projectId
    }
}`;

const CompanyStatusQuery = `query CompanyQuery($cid: Bytes) {
    projectCreateds(where : { cid: $cid }) {
        projectId
        creator
        ethCollateralDeposit
        fundingRequired
        cid
    }
}`;

const InvestmentsQuery = `query InvestmentsQuery {
    projectFundeds {
        projectId
        funder
        amount
    }
}`;

const PromisesQuery = `query PromisesQuery {
    trancheRequesteds {
        trancheId
        projectId
        amount
        claim
    }
    trancheClaimeds {
        trancheId
        projectId
        amount
    }
    trancheFaileds {
        trancheId
        projectId
        amount
    }
}`;

export async function GetCompany(cid: Address): Promise<ProjectCreated[]> {
  const results = await fetchGraphQuery(CompanyStatusQuery, { cid: cid });
  return results.projectCreateds;
}

export async function GetCompanies(): Promise<
  [ProjectCreated[], ProjectStarted[], ProjectCompleted[]]
> {
  const results = await fetchGraphQuery(CompaniesStatusQuery, {});
  return [results.projectCreateds, results.projectStarteds, results.projectCompleteds];
}

export async function GetInvestments(): Promise<ProjectFunded[]> {
  const results = await fetchGraphQuery(InvestmentsQuery, {});
  return results.projectFundeds;
}

export async function GetPromises(): Promise<
  [TrancheRequested[], TrancheClaimed[], TrancheFailed[]]
> {
  const results = await fetchGraphQuery(PromisesQuery, {});
  return [results.trancheRequesteds, results.trancheClaimeds, results.trancheFaileds];
}

async function fetchGraphQuery(query: string, variables: Record<string, any>) {
  const results = await fetch(GRAPH_QUERY_URL, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const characters = await results.json();
  return characters.data;
}
