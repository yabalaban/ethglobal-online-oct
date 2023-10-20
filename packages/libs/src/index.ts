import { providers, ethers } from 'ethers';
import { broadcastMessage } from './xmtp';
import { broadcastPush, createChannel } from './push';
import { fetchIdentities } from './mask';
import { IpfsStorage } from './storage';

// const provider = new providers.JsonRpcProvider('https://sepolia.gateway.tenderly.co/');s
// const key = 'haha';
// const web3storagetoken = 'hehe';

// export function getMenu(): string[] {
//   return ['Companies', 'Portfolio'];
// }

// (async () => {
//   // const wallet = new ethers.Wallet(key, provider);
//   // await broadcastMessage(wallet, 'gm', ['0xb39d2DdeCcb7b91e4Efb26cc380E0b14FEE262a8']);
//   // goerli, to create channel requires PUSH tokens
//   // checkout https://staging.push.org/dashboard -> Create Channel -> Stacking Info links
//   // await createChannel(wallet, 'title', 'description');
//   // await broadcastPush(wallet, 'push title 2', 'push body', [
//   //   '0xb39d2DdeCcb7b91e4Efb26cc380E0b14FEE262a8',
//   // ]);
//   // const identity = await fetchIdentities('0x934b510d4c9103e6a87aef13b816fb080286d649');
//   // console.log(identity?.neighbor[0]);

//   const cid = await storage.store({ test: 123 });
//   console.log(cid);
//   const fetched = await storage.fetch(cid);
//   console.log(fetched);
// })();
