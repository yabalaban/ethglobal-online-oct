# CryptoVC

CryptoVC introduces a revolutionary approach to transparent and trustless investments in the world of cryptocurrencies.

We believe that Crypto Natives should be funded by Crypto Natives onchain.

---

CryptoVC is deployed to Goerli for testing: https://goerli.etherscan.io/address/0x662806c86678dd086bb6b2f37a18ff6ece94b28c

On smart contract side:

- when creating a project some ETH collateral is required, which [will be sent to Sparklend pool](https://github.com/yabalaban/ethglobal-online-oct/blob/main/packages/contracts/src/CryptoVC.sol#L122) in [exchange for DAI](https://github.com/yabalaban/ethglobal-online-oct/blob/main/packages/contracts/src/CryptoVC.sol#L126), also [ERC-20 smart-contract will be deployed](https://github.com/yabalaban/ethglobal-online-oct/blob/main/packages/contracts/src/CryptoVC.sol#L156) for project shares allocation
- [DAI is automatically converted to sDAI](https://github.com/yabalaban/ethglobal-online-oct/blob/main/packages/contracts/src/CryptoVC.sol#L128) to accumulate the interest during fundraise
- project then can be partially funded in DAI
- when funded in full
  - all DAI funding is pooled from the investors and [converted to sDAI](https://github.com/yabalaban/ethglobal-online-oct/blob/main/packages/contracts/src/CryptoVC.sol#L272) to accumulate interest
  - at the same time ERC-20 project shares are distributed on pro-rata basis
  - and [Safe multi-sig is deployed](https://github.com/yabalaban/ethglobal-online-oct/blob/main/packages/contracts/src/CryptoVC.sol#L275-L289) with investors and the creator as signers
- after funding succeeded the creator can request a tranche of funds
  - creator should first propose a request tranche transaction to project Safe for everyone to sign
  - when signed and executed – [UMA assertion is posted to confirm the project status](https://github.com/yabalaban/ethglobal-online-oct/blob/main/packages/contracts/src/CryptoVC.sol#L207-L217)
  - if no challenged and settled, then the tranche will be [withdrawn from sDAI](https://github.com/yabalaban/ethglobal-online-oct/blob/main/packages/contracts/src/CryptoVC.sol#L245) and sent as DAI to the creator

On webapp side:

- the app allows to interact with CryptoVC smart-contract functions
- it also allows to propose the project Safe transactions by the creator via Safe API SDK
- all the data is fetched via subgraph based on dedicated subgraph (via thegraph)
- project metadata is stored in ipfs via web3.storage
- we also use Next.ID by Mask Network to fetch identity information about project creators
- push.org is used to send project notifications
- xmtp is used to handle communication between creator and investors

---

Contracts:

- foundry (+openzeppelin,solmate,uma,aave/spark,sdai) for CryptoVC contract
- deployed to goeli

Web:

- next.js
- rainbowkit + wagmi + viem
- [safe api sdk](./apps/webapp/src/web3/safe.ts)
- [web3.storage for ipfs](./apps/webapp/src/lib/storage/index.ts)
- xmtp for broadcasting
- push.org for notifications
- next.id for creator identities

Other:

- custom thegraph subgraph
