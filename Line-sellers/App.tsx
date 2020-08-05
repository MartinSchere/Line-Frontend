import React, { useState } from "react";
import { AppRegistry } from "react-native";

import * as SecureStore from "expo-secure-store";

import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";

import RootStackNavigator from "./Navigator";

const httpLink = createHttpLink({
  uri: "http://192.168.0.23:8000/graphql/",
});

export default function App() {
  const [token, setToken] = useState("");

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const getToken = async () => {
      await SecureStore.getItemAsync("LOGIN_TOKEN").then((data) => {
        if (data !== null) {
          setToken(data);
        }
      });
    };
    getToken();
    console.log(token);

    return {
      headers: {
        ...headers,
        authorization: `JWT ${token}`,
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  return (
    <ApolloProvider client={client}>
      <RootStackNavigator />
    </ApolloProvider>
  );
}
