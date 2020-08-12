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
} from "react-native";
import * as SecureStore from "expo-secure-store";

import { colors } from "../../assets/styling/ConstantStyles";
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
    onError: () => {},
    onCompleted: () => {
      login({ variables: { username, password } });
    },
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [keyboardActive, setKeyboardActive] = useState(false);

  const [passwordDoesNotMatchError, setpasswordDoesNotMatchError] = useState(
    false
  );
  const [passwordTooShortError, setpasswordTooShortError] = useState(false);
  const [usernameTooShortError, setusernameTooShortError] = useState(false);

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

  const validateData = (username: string, password: string): void => {
    let valid = true;

    if (password !== confirmPassword) {
      setpasswordDoesNotMatchError(true);
      valid = false;
    }
    if (password.length < 8) {
      setpasswordTooShortError(true);
      valid = false;
    }
    if (username.length < 5) {
      setusernameTooShortError(true);
      valid = false;
    }
    if (valid) {
      register({ variables: { username, password } });
      setpasswordDoesNotMatchError(false);
      setpasswordTooShortError(false);
      setusernameTooShortError(false);
      // Reset those, otherwise they'd remain there!
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={
          keyboardActive
            ? { ...styles.subContainer, flex: 0.95 }
            : styles.subContainer
        }
      >
        <PrimaryText
          style={keyboardActive ? { display: "none" } : styles.title}
        >
          Register
        </PrimaryText>
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
            onChangeText={(password) => setPassword(password)}
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
            onChangeText={(text) => setConfirmPassword(text)}
            placeholder={"Confirm your password"}
            secureTextEntry={true}
            style={styles.input}
            maxLength={20}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            validateData(username, password);
          }}
        >
          <PrimaryText>
            {validating || logging ? "REGISTERING..." : "REGISTER"}
          </PrimaryText>
        </TouchableOpacity>
        {validationError && (
          <PrimaryText style={styles.invalidMsg}>
            This username is not available
          </PrimaryText>
        )}
        {passwordDoesNotMatchError && (
          <PrimaryText style={styles.invalidMsg}>
            Passwords don't match
          </PrimaryText>
        )}
        {passwordTooShortError && (
          <PrimaryText style={styles.invalidMsg}>
            Password must have at least 8 characters
          </PrimaryText>
        )}
        {usernameTooShortError && (
          <PrimaryText style={styles.invalidMsg}>
            Username must have at least 6 characters
          </PrimaryText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    marginLeft: 3,
    marginBottom: 1,
  },
  button: {
    backgroundColor: colors.iceWhite,
    padding: 10,
    marginTop: 10,
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
  title: {
    color: colors.textColor,
    fontWeight: "700",
    fontSize: 42,
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
