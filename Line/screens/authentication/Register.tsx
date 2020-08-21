import React, { useState, FunctionComponent, useEffect } from "react";

import { useMutation } from "@apollo/react-hooks";
import { REGISTER, LOGIN } from "../../graphql/Mutations";

import { TouchableOpacity } from "react-native-gesture-handler";
import {
  TextInput,
  View,
  StyleSheet,
  Keyboard,
  AsyncStorage,
  ImageBackground,
} from "react-native";
import * as SecureStore from "expo-secure-store";

import { Shake } from "react-native-motion";
import { colors, shadows } from "../../assets/styling/ConstantStyles";
import PrimaryText from "../../assets/styling/PrimaryText";
import { Ionicons } from "@expo/vector-icons";

import { RegisterProps } from "../../typescript/Types";

const Register: FunctionComponent<RegisterProps> = ({ navigation }) => {
  const [login, { loading: logging, data: loggedData }] = useMutation(LOGIN, {
    onError: () => {},
    onCompleted: (data) => {
      (async () => {
        await SecureStore.setItemAsync("LOGIN_TOKEN", data.tokenAuth.token);
        await SecureStore.setItemAsync("IS_LOGGED", "1");
        await AsyncStorage.setItem("USER_ID", data.tokenAuth.user.id).then(() =>
          navigation.replace("MisTurnos")
        );
      })();
    },
  });
  const [
    register,
    { loading: validating, error: validationError, data: returnData },
  ] = useMutation(REGISTER, {
    onError: () => startAnimation(),
    onCompleted: () => {
      login({ variables: { username, password } });
    },
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [keyboardActive, setKeyboardActive] = useState(false);

  const [disableLogin, setDisableLogin] = useState(true);
  const [animationValue, setAnimationValue] = useState(0);

  // Could've defined a single useState() called "error", but then it wouldn't
  // be possible to stack these messages together.

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

  const validateData = (): void => {
    if (username.length < 5 || password.length < 8) {
      setDisableLogin(true);
    } else {
      setDisableLogin(false);
    }
  };

  const startAnimation = () => {
    setAnimationValue((prevState) => prevState + 1);
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../../assets/images/LoginBackground2.png")}
    >
      <View
        style={
          keyboardActive
            ? { ...styles.subContainer, flex: 0.9 }
            : styles.subContainer
        }
      >
        <PrimaryText style={styles.title} variant={"bold"}>
          Register
        </PrimaryText>
        <Shake value={animationValue} type="timing" useNativeDriver={true}>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="md-person"
              size={24}
              style={styles.inputIcon}
              color={colors.lightGray}
            />
            <TextInput
              value={username}
              onChangeText={(username) => {
                setUsername(username);
                validateData();
              }}
              placeholder={"Create a user"}
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
                validateData();
                console.log(disableLogin);
                password === confirmPassword && disableLogin
                  ? setDisableLogin(false)
                  : setDisableLogin(true);
              }}
              placeholder={"Set your password"}
              secureTextEntry={true}
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
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                text === password && disableLogin
                  ? setDisableLogin(false)
                  : setDisableLogin(true);
              }}
              placeholder={"Confirm your password"}
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
          disabled={disableLogin || validating}
          onPress={() => {
            register({ variables: { username, password } });
          }}
        >
          <PrimaryText
            style={{ color: "white", letterSpacing: 1.2 }}
            variant={"bold"}
          >
            {validating || logging ? "REGISTERING..." : "REGISTER"}
          </PrimaryText>
        </TouchableOpacity>
        {validationError && (
          <PrimaryText style={styles.invalidMsg}>
            This username is not available
          </PrimaryText>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  subContainer: {
    flex: 0.7,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    ...shadows.lightShadow,
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
    marginLeft: 3,
    marginBottom: 1,
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
  title: {
    color: colors.purple,
    fontSize: 38,
    marginBottom: 10,
    textAlign: "center",
  },
  invalidMsg: {
    color: colors.textColor,
    textAlign: "center",
    margin: "2.5%",
  },
});

export default Register;
