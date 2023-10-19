import { Address } from 'viem';
import { fromHex, toHex } from 'viem/utils';
import { File } from '@web-std/file';
import { Web3Storage } from 'web3.storage';

export class IpfsStorage {
  private client: Web3Storage;

  constructor(token: string) {
    this.client = new Web3Storage({ token });
  }

  async store(object: unknown): Promise<Address> {
    const file = this.makeFile(JSON.stringify(object), 'promise.json');
    const cid = await this.client.put([file]);
    return toHex(cid);
  }

  async fetch(cid: Address): Promise<any> {
    const response = await this.client.get(fromHex(cid, 'string'));
    if (!response) {
      throw new Error(`${cid}: empty response`);
    }
    const files = await response.files();
    const buffer = await files[0].arrayBuffer();
    const data = Buffer.from(buffer).toString('utf-8');
    return JSON.parse(data);
  }

  private makeFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'application/json' });
    return new File([blob], filename);
  }
}

const token = 'haha';
export const ipfsStorage = new IpfsStorage(token);
