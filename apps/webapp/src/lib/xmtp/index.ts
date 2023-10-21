import { Signer } from 'ethers';
import { Client } from '@xmtp/xmtp-js';
import { Address } from 'viem';

export async function broadcastMessage(
  wallet: Signer,
  message: string,
  broadcast: Address[],
): Promise<void> {
  broadcast.forEach(async (addr) => await sendMessage(wallet, message, addr));
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
