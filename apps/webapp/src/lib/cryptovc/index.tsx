import { Company, Menu, Person } from './types';
import { fakerEN } from '@faker-js/faker';

export function getMenu(): Menu[] {
  return [
    { title: 'Companies', path: 'kek', enabled: true },
    { title: 'Portfolio', path: 'lol', enabled: false },
  ];
}

function getRandomFromRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function makePerson(): Person {
  const faker = fakerEN;
  return {
    address: faker.finance.ethereumAddress(),
    identities: [],
    handle: faker.company.buzzNoun + '.eth',
    pic: faker.image.avatar(),
  };
}

function makeCompany(creator: Person, investors: Person[]): Company {
  const faker = fakerEN;
  return {
    creator: creator,
    path: '',
    name: faker.company.catchPhraseNoun(),
    description: faker.company.buzzPhrase(),
    pic: faker.image.url(),
    goal: getRandomFromRange(4, 10) + ' ETH',
    progress: '0%',
    investors: investors,
  };
}

export function getCompanies(): Company[] {
  const creatorA = makePerson();
  const investorA1 = makePerson();
  const investorA2 = makePerson();
  const investorA3 = makePerson();
  const companyA = makeCompany(creatorA, [investorA1, investorA2, investorA3]);

  const creatorB = makePerson();
  const companyB = makeCompany(creatorB, []);

  const creatorC = makePerson();
  const investorC1 = makePerson();
  const companyC = makeCompany(creatorC, [investorC1]);

  return [companyA, companyB, companyC];
}
