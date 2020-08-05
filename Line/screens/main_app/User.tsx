import React, { FunctionComponent, useState, useContext } from "react";
import { PollingOptions } from "../../context/PollingOptions";

import * as SecureStore from "expo-secure-store";
import { StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
import { TouchableOpacity, TextInput } from "react-native-gesture-handler";

import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import { GET_USER } from "../../graphql/Queries";
import { MODIFY_USER } from "../../graphql/Mutations";

import Loader from "../../assets/animations/Loader";
import PrimaryText from "../../assets/styling/PrimaryText";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../assets/styling/colors";

import { UserProps } from "../../typescript/Types";

const User: FunctionComponent<UserProps> = ({ navigation }) => {
  const { setPollingOptions } = useContext(PollingOptions);
  const { client, loading, data } = useQuery(GET_USER);
  const [modifyUser, { loading: validating }] = useMutation(MODIFY_USER, {
    onError: () => {
      Alert.alert("Error", "This username is not available.");
    },
    onCompleted: () => {
      setPollingOptions({ shouldPoll: false });
      Alert.alert(
        "Username changed successfully",
        "For security reasons, please log in again with the new credentials.",
        [
          {
            text: "OK",
            onPress: () => _handleLogout().then(() => client.clearStore()),
          },
        ]
      );
    },
  });

  const [newUsername, setNewUsername] = useState("");

  const _handleLogout = async () => {
    await SecureStore.setItemAsync("IS_LOGGED", "0");
    await SecureStore.deleteItemAsync("LOGIN_TOKEN");
    navigation.replace("Login", undefined);
  };

  if (loading || validating) return <Loader />;

  if (data) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.logout}
          onPress={() => _handleLogout().then(() => client.clearStore())}
        >
          <PrimaryText style={styles.exitBtn}>Log out</PrimaryText>
          <Ionicons
            style={styles.logoutIcon}
            name="md-exit"
            size={20}
            color={colors.iconColor}
          />
        </TouchableOpacity>
        <View style={styles.userInfoContainer}>
          <Ionicons name="md-person" size={70} color={colors.iconColor} />
          <TextInput
            defaultValue={data.user.fullName}
            placeholder={"Username"}
            style={styles.userName}
            onChangeText={(text) => setNewUsername(text)}
            maxLength={20}
          ></TextInput>
        </View>
        <View style={styles.saveButtonWrapper}>
          {!validating &&
            (newUsername !== "" ? (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() =>
                  modifyUser({ variables: { newName: newUsername } })
                }
              >
                <PrimaryText style={styles.saveButtonText}>
                  SAVE CHANGES
                </PrimaryText>
                <PrimaryText style={styles.saveButtonText}>
                  (LOGIN REQUIRED)
                </PrimaryText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.saveButtonDisabled}
                disabled={true}
              >
                <PrimaryText style={styles.saveButtonTextDisabled}>
                  SAVE CHANGES
                </PrimaryText>
                <PrimaryText style={styles.saveButtonTextDisabled}>
                  (LOGIN REQUIRED)
                </PrimaryText>
              </TouchableOpacity>
            ))}
          {validating && (
            <TouchableOpacity style={styles.saveButtonDisabled} disabled={true}>
              <ActivityIndicator size={30} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
  return <Loader />;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.iceWhite,
    borderRadius: 5,
    padding: 5,
    alignSelf: "flex-end",
    marginTop: 15,
    marginRight: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfoContainer: {
    alignSelf: "center",
    alignItems: "center",
  },
  userName: {
    color: colors.textColor,
    padding: 5,
    backgroundColor: colors.iceWhite,
    borderRadius: 10,
    fontSize: 30,
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonWrapper: {
    position: "absolute",
    bottom: "7.5%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: colors.lightBlue,
    borderRadius: 5,
    padding: 7.5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: colors.lightGray,
    borderRadius: 5,
    padding: 7.5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    textAlign: "center",
    color: colors.iceWhite,
  },
  saveButtonTextDisabled: {
    textAlign: "center",
    color: colors.iceWhite,
  },
  logoutIcon: {
    marginLeft: 4,
    marginTop: 5,
  },
  username: {
    fontSize: 30,
  },
  exitBtn: {
    margin: 5,
  },
});

export default User;
