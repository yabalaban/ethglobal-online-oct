import { Address } from 'viem';

export function etherscanLink(address: Address): string {
  return 'https://etherscan.io/address/' + address;
}
