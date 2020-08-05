import React, { useState, useEffect, FunctionComponent } from "react";
import * as SecureStore from "expo-secure-store";
import { TouchableOpacity } from "react-native-gesture-handler";
import { StackNavigationProp } from "@react-navigation/stack";

import { useMutation } from "@apollo/react-hooks";
import { LOGIN } from "../../graphql/Mutations";

import {
  Animated,
  TextInput,
  View,
  StyleSheet,
  AsyncStorage,
  Keyboard,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import colors from "../../assets/styling/colors";
import PrimaryText from "../../assets/styling/PrimaryText";
import Logo from "../../assets/Logo";

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
  ] = useMutation(LOGIN, { onError: () => {} });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [keyboardActive, setKeyboardActive] = useState(false);

  const [frontendValidationError, setfrontendValidationError] = useState(false);

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

  const validateLogin = (username: string, password: string): void => {
    if (password.length < 5) {
      setfrontendValidationError(true);
    } else {
      login({
        variables: {
          username,
          password,
        },
      });
    }
  };

  if (returnData) {
    (async () => {
      await SecureStore.setItemAsync("LOGIN_TOKEN", returnData.tokenAuth.token);
      await SecureStore.setItemAsync("IS_LOGGED", "1");
      await AsyncStorage.setItem(
        "USER_ID",
        returnData.tokenAuth.user.id
      ).then(() => navigation.replace("MisTurnos"));
    })();
  }

  return (
    <View style={styles.container}>
      <View
        style={
          keyboardActive
            ? { ...styles.subContainer, flex: 0.9 }
            : styles.subContainer
        }
      >
        {route.params?.message && !keyboardActive && (
          <FadeInView style={styles.notification}>
            <Ionicons
              name="md-checkbox"
              size={45}
              style={styles.successIcon}
              color={colors.successColor}
            />
            <PrimaryText style={styles.message}>
              {route.params?.message}
            </PrimaryText>
          </FadeInView>
        )}
        {!route.params?.message && <Logo style={styles.logo} />}
        <View style={styles.inputWrapper}>
          <Ionicons
            name="md-person"
            size={24}
            style={styles.inputIcon}
            color={colors.lightGray}
          />
          <TextInput
            value={username}
            onChangeText={(username) => setUsername(username)}
            autoCompleteType={"username"}
            placeholder={"Username"}
            maxLength={20}
            style={styles.input}
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
            maxLength={20}
            autoCompleteType={"password"}
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => validateLogin(username, password)}
        >
          <PrimaryText>{validating ? "Logging in..." : "LOGIN"}</PrimaryText>
        </TouchableOpacity>
        <View style={styles.register}>
          <PrimaryText style={styles.registerLink}>
            Don't have an account?
          </PrimaryText>
          <TouchableOpacity
            style={styles.registerTouchable}
            onPress={() => navigation.navigate("Register")}
          >
            <PrimaryText style={styles.registerLinkUnderlined}>
              Sign up
            </PrimaryText>
          </TouchableOpacity>
        </View>
        <View
          style={
            validationError || frontendValidationError
              ? styles.errorTextActive
              : styles.errorText
          }
        >
          <PrimaryText style={styles.invalidMsg}>
            Please enter valid credentials
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
    height: "30%",
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
    borderColor: colors.iceWhite,
    backgroundColor: colors.iceWhite,
    borderRadius: 10,
  },
  inputIcon: {
    marginLeft: 7,
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
    flexDirection: "row",
    alignItems: "center",
  },
  registerTouchable: {},
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
  welcomeMsg: {
    fontWeight: "700",
    color: colors.textColor,
    fontSize: 30,
    margin: 10,
    textAlign: "center",
  },
  message: {
    color: colors.iconColor,
    fontSize: 18,
    margin: 10,
    textAlign: "center",
  },
  invalidMsg: {
    color: colors.textColor,
    margin: 10,
  },
  registerLink: {
    marginTop: 10,
    color: colors.textColor,
    margin: 5,
  },
  registerLinkUnderlined: {
    color: colors.purple,
    fontWeight: "700",
    textDecorationLine: "underline",
    marginTop: 7,
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
});

export default Login;
