import React, { FunctionComponent, useState } from "react";
import * as SecureStore from "expo-secure-store";

import {
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_STORE } from "../../graphql/Queries";
import { MODIFY_STORE } from "../../graphql/Mutations";

import Loader from "../../assets/animations/Loader";
import PrimaryText from "../../assets/styling/PrimaryText";
import colors from "../../assets/styling/Colors";
import { Ionicons } from "@expo/vector-icons";

import { StoresProps } from "../../typescript/Types";

const Stores: FunctionComponent<StoresProps> = ({ navigation }) => {
  const { loading, error, data, stopPolling } = useQuery(GET_STORE, {
    onError: () => {},
    fetchPolicy: "network-only",
  });

  const [
    modifyStore,
    { loading: validating, data: returnData, error: validationError },
  ] = useMutation(MODIFY_STORE, {
    onError: () => {
      navigation.replace("Login", undefined);
    },
  });

  const _handleLogout = async () => {
    await SecureStore.deleteItemAsync("LOGIN_TOKEN");
    await SecureStore.setItemAsync("IS_LOGGED", "0");
    navigation.replace("Login", undefined);
  };

  const [newUsername, setNewUsername] = useState<string>("");

  if (loading) return <Loader />;

  if (error) {
    return null;
  }

  if (validating) {
    stopPolling();
    return <Loader />;
  }
  if (validationError) {
    Alert.alert("Error", "This username is not available.");
  }

  if (returnData) {
    Alert.alert(
      "Username changed successfully",
      "For security reasons, please log in again with the new credentials.",
      [
        {
          text: "OK",
          onPress: () => _handleLogout(),
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.logout} onPress={() => _handleLogout()}>
          <PrimaryText style={styles.logoutBtnText}>Log out</PrimaryText>
          <Ionicons
            style={styles.logoutIcon}
            name="md-exit"
            size={20}
            color={colors.iconColor}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.userInfoContainer}>
        <Ionicons name="md-basket" size={70} color={colors.iconColor} />
        <TextInput
          defaultValue={data.store.properties.name}
          placeholder={"Name of the store"}
          style={styles.storeName}
          onChangeText={(text) => setNewUsername(text)}
          maxLength={20}
        ></TextInput>
      </View>
      <View style={styles.saveButtonWrapper}>
        {!validating &&
          (newUsername !== "" ? (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                modifyStore({ variables: { newName: newUsername } });
              }}
            >
              <PrimaryText style={styles.saveButtonText}>
                {"SAVE CHANGES \n(LOGIN REQUIRED)"}
              </PrimaryText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.saveButtonDisabled} disabled={true}>
              <PrimaryText style={styles.saveButtonText}>
                {"SAVE CHANGES \n(LOGIN REQUIRED)"}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.iceWhite,
    borderRadius: 5,
    padding: 10,
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
  buttonWrapper: {
    alignItems: "flex-end",
  },
  logoutIcon: {
    marginLeft: 4,
    marginTop: 1,
  },
  storeName: {
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
  logoutBtnText: {},
});

export default Stores;
