import React, { useState, FunctionComponent, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

import { useMutation } from "@apollo/react-hooks";
import { LOGIN } from "../../graphql/Mutations";

import {
  TextInput,
  View,
  StyleSheet,
  Keyboard,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Shake } from "react-native-motion";

import { Ionicons } from "@expo/vector-icons";
import Logo from "../../assets/Logo";
import { colors } from "../../assets/styling/ConstantStyles";
import PrimaryText from "../../assets/styling/PrimaryText";

import { LoginProps } from "../../typescript/Types";

const Login: FunctionComponent<LoginProps> = ({ route, navigation }) => {
  const [
    login,
    { loading: validating, error: validationError, data: returnData },
  ] = useMutation(LOGIN, {
    onError: () => startAnimation(),
    onCompleted: (data) => {
      (async () => {
        await SecureStore.setItemAsync("LOGIN_TOKEN", data.tokenAuth.token);
        await SecureStore.setItemAsync("IS_LOGGED", "1").then(() =>
          navigation.replace("MisTurnos")
        );
      })();
    },
  });

  const messageText: string = route.params?.message;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [disableLogin, setDisableLogin] = useState(true);
  const [animationValue, setAnimationValue] = useState(0);

  const [keyboardActive, setKeyboardActive] = useState(false);

  const startAnimation = () => {
    setAnimationValue((prevState) => prevState + 1);
  };
  const validateLogin = (): void => {
    if (password.length > 4 && username.length > 1) {
      setDisableLogin(false);
    } else {
      setDisableLogin(true);
    }
  };

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardActive(true);
    });
    Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardActive(false);
    });

    // cleanup function
    return () => {
      Keyboard.removeListener("keyboardDidShow", () => {
        setKeyboardActive(true);
      });
      Keyboard.removeListener("keyboardDidHide", () => {
        setKeyboardActive(false);
      });
    };
  }, []);

  return (
    <ImageBackground
      style={styles.container}
      source={require("../../assets/images/LoginBackground.png")}
    >
      <View
        style={
          keyboardActive
            ? { ...styles.subContainer, flex: 0.8 }
            : styles.subContainer
        }
      >
        <Logo style={styles.logo} />
        <Shake value={animationValue} type="timing" useNativeDriver={true}>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="md-basket"
              size={24}
              style={styles.inputIcon}
              color={colors.lightGray}
            />
            <TextInput
              value={username}
              onChangeText={(username) => {
                setUsername(username);
                validateLogin();
              }}
              placeholder={"Name of the store"}
              style={styles.input}
              maxLength={20}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="md-lock"
              size={24}
              style={styles.inputIcon}
              color={colors.lightGray}
            />
            <TextInput
              value={password}
              onChangeText={(password) => {
                setPassword(password);
                validateLogin();
              }}
              placeholder={"Password"}
              secureTextEntry={true}
              style={styles.input}
              maxLength={20}
            />
          </View>
        </Shake>

        <TouchableOpacity
          style={
            disableLogin || validating ? styles.buttonDisabled : styles.button
          }
          onPress={() => {
            login({
              variables: {
                username,
                password,
              },
            });
          }}
          disabled={disableLogin}
        >
          <PrimaryText style={{ color: "white" }} variant={"bold"}>
            {validating ? "Logging in..." : "LOG IN"}
          </PrimaryText>
        </TouchableOpacity>
        <PrimaryText
          variant={"bold"}
          style={{ color: colors.iconColor, padding: "3%" }}
        >
          or
        </PrimaryText>
        <View style={styles.register}>
          <TouchableOpacity
            style={styles.registerTouchable}
            onPress={() => navigation.navigate("Register")}
          >
            <PrimaryText style={styles.registerLinkUnderlined} variant={"bold"}>
              Create an account
            </PrimaryText>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subContainer: {
    flex: 0.7,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
  },
  logo: {
    width: "100%",
    height: "10%",
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.darkerWhite,
    paddingLeft: 10,
    paddingRight: 10,
    padding: 5,
    margin: 5,
    marginBottom: 10,
    borderRadius: 5,
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderColor: "white",
    backgroundColor: colors.darkerWhite,
  },
  inputIcon: {
    marginLeft: 7,
  },
  subtitle: {
    color: colors.textColor,
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    color: colors.iconColor,
    fontSize: 18,
    margin: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.purple,
    width: 200,
    alignItems: "center",
    marginTop: 10,
    padding: 12.5,
    borderRadius: 25,
  },
  buttonDisabled: {
    backgroundColor: colors.lightGray,
    width: 200,
    alignItems: "center",
    marginTop: 10,
    padding: 12.5,
    borderRadius: 20,
  },
  register: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  registerTouchable: {},
  welcomeMsg: {
    fontWeight: "700",
    color: colors.textColor,
    fontSize: 30,
    margin: 10,
    textAlign: "center",
  },
  registerLink: {
    color: colors.textColor,
    margin: 5,
  },
  registerLinkUnderlined: {
    color: colors.purple,
    textDecorationLine: "underline",
    opacity: 0.8,
  },
  successIcon: {
    marginTop: 10,
    alignSelf: "center",
  },
  errorText: {
    display: "none",
  },
  errorTextActive: {
    display: "flex",
  },
  invalidMsg: {
    color: colors.textColor,
    margin: 10,
    paddingBottom: 10,
  },
});

export default Login;
