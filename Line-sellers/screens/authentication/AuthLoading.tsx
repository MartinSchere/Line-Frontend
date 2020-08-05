import React, { FunctionComponent } from "react";

import { View, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";

import Loader from "../../assets/animations/Loader";
import { AuthLoadingProps } from "../../typescript/Types";

const AuthLoadingScreen: FunctionComponent<AuthLoadingProps> = ({
  navigation,
}) => {
  (async () => {
    const isLogged = await SecureStore.getItemAsync("IS_LOGGED");
    navigation.replace(isLogged === "1" ? "MisTurnos" : "Login", undefined);
  })();

  return (
    <View style={styles.container}>
      <Loader />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AuthLoadingScreen;
