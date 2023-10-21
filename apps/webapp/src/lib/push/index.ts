import { Wallet } from 'ethers';
import { PushAPI } from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { Address } from 'viem';

export async function sendPush(signer: Wallet, title: string, message: string): Promise<void> {
  const user = await PushAPI.initialize(signer, { env: ENV.STAGING });
  const response = await user.channel.send(['*'], {
    notification: {
      title: title,
      body: message,
    },
  });
  console.log('[push]', response);
}

export async function subscribeToChannel(signer: Wallet, channel: Address) {
  const user = await PushAPI.initialize(signer, { env: ENV.STAGING });
  const response = await user.notification.subscribe(`eip155:5:${channel}`, {
    settings: [],
  });
  console.log('[push]', response);
}
