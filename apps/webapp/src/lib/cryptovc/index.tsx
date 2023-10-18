import { Company, Menu, Person } from './types';
import { fakerEN } from '@faker-js/faker';

export function getMenu(): Menu[] {
  // Companies is always active.
  // Portfolio tab is active whenever wallet is associated with
  // any company (both as creator or investor).
  return [
    { title: 'Companies', path: '/', enabled: true },
    { title: 'Portfolio', path: '/portfolio', enabled: true },
    { title: 'Create Company', path: '/company/create', enabled: true },
  ];
}

class MockData {
  creatorA: Person;
  investorA1: Person;
  investorA2: Person;
  investorA3: Person;
  companyA: Company;
  creatorB: Person;
  companyB: Company;
  creatorC: Person;
  investorC1: Person;
  companyC: Company;
  companies: Record<string, Company>;

  constructor() {
    this.creatorA = makePerson();
    this.investorA1 = makePerson();
    this.investorA2 = makePerson();
    this.investorA3 = makePerson();
    this.companyA = makeCompany(this.creatorA, [this.investorA1, this.investorA2, this.investorA3]);

    this.creatorB = makePerson();
    this.companyB = makeCompany(this.creatorB, []);

    this.creatorC = makePerson();
    this.investorC1 = makePerson();
    this.companyC = makeCompany(this.creatorC, [this.investorC1, this.creatorA]);

    this.companies = {};
    this.companies[this.companyA.id] = this.companyA;
    this.companies[this.companyB.id] = this.companyB;
    this.companies[this.companyC.id] = this.companyC;
  }
}
export const mock = new MockData();

function getRandomFromRange(min: number, max: number): number {
  return Math.trunc(Math.random() * (max - min) + min);
}

function makePerson(): Person {
  const faker = fakerEN;
  return {
    address: faker.finance.ethereumAddress(),
    identities: [],
    handle: faker.company.buzzNoun() + '.eth',
    pic: faker.image.avatar(),
  };
}

function makeCompany(creator: Person, investors: Person[]): Company {
  const faker = fakerEN;
  return {
    id: faker.finance.creditCardNumber(),
    creator: creator,
    path: '',
    name: faker.company.catchPhraseNoun(),
    description: faker.lorem.paragraphs(),
    pic: faker.image.url(),
    goal: getRandomFromRange(4, 10),
    progress: 2.4,
    investors: investors,
    currency: 'ETH',
    ipfs: '123',
  };
}

export async function getCompany(id: string): Promise<Company | null> {
  if (mock.companyA.id == id) {
    return mock.companyA;
  } else if (mock.companyB.id == id) {
    return mock.companyB;
  } else if (mock.companyC.id == id) {
    return mock.companyC;
  } else {
    return mock.companyA;
  }
}

export async function getViewer(): Promise<Person> {
  return mock.creatorA;
}

export async function getCompanies(): Promise<Company[]> {
  return [
    mock.companyA,
    mock.companyB,
    mock.companyC,
    mock.companyA,
    mock.companyB,
    mock.companyC,
    mock.companyA,
    mock.companyB,
    mock.companyC,
  ];
}
