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
    const file = this.makeFile(JSON.stringify(object), 'metadata.json');
    const cid = await this.client.put([file]);
    return toHex(cid);
  }

  async fetch(cid: Address): Promise<unknown> {
    let response = await this.client.get(fromHex(cid, 'string'));
    if (response.status == 422) {
      const ccid = fromHex(cid, 'string') as Address;
      response = await this.client.get(fromHex(ccid, 'string'));
    }
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

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkwQWJmNDZmMDBFMjBCRjlENTRlN2IwRWRkQzQwNWVCMDExY0Q5NzEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTc0MDIzNjM4MTUsIm5hbWUiOiJldGhnbG9iYWwtb25saW5lIn0.86uWCIG35v8vk232bE3VLux1TX5pieKO7txY7WJkjDc';
export const ipfsStorage = new IpfsStorage(token);
