import { providers, ethers } from 'ethers';
import { broadcastMessage } from './xmtp';
import { broadcastPush, createChannel } from './push';

const provider = new providers.JsonRpcProvider('https://sepolia.gateway.tenderly.co/');
const key = 'haha';

(async () => {
  const wallet = new ethers.Wallet(key, provider);
  await broadcastMessage(wallet, 'gm', ['0xb39d2DdeCcb7b91e4Efb26cc380E0b14FEE262a8']);

  // goerli, to create channel requires PUSH tokens
  // checkout https://staging.push.org/dashboard -> Create Channel -> Stacking Info links
  await createChannel(wallet, 'title', 'description');
  await broadcastPush(wallet, 'push title 2', 'push body', [
    '0xb39d2DdeCcb7b91e4Efb26cc380E0b14FEE262a8',
  ]);
})();
