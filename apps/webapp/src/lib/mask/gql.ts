import { gql } from '@/__generated__/gql';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  // staging URL for next.id
  uri: 'https://relation-service.nextnext.id',
  cache: new InMemoryCache(),
});

const FETCH_IDENTITIES = gql(`
query findOneIdentity($identity: String!) {
  identity(platform: "ethereum", identity: $identity) {  
    uuid
    platform
    identity
    displayName
    profileUrl
    avatarUrl
    createdAt
    updatedAt
    neighbor(depth: 5) {
      sources
      identity {
        uuid
        platform
        identity
        displayName
      }
    }
  }
}`);

export async function FetchETHIdentity(address: string): Promise<any> {
  const response = await client.query({
    query: FETCH_IDENTITIES,
    variables: { identity: address },
  });
  return response.data.identity;
}
