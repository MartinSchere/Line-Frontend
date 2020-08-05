import React, { useState, FunctionComponent, useEffect } from "react";

import { TextInput, View, StyleSheet, Keyboard } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Ionicons } from "@expo/vector-icons";
import PrimaryText from "../../assets/styling/PrimaryText";
import colors from "../../assets/styling/Colors";

import { RegisterProps } from "../../typescript/Types";

const Register: FunctionComponent<RegisterProps> = ({ route, navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordDoesNotMatchError, setpasswordDoesNotMatchError] = useState(
    false
  );
  const [passwordTooShortError, setpasswordTooShortError] = useState(false);

  const [keyboardActive, setKeyboardActive] = useState(false);

  const validateData = () => {
    if (password !== confirmPassword) {
      setpasswordDoesNotMatchError(true);
    } else if (password.length < 8) {
      setpasswordTooShortError(true);
    } else {
      navigation.navigate("MapSelectLocation", {
        username,
        password,
      });
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
        <PrimaryText
          style={
            keyboardActive ? { ...styles.title, display: "none" } : styles.title
          }
        >
          Register your store
        </PrimaryText>
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
            placeholder={"Create a password"}
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
            onChangeText={(confirmPassword) =>
              setConfirmPassword(confirmPassword)
            }
            placeholder={"Confirm the password"}
            secureTextEntry={true}
            style={styles.input}
            maxLength={20}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => validateData()}>
          <PrimaryText>NEXT</PrimaryText>
        </TouchableOpacity>
        {route.params?.message && (
          <PrimaryText style={styles.message}>
            {route.params?.message}
          </PrimaryText>
        )}
        {passwordDoesNotMatchError && (
          <PrimaryText style={styles.errorMsg}>
            Passwords don't match
          </PrimaryText>
        )}
        {passwordTooShortError && (
          <PrimaryText style={styles.errorMsg}>
            Password must have at least 8 characters
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
  title: {
    color: colors.purple,
    fontSize: 32,
    marginBottom: 7,
    textAlign: "center",
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderColor: colors.iceWhite,
    backgroundColor: colors.iceWhite,
  },
  inputIcon: {
    marginLeft: 3,
    marginBottom: 1,
  },
  button: {
    backgroundColor: colors.iceWhite,
    marginTop: 10,
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
  message: {
    color: colors.textColor,
    padding: 15,
  },
  errorMsg: {
    color: colors.textColor,
    margin: 5,
  },
});
export default Register;
