import React, { useState, FunctionComponent, useEffect } from "react";

import {
  TextInput,
  View,
  StyleSheet,
  Keyboard,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Ionicons } from "@expo/vector-icons";
import PrimaryText from "../../assets/styling/PrimaryText";
import { colors, shadows } from "../../assets/styling/ConstantStyles";

import { RegisterProps } from "../../typescript/Types";

const Register: FunctionComponent<RegisterProps> = ({ route, navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [disableRegister, setDisableRegister] = useState(true);

  const [keyboardActive, setKeyboardActive] = useState(false);

  const validateData = (): void => {
    if (username.length < 5 || password.length < 8) {
      setDisableRegister(true);
    } else {
      setDisableRegister(false);
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
      source={require("../../assets/images/LoginBackground2.png")}
    >
      <View
        style={
          keyboardActive
            ? { ...styles.subContainer, flex: 0.9 }
            : styles.subContainer
        }
      >
        <PrimaryText
          style={
            keyboardActive
              ? { ...styles.title, fontSize: 34, maxWidth: "90%" }
              : styles.title
          }
          variant={"bold"}
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
            onChangeText={(username) => {
              setUsername(username);
              validateData();
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
              validateData();
              password === confirmPassword
                ? setDisableRegister(false)
                : setDisableRegister(true);
            }}
            placeholder={"Password"}
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
              text === password
                ? setDisableRegister(false)
                : setDisableRegister(true);
            }}
            placeholder={"Confirm password"}
            secureTextEntry={true}
            style={styles.input}
            maxLength={20}
          />
        </View>
        <TouchableOpacity
          disabled={disableRegister}
          style={disableRegister ? styles.buttonDisabled : styles.button}
          onPress={() =>
            navigation.navigate("MapSelectLocation", {
              username,
              password,
            })
          }
        >
          <PrimaryText
            style={{ color: "white", letterSpacing: 1.2 }}
            variant={"bold"}
          >
            NEXT
          </PrimaryText>
        </TouchableOpacity>
        {route.params?.message && (
          <PrimaryText style={styles.message} variant={"bold"}>
            {route.params?.message}
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

  message: {
    color: colors.warning,
    textAlign: "center",
    margin: "2.5%",
    paddingTop: 15,
  },
});
export default Register;
