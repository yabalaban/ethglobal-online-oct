/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * A UUID is a unique 128-bit number, stored as 16 octets. UUIDs are parsed as
   * Strings within GraphQL. UUIDs are used to assign unique identifiers to
   * entities without requiring a central allocating authority.
   *
   * # References
   *
   * * [Wikipedia: Universally Unique Identifier](http://en.wikipedia.org/wiki/Universally_unique_identifier)
   * * [RFC4122: A Universally Unique IDentifier (UUID) URN Namespace](http://tools.ietf.org/html/rfc4122)
   */
  UUID: { input: any; output: any; }
};

/** List of chains supported by RelationService. */
export enum Chain {
  /**
   * Arbitrum One
   * http://arbiscan.io
   */
  Arbitrum = 'arbitrum',
  /**
   * Arweave enables you to store documents and applications forever.
   * https://www.arweave.org
   */
  Arweave = 'arweave',
  /**
   * Avalanche is an open, programmable smart contracts platform for decentralized applications.
   * https://www.avax.com/
   */
  Avalanche = 'avalanche',
  /**
   * BNB Smart Chain (BSC) (Previously Binance Smart Chain) - EVM compatible, consensus layers, and with hubs to multi-chains.
   * https://www.binance.com/en/support/announcement/854415cf3d214371a7b60cf01ead0918
   */
  Bsc = 'bsc',
  /**
   * Celo is the carbon-negative, mobile-first, EVM-compatible blockchain ecosystem leading a thriving new digital economy for all.
   * https://celo.org/
   */
  Celo = 'celo',
  /**
   * Conflux is a new secure and reliable public blockchain with very high performance and scalability.
   * https://developer.confluxnetwork.org
   */
  Conflux = 'conflux',
  /**
   * Conflux has a virtual machine that is similar to the EVM.
   * https://evm.confluxscan.io
   * https://developer.confluxnetwork.org/conflux-doc/docs/EVM-Space/intro_of_evm_space
   */
  ConfluxEspace = 'conflux_espace',
  Crossbell = 'crossbell',
  /** The Blockchain. */
  Ethereum = 'ethereum',
  EthereumClassic = 'ethereum_classic',
  /**
   * Fantom is a highly scalable blockchain platform for DeFi, crypto dApps, and enterprise applications.
   * https://fantom.foundation/
   */
  Fantom = 'fantom',
  /**
   * Gnosis Chain provides stability, scalability and an extendable beacon chain framework.
   * Established in 2018 as the xDai Chain, the updated Gnosis Chain gives devs the tools and resources they need to create enhanced user experiences and optimized applications.
   * https://developers.gnosischain.com
   */
  Gnosis = 'gnosis',
  /**
   * A cross-client proof-of-authority testing network for Ethereum.
   * https://goerli.net
   */
  Goerli = 'goerli',
  /** Deprecated since `The Merge`. */
  Kovan = 'kovan',
  /**
   * Polygon Testnet
   * https://mumbai.polygonscan.com
   */
  Mumbai = 'mumbai',
  /**
   * Optimism is a low-cost and lightning-fast Ethereum L2 blockchain.
   * https://www.optimism.io
   */
  Optimism = 'optimism',
  /**
   * Polygon is a decentralised Ethereum scaling platform that enables developers to build scalable user-friendly dApps with low transaction fees without ever sacrificing on security.
   * https://polygon.technology
   */
  Polygon = 'polygon',
  /** Deprecated since `The Merge`. */
  Rinkeby = 'rinkeby',
  /** Deprecated since `The Merge`. */
  Ropsten = 'ropsten',
  /**
   * Sepolia is expected to undergo `The Merge` to proof-of-stake in summer 2022.
   * https://sepolia.dev
   */
  Sepolia = 'sepolia',
  /**
   * Solana is a decentralized blockchain built to enable scalable, user-friendly apps for the world.
   * https://solana.com
   */
  Solana = 'solana',
  Unknown = 'unknown',
  Xdai = 'xdai',
  /** https://zksync.io */
  Zksync = 'zksync'
}

export enum ContractCategory {
  Ens = 'ENS',
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155',
  Poap = 'POAP',
  Unknown = 'unknown'
}

/**
 * Who collects all the data.
 * It works as a "data cleansing" or "proxy" between `Upstream`s and us.
 */
export enum DataFetcher {
  /** Aggregation service */
  AggregationService = 'aggregation_service',
  /** DataMgr service */
  DataService = 'data_service',
  /** This server */
  RelationService = 'relation_service'
}

/** All data respource platform. */
export enum DataSource {
  /**
   * CyberConnect
   * https://cyberconnect.me
   * Twitter <-> Etheruem
   * Twitter binding is guarenteed by CC's OAuth.
   * Wallet binding signature is based on CC's own standard, which is crypto-verifiable.
   */
  Cyberconnect = 'cyberconnect',
  /** .bit */
  Dotbit = 'dotbit',
  /**
   * Twitter <-> Ethereum
   * ENS data fetched from twitter user's `screen_name`.
   * (i.e., user changed their name as `seems-to-be-like-a.eth`)
   * Pretty much unreliable.
   */
  Ens = 'ens',
  /**
   * https://ethleaderboard.xyz/
   * Twitter <-> Ethereum
   * Cannot be verified. Based on twitter `display_name` and followers.
   */
  EthLeaderboard = 'ethLeaderboard',
  Farcaster = 'farcaster',
  /**
   * Firefly
   * https://firefly.land
   * Twitter <-> Ethereum
   * Firefly app has Twitter OAuth login info, and do binding with
   * user's wallet by EIP-4361, which is crypto-guarenteed.
   */
  Firefly = 'firefly',
  /** https://keybase.io/docs/api/1.0/call/user/lookup */
  Keybase = 'keybase',
  /** https://docs.knn3.xyz/graphql/ */
  Knn3 = 'knn3',
  /**
   * .lens
   * https://docs.lens.xyz/docs/api-links
   */
  Lens = 'lens',
  /**
   * Twitter <-> Ethereum
   * Manually added by Firefly.land team.
   * Cannot be verified by third party, only trust the team.
   */
  ManuallyAdded = 'manually_added',
  /** https://docs.next.id/docs/proof-service/api */
  Nextid = 'nextid',
  /**
   * opensea
   * https://opensea.io
   * Twitter <-> Ethereum
   * Kinda not that trustable. In the old time, user can
   * set their Twitter account in Opensea without any validation.
   * Currently we cannot tell if a record has been validated by OpenSea.
   */
  Opensea = 'opensea',
  /**
   * Twitter <-> Ethereum
   * Blocktracker's algorithm,
   * by comparing Twitter user's profile pic (not hexagon PFP, but original pic) with existd NFT picture.
   * Not verifiable, even has potential of mismatching.
   */
  Pfp = 'pfp',
  /** Data directly fetched from blockchain's RPC server, by calling contract's `public view` function. */
  RpcServer = 'rpc_server',
  /**
   * https://rss3.io/network/api.html
   * Twitter <-> Ethereum
   * RSS3 open database of their social bindings.
   * Twitter is guarenteed by RSS3's OAuth, wallet is guarenteed by RSS3's own signature standard.
   * Partial crypto-verifiable.
   */
  Rss3 = 'rss3',
  SpaceId = 'space_id',
  /**
   * https://github.com/Uniswap/sybil-list/blob/master/verified.json
   * Twitter <-> Ethereum
   * (according to official README)
   * This repo contains a list of verified mappings that link
   * Ethereum addresses with social profiles (Twitter supported currently).
   */
  Sybil = 'sybil',
  TheGraph = 'the_graph',
  /**
   * twitter_hexagon
   * Twitter <-> Ethereum
   * NFT set by twitter user (hexagon PFP).
   * We cannot get the original signature generated by user, so not verifiable.
   */
  TwitterHexagon = 'twitter_hexagon',
  /** Unknown */
  Unknown = 'unknown',
  /** UnstoppableDomains */
  Unstoppabledomains = 'unstoppabledomains'
}

/** Status for a record in RelationService DB */
export enum DataStatus {
  /** Fetched or not in Database. */
  Cached = 'cached',
  /**
   * Fetching this data.
   * The result you got maybe outdated.
   * Come back later if you want a fresh one.
   */
  Fetching = 'fetching',
  /** Outdated record */
  Outdated = 'outdated'
}

/** All domain system name. */
export enum DomainNameSystem {
  /**
   * ENS name system on the ETH chain.
   * https://ens.domains
   */
  Ens = 'ENS',
  /** https://www.did.id/ */
  Dotbit = 'dotbit',
  /** https://api.lens.dev/playground */
  Lens = 'lens',
  /** https://api.prd.space.id/ */
  SpaceId = 'space_id',
  Unknown = 'unknown',
  /** https://unstoppabledomains.com/ */
  Unstoppabledomains = 'unstoppabledomains'
}

export type EdgeUnion = HoldRecord | ProofRecord;

export type HoldRecord = {
  __typename?: 'HoldRecord';
  /** Contract address of this Contract. Usually `0xHEX_STRING`. */
  address: Scalars['String']['output'];
  /** NFT Category. See `availableNftCategories` for all values available. */
  category: ContractCategory;
  /**
   * On which chain?
   * See `availableChains` for all chains supported by RelationService.
   */
  chain: Chain;
  /** When the transaction happened. May not be provided by upstream. */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /**
   * Who collects this data.
   * It works as a "data cleansing" or "proxy" between `source`s and us.
   */
  fetcher: DataFetcher;
  /** Which `IdentityRecord` does this connection starts at. */
  from: IdentityRecord;
  /**
   * NFT_ID in contract / ENS domain / anything can be used as an unique ID to specify the held object.
   * It must be one here.
   * Tips: NFT_ID of ENS is a hash of domain. So domain can be used as NFT_ID.
   */
  id: Scalars['String']['output'];
  /** Which `Identity` does this NFT belong to. */
  owner: IdentityRecord;
  /**
   * Data source (upstream) which provides this info.
   * Theoretically, Contract info should only be fetched by chain's RPC server,
   * but in practice, we still rely on third-party cache / snapshot service.
   */
  source: DataSource;
  /** Token symbol (if any). */
  symbol?: Maybe<Scalars['String']['output']>;
  /** Which `IdentityRecord` does this connection ends at. */
  to: IdentityRecord;
  /**
   * Transaction info of this connection.
   * i.e. in which `tx` the Contract is transferred / minted.
   * In most case, it is a `"0xVERY_LONG_HEXSTRING"`.
   * It happens that this info is not provided by `source`, so we treat it as `Option<>`.
   */
  transaction?: Maybe<Scalars['String']['output']>;
  /** When this HODL™ relation is fetched by us RelationService. */
  updatedAt: Scalars['Int']['output'];
  /** UUID of this record. */
  uuid: Scalars['UUID']['output'];
};

export type IdentityRecord = {
  __typename?: 'IdentityRecord';
  /**
   * When this Identity is added into this database.
   * Second-based unix timestamp.
   * Generated by us.
   */
  addedAt: Scalars['Int']['output'];
  /** URL to avatar (if any is recorded and given by target platform). */
  avatarUrl?: Maybe<Scalars['String']['output']>;
  /**
   * Account / identity creation time ON TARGET PLATFORM.
   * This is not necessarily the same as the creation time of the record in the database.
   * Since `created_at` may not be recorded or given by target platform.
   * e.g. `Twitter` has a `created_at` in the user profile API.
   * but `Ethereum` is obviously no such thing.
   */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /**
   * Usually user-friendly screen name.  e.g. for `Twitter`, this
   * is the user's `screen_name`.
   * Note: both `null` and `""` should be treated as "no value".
   */
  displayName?: Maybe<Scalars['String']['output']>;
  /**
   * Identity on target platform.  Username or database primary key
   * (prefer, usually digits).  e.g. `Twitter` has this digits-like
   * user ID thing.
   */
  identity: Scalars['String']['output'];
  /** Neighbor identity from current. Flattened. */
  neighbor: Array<IdentityWithSource>;
  neighborWithTraversal: Array<EdgeUnion>;
  /**
   * NFTs owned by this identity.
   * For now, there's only `platform: ethereum` identity has NFTs.
   * If `category` is provided, only NFTs of that category will be returned.
   */
  nft: Array<HoldRecord>;
  /** there's only `platform: lens` identity `ownedBy` is not null */
  ownedBy?: Maybe<IdentityRecord>;
  /**
   * Platform.  See `avaliablePlatforms` or schema definition for a
   * list of platforms supported by RelationService.
   */
  platform: Platform;
  /** URL to target identity profile page on `platform` (if any). */
  profileUrl?: Maybe<Scalars['String']['output']>;
  /** Status for this record in RelationService. */
  status: Array<DataStatus>;
  /**
   * When it is updated (re-fetched) by us RelationService.
   * Second-based unix timestamp.
   * Managed by us.
   */
  updatedAt: Scalars['Int']['output'];
  /**
   * UUID of this record.  Generated by us to provide a better
   * global-uniqueness for future P2P-network data exchange
   * scenario.
   */
  uuid?: Maybe<Scalars['UUID']['output']>;
};


export type IdentityRecordNeighborArgs = {
  depth?: InputMaybe<Scalars['Int']['input']>;
};


export type IdentityRecordNeighborWithTraversalArgs = {
  depth?: InputMaybe<Scalars['Int']['input']>;
};


export type IdentityRecordNftArgs = {
  category?: InputMaybe<Array<ContractCategory>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type IdentityWithSource = {
  __typename?: 'IdentityWithSource';
  identity: IdentityRecord;
  sources: Array<DataSource>;
};

/**
 * All identity platform.
 * TODO: move this definition into `graph/vertex/identity`, since it is not specific to upstream.
 */
export enum Platform {
  /** DNS */
  Dns = 'dns',
  /** .bit */
  Dotbit = 'dotbit',
  /** Ethereum wallet `0x[a-f0-9]{40}` */
  Ethereum = 'ethereum',
  /** Farcaster */
  Farcaster = 'farcaster',
  /** Github */
  Github = 'github',
  /** Keybase */
  Keybase = 'keybase',
  /** Lens */
  Lens = 'lens',
  /** Minds */
  Minds = 'minds',
  /** NextID */
  Nextid = 'nextid',
  /** Reddit */
  Reddit = 'reddit',
  /** SpaceId */
  SpaceId = 'space_id',
  /** Twitter */
  Twitter = 'twitter',
  /** Unknown */
  Unknown = 'unknown',
  /** UnstoppableDomains */
  Unstoppabledomains = 'unstoppabledomains'
}

export type ProofRecord = {
  __typename?: 'ProofRecord';
  /** When this connection is recorded in upstream platform (if platform gives such data). */
  createdAt?: Maybe<Scalars['Int']['output']>;
  /**
   * Who collects this data.
   * It works as a "data cleansing" or "proxy" between `source`s and us.
   */
  fetcher: DataFetcher;
  /** Which `IdentityRecord` does this connection starts at. */
  from: IdentityRecord;
  /** ID of this connection in upstream platform to locate (if any). */
  recordId?: Maybe<Scalars['String']['output']>;
  /** Data source (upstream) which provides this connection info. */
  source: DataSource;
  /** Which `IdentityRecord` does this connection ends at. */
  to: IdentityRecord;
  /** When this connection is fetched by us RelationService. */
  updatedAt: Scalars['Int']['output'];
  /**
   * UUID of this record. Generated by us to provide a better
   * global-uniqueness for future P2P-network data exchange
   * scenario.
   */
  uuid: Scalars['UUID']['output'];
};

/** Base struct of GraphQL query request. */
export type Query = {
  __typename?: 'Query';
  apiVersion: Scalars['String']['output'];
  /** List of all chains supported by RelationService. */
  availableChains: Array<Scalars['String']['output']>;
  availableNameSystem: Array<Scalars['String']['output']>;
  /** List of all Contract Categoris supported by RelationService. */
  availableNftCategoris: Array<Scalars['String']['output']>;
  /** Returns a list of all platforms supported by RelationService. */
  availablePlatforms: Array<Platform>;
  /** Returns a list of all upstreams (data sources) supported by RelationService. */
  availableUpstreams: Array<DataSource>;
  domain?: Maybe<ResolveEdge>;
  /** Query an `identity` by given `platform` and `identity`. */
  identity?: Maybe<IdentityRecord>;
  /** Search an NFT. */
  nft?: Maybe<HoldRecord>;
  ping: Scalars['String']['output'];
  /** Prefetch proofs which are prefetchable, e.g. SybilList. */
  prefetchProof: Scalars['String']['output'];
  proof?: Maybe<ProofRecord>;
};


/** Base struct of GraphQL query request. */
export type QueryDomainArgs = {
  domainSystem: DomainNameSystem;
  name: Scalars['String']['input'];
};


/** Base struct of GraphQL query request. */
export type QueryIdentityArgs = {
  identity: Scalars['String']['input'];
  platform: Scalars['String']['input'];
};


/** Base struct of GraphQL query request. */
export type QueryNftArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  category: ContractCategory;
  chain: Chain;
  id: Scalars['String']['input'];
};


/** Base struct of GraphQL query request. */
export type QueryProofArgs = {
  uuid?: InputMaybe<Scalars['String']['input']>;
};

export type ResolveEdge = {
  __typename?: 'ResolveEdge';
  /**
   * Who collects this data.
   * It works as a "data cleansing" or "proxy" between `source`s and us.
   */
  fetcher: DataFetcher;
  /** Name of domain (e.g., `vitalik.eth`, `dotbit.bit`) */
  name: Scalars['String']['output'];
  /** `owner`: Return ENS name or .bit owned by wallet address. */
  owner: IdentityRecord;
  /** `resolved`: Find an Ethereum wallet using ENS name or .bit alias. */
  resolved?: Maybe<IdentityRecord>;
  /** Data source (upstream) which provides this info. */
  source: DataSource;
  /** Domain Name system */
  system: DomainNameSystem;
  /** When this connection is fetched by us RelationService. */
  updatedAt: Scalars['Int']['output'];
  /** UUID of this record. */
  uuid: Scalars['UUID']['output'];
};

export type FindOneIdentityQueryVariables = Exact<{
  identity: Scalars['String']['input'];
}>;


export type FindOneIdentityQuery = { __typename?: 'Query', identity?: { __typename?: 'IdentityRecord', uuid?: any | null, platform: Platform, identity: string, displayName?: string | null, profileUrl?: string | null, avatarUrl?: string | null, createdAt?: number | null, updatedAt: number, neighbor: Array<{ __typename?: 'IdentityWithSource', sources: Array<DataSource>, identity: { __typename?: 'IdentityRecord', uuid?: any | null, platform: Platform, identity: string, displayName?: string | null } }> } | null };


export const FindOneIdentityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findOneIdentity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identity"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"platform"},"value":{"kind":"StringValue","value":"ethereum","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"identity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identity"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"identity"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"profileUrl"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"neighbor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"depth"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sources"}},{"kind":"Field","name":{"kind":"Name","value":"identity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"identity"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindOneIdentityQuery, FindOneIdentityQueryVariables>;