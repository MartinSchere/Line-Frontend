import React, { useEffect, FunctionComponent } from "react";

import { useMutation } from "@apollo/react-hooks";
import { REGISTER, LOGIN } from "../../graphql/Mutations";

import Loader from "../../assets/animations/Loader";

import { AuthRegisterStoreProps } from "../../typescript/Types";
import * as SecureStore from "expo-secure-store";

const AuthRegisterStore: FunctionComponent<AuthRegisterStoreProps> = ({
  navigation,
  route,
}) => {
  const [
    register,
    { loading: validating, error: validationError, data: returnData },
  ] = useMutation(REGISTER, {
    onError: () => {},
    onCompleted: () => {
      login({
        variables: {
          username: route.params.username,
          password: route.params.password,
        },
      });
    },
  });

  const [login, { loading: logging }] = useMutation(LOGIN, {
    onError: () => {},
    onCompleted: (data) => {
      (async () => {
        await SecureStore.setItemAsync("LOGIN_TOKEN", data.tokenAuth.token);
        await SecureStore.setItemAsync("IS_LOGGED", "1").then(() =>
          navigation.replace("MisTurnos", undefined)
        );
      })();
    },
  });

  const handleRegistration = () => {
    const variables = {
      username: route.params.username,
      password: route.params.password,
      latitude: route.params.latitude,
      longitude: route.params.longitude,
      openingTime: route.params.openingTime,
      closingTime: route.params.closingTime,
      openingDays: route.params.days,
    };
    console.log("====================================");
    console.log(variables);
    console.log("====================================");

    register({
      variables,
    });
  };

  useEffect(() => {
    handleRegistration();
  }, []);

  if (validating || logging) {
    return <Loader />;
  }

  if (validationError) {
    navigation.replace("Register", {
      message: "The name of the store is not available",
    });
  }

  return null;
};

export default AuthRegisterStore;
