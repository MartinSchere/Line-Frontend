import React, { useState, FunctionComponent, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

import { useMutation } from "@apollo/react-hooks";
import { LOGIN } from "../../graphql/Mutations";

import { Animated, TextInput, View, StyleSheet, Keyboard } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Ionicons } from "@expo/vector-icons";
import Logo from "../../assets/Logo";
import colors from "../../assets/styling/Colors";
import PrimaryText from "../../assets/styling/PrimaryText";

import { FadeInViewProps, LoginProps } from "../../typescript/Types";
const FadeInView: FunctionComponent<FadeInViewProps> = ({
  children,
  style,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();
  }, []);

  const passedStyles = Array.isArray(style)
    ? Object.assign({}, ...style)
    : style;

  return (
    <Animated.View // Special animatable View
      style={[
        {
          ...passedStyles,
        },
        {
          opacity: fadeAnim, // Bind opacity to animated value
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const Login: FunctionComponent<LoginProps> = ({ route, navigation }) => {
  const [
    login,
    { loading: validating, error: validationError, data: returnData },
  ] = useMutation(LOGIN, {
    onError: () => {},
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

  const [errorAlert, setErrorAlert] = useState(false);

  const [keyboardActive, setKeyboardActive] = useState(false);

  const handleLogin = (username: string, password: string): void => {
    if (password.length < 4) {
      setErrorAlert(true);
    } else {
      login({ variables: { username: username, password: password } });
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
    <View style={styles.container}>
      <View
        style={
          keyboardActive
            ? { ...styles.subContainer, flex: 0.9 }
            : styles.subContainer
        }
      >
        {messageText && !keyboardActive && (
          <FadeInView style={styles.notification}>
            <Ionicons
              name="md-checkbox"
              size={45}
              style={styles.successIcon}
              color={colors.successColor}
            />
            <PrimaryText style={styles.message}>{messageText}</PrimaryText>
          </FadeInView>
        )}
        {!messageText && (
          <>
            <Logo style={styles.logo} />
            <PrimaryText style={styles.subtitle}>for sellers</PrimaryText>
          </>
        )}
        <View style={styles.inputWrapper}>
          <Ionicons
            name="md-basket"
            size={24}
            style={styles.inputIcon}
            color={colors.lightGray}
          />
          <TextInput
            value={username}
            onChangeText={(username) => setUsername(username)}
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
            onChangeText={(password) => setPassword(password)}
            placeholder={"Password"}
            secureTextEntry={true}
            style={styles.input}
            maxLength={20}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLogin(username, password)}
        >
          <PrimaryText>{validating ? "LOGGING IN..." : "LOGIN"}</PrimaryText>
        </TouchableOpacity>
        <View style={styles.register}>
          <PrimaryText style={styles.registerLinkHelper}>
            Don't have an account?
          </PrimaryText>
          <TouchableOpacity
            style={styles.registerTouchable}
            onPress={() => navigation.navigate("Register")}
          >
            <PrimaryText style={styles.registerLink}>Sign up</PrimaryText>
          </TouchableOpacity>
        </View>
        <View
          style={
            validationError || errorAlert
              ? styles.errorTextActive
              : styles.errorText
          }
        >
          <PrimaryText style={styles.invalidMsg}>
            Invalid credentials
          </PrimaryText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.purple,
  },
  subContainer: {
    flex: 0.7,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: colors.iceWhite,
    borderColor: colors.purple,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  logo: {
    width: "30%",
    height: "15%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.iceWhite,
    paddingLeft: 10,
    paddingRight: 10,
    padding: 5,
    margin: 5,
    marginBottom: 10,
    shadowColor: "#000",
    borderRadius: 25,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.iceWhite,
    backgroundColor: colors.iceWhite,
  },
  inputIcon: {
    marginLeft: 3,
    marginBottom: 1,
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
    backgroundColor: colors.iceWhite,
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  register: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  registerTouchable: {},
  registerLink: {
    color: colors.purple,
    textDecorationLine: "underline",
    textAlign: "center",
    fontWeight: "700",
  },
  registerLinkHelper: {
    color: colors.textColor,
    marginRight: 5,
  },
  notification: {
    marginBottom: 15,
    width: "60%",
    backgroundColor: colors.iceWhite,
    padding: 3,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
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
