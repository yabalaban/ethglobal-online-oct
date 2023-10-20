import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // staging URL for next.id
  schema: 'https://relation-service.nextnext.id',
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
