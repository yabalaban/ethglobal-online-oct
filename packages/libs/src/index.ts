import { JsonRpcProvider, ethers } from 'ethers';
import { broadcastMessage } from './xmtp';

const provider = new JsonRpcProvider('https://sepolia.gateway.tenderly.co/');
const key = 'haha';

(async () => {
  const wallet = new ethers.Wallet(key, provider);
  await broadcastMessage(wallet, 'gm', ['0xb39d2DdeCcb7b91e4Efb26cc380E0b14FEE262a8']);
})();
