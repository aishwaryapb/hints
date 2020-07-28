import React from 'react';
import { split, HttpLink, ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import App from './components/App';


const httpLink = new HttpLink({
  uri: process.env.GRAPHQL_SERVER_ENDPOINT
});

const wsLink = new WebSocketLink({
  uri: process.env.GRAPHQL_WS_ENDPOINT || "",
  options: {
    reconnect: true
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
});

export default () => (
  <ApolloProvider client={client}>
      <App />
  </ApolloProvider>
)

