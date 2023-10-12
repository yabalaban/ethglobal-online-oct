import { Wallet } from 'ethers';
import { PushAPI } from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';

export async function broadcastPush(
  signer: Wallet,
  title: string,
  body: string,
  broadcast: string[],
): Promise<void> {
  const user = await PushAPI.initialize(signer, { env: ENV.STAGING });
  await user.channel.send(broadcast, {
    notification: {
      title: title,
      body: body,
    },
  });
}

export async function createChannel(
  signer: Wallet,
  name: string,
  description: string,
): Promise<void> {
  const user = await PushAPI.initialize(signer, { env: ENV.STAGING });
  await user.channel.create({
    name: name,
    description: description,
    // TODO: change details to project specific
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAz0lEQVR4AcXBsU0EQQyG0e+saWJ7oACiKYDMEZVs6GgSpC2BIhzRwAS0sgk9HKn3gpFOAv3v3V4/3+4U4Z1q5KTy42Ql940qvFONnFSGmCFmiN2+fj7uCBlihpgh1ngwcvKfwjuVIWaIGWKNB+GdauSk8uNkJfeNKryzYogZYoZY40m5b/wlQ8wQM8TayMlKeKcaOVkJ71QjJyuGmCFmiDUe+HFy4VyEd57hx0mV+0ZliBlihlgL71w4FyMnVXhnZeSkiu93qheuDDFDzBD7BcCyMAOfy204AAAAAElFTkSuQmCC',
    url: 'https://push.org',
  });
}
