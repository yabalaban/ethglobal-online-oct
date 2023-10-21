import { Signer } from 'ethers';
import { Client } from '@xmtp/xmtp-js';
import { Address } from 'viem';

export async function broadcastMessage(
  wallet: Signer,
  message: string,
  broadcast: Address[],
): Promise<void> {
  const xmtp = await Client.create(wallet, { env: 'dev' });
  console.log('Broadcasting from:', xmtp.address);
  const broadcasts_canMessage = await xmtp.canMessage(broadcast);

  for (let i = 0; i < broadcast.length; i++) {
    const wallet = broadcast[i];
    if (broadcasts_canMessage[i]) {
      const conversation = await xmtp.conversations.newConversation(wallet);
      await conversation.send(message);
    }
  }
}

export async function sendMessage(
  wallet: Signer,
  message: string,
  recipient: Address,
): Promise<void> {
  const xmtp = await Client.create(wallet, { env: 'production' });
  const canMessage = await xmtp.canMessage(recipient);
  if (canMessage) {
    const conversation = await xmtp.conversations.newConversation(recipient);
    await conversation.send(message);
  }
}
