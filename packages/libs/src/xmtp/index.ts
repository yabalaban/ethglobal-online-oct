import { Signer } from 'ethers';
import { Client } from '@xmtp/xmtp-js';

export async function broadcastMessage(
  wallet: Signer,
  message: string,
  broadcast: string[],
): Promise<void> {
  const xmtp = await Client.create(wallet, { env: 'dev' });
  console.log('Broadcasting from:', xmtp.address);
  const broadcasts_canMessage = await xmtp.canMessage(broadcast);

  for (let i = 0; i < broadcast.length; i++) {
    const wallet = broadcast[i];
    const canMessage = broadcasts_canMessage[i];
    console.log(wallet, canMessage);
    if (broadcasts_canMessage[i]) {
      const conversation = await xmtp.conversations.newConversation(wallet);
      await conversation.send(message);
    }
  }
}
