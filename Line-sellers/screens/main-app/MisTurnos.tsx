import React, { FunctionComponent, useContext } from "react";

import {
  StyleSheet,
  View,
  RefreshControl,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  CANCEL_TURN,
  FULLFILL_TURN,
  USER_DID_NOT_PRESENT,
} from "../../graphql/Mutations";
import { FETCH_UNFULLFILLED_TURNS } from "../../graphql/Queries";

import { Ionicons } from "@expo/vector-icons";
import PrimaryText from "../../assets/styling/PrimaryText";
import colors from "../../assets/styling/Colors";
import Loader from "../../assets/animations/Loader";

import { TurnInterface } from "../../typescript/Interfaces";
import { TurnoProps, TurnosProps } from "../../typescript/Types";

const Turno: FunctionComponent<TurnoProps> = (props) => {
  const [
    cancelTurn,
    { loading: loadingCancel, data: cancelData },
  ] = useMutation(CANCEL_TURN, {
    variables: { turnId: props.turnId },
  });
  const [
    fullfillTurn,
    { loading: loadingFullfill, data: fullfillData },
  ] = useMutation(FULLFILL_TURN, {
    variables: { turnId: props.turnId },
  });
  const [
    userDidNotPresent,
    { loading: loadingUserDidNotPresent, data: userDidNotPresentData },
  ] = useMutation(USER_DID_NOT_PRESENT, {
    variables: { turnId: props.turnId },
  });

  // This could be simplified by creating a mutation "completeTurn" with
  // a parameter "action" that those three mutations. That would be something
  // optional to improve in upcoming releases.

  const pormptCancelTurn = () => {
    Alert.alert("Remove person from the queue?", "", [
      { text: "Sí", onPress: () => cancelTurn() },
      { text: "No" },
    ]);
  };

  if (cancelData || fullfillData || userDidNotPresentData) {
    return null;
  }

  return (
    <View style={styles.turnCard}>
      <View style={styles.cardInfo}>
        <View style={styles.turnInfo}>
          <PrimaryText style={{ fontSize: 24 }}>
            {props.userFullName}
          </PrimaryText>
          <PrimaryText>Created at {props.creationTime.slice(0, 5)}</PrimaryText>
        </View>
        {!loadingCancel && !loadingFullfill && !loadingUserDidNotPresent && (
          <View style={styles.turnOptions}>
            <TouchableOpacity
              onPress={pormptCancelTurn}
              style={styles.iconHolder}
            >
              <Ionicons
                name="md-remove-circle"
                size={40}
                color={colors.warning}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => fullfillTurn()}
              style={styles.iconHolder}
            >
              <Ionicons
                name="md-checkmark"
                size={40}
                color={colors.successColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => userDidNotPresent()}
              style={styles.iconHolder}
            >
              <Ionicons name="md-help" size={40} color={colors.yellow} />
            </TouchableOpacity>
          </View>
        )}
        {(loadingCancel || loadingFullfill || loadingUserDidNotPresent) && (
          <ActivityIndicator
            size={40}
            color={colors.primary}
            style={styles.turnCancelLoader}
          />
        )}
      </View>
    </View>
  );
};

const Turnos: FunctionComponent<TurnosProps> = ({ navigation }) => {
  const { loading, error, data, refetch } = useQuery(FETCH_UNFULLFILLED_TURNS, {
    onError: () => {
      navigation.replace("Login");
    },
    pollInterval: 3000,
  });

  if (loading) return <Loader />;

  if (error) {
    Alert.alert("Error", "Please check your internet connection");
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.turnList}
        contentContainerStyle={{ flexGrow: 1 }}
        data={data.storeTurns}
        renderItem={({ item }: { item: TurnInterface }) => (
          <Turno
            turnId={item.id}
            userFullName={item.user.fullName}
            creationTime={item.creationTime}
          />
        )}
        keyExtractor={(turn: TurnInterface) => turn.id}
        ListEmptyComponent={
          <View style={styles.listEmptyContainer}>
            <PrimaryText
              style={{
                fontSize: 30,
                fontWeight: "700",
                color: colors.textColor,
              }}
            >
              There's nobody in the queue
            </PrimaryText>
            <PrimaryText
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: colors.iconColor,
              }}
            >
              swipe down to refresh
            </PrimaryText>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              try {
                refetch();
              } catch (error) {
                Alert.alert("Error", "Please check your internet connection.");
              }
            }}
          ></RefreshControl>
        }
      ></FlatList>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("TurnHistory")}
        >
          <PrimaryText style={{ color: colors.iceWhite }}>
            See user history
          </PrimaryText>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  turnList: {
    width: "100%",
    alignSelf: "center",
    padding: 5,
  },
  turnCard: {
    margin: 5,
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.iceWhite,
    width: "97%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  turnOptions: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    flex: 4,
  },
  turnInfo: {
    flex: 3,
    marginBottom: 5,
  },
  buttonWrapper: {
    position: "absolute",
    bottom: "7%",
    alignItems: "center",
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.lightBlue,
    borderRadius: 5,
    padding: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  cardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    borderLeftWidth: 1.5,
    borderLeftColor: colors.lightGray,
  },
  title: {
    fontSize: 16,
  },
  iconHolder: {
    paddingRight: 10,
  },
  turnCancelLoader: {
    marginRight: 2.5,
  },
});

export default Turnos;
