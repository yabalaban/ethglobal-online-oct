import { FetchETHIdentity } from './gql';
import { Identity } from './types';

export async function fetchIdentities(address: string): Promise<Identity | null> {
  try {
    const data = await FetchETHIdentity(address);
    return data as Identity;
  } catch (e) {
    console.log(e);
    return {};
  }
}
