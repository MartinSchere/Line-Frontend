import React, {
  useEffect,
  useState,
  FunctionComponent,
  useContext,
} from "react";

import { PollingOptions } from "../../context/PollingOptions";

import {
  View,
  Alert,
  StyleSheet,
  RefreshControl,
  AsyncStorage,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as Permissions from "expo-permissions";
import { Notifications } from "expo";

import { FlatList } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_TURNS } from "../../graphql/Queries";
import { CANCEL_TURN } from "../../graphql/Mutations";

import Loader from "../../assets/animations/Loader";
import PrimaryText from "../../assets/styling/PrimaryText";
import colors from "../../assets/styling/colors";

import { TurnInterface } from "../../typescript/Interfaces";
import { TurnoProps } from "../../typescript/Types";

const Turno: FunctionComponent<TurnoProps> = (props) => {
  const [
    cancelTurn,
    { loading: validating, error: validationError, data: returnData },
  ] = useMutation(CANCEL_TURN, {
    variables: { turnId: props.turnId },
    onError: () => {
      Alert.alert("Error", "Please verify your internet connection.");
    },
  });

  const pormptCancelTurn = () => {
    Alert.alert("Are you sure you want to leave the queue?", "", [
      { text: "No" },
      { text: "Yes", onPress: () => cancelTurn() },
    ]);
  };

  if (validationError) {
    return null;
  }

  if (!returnData) {
    return (
      <View style={styles.turnCard}>
        {!validating && (
          <TouchableOpacity
            onPress={pormptCancelTurn}
            style={styles.iconHolder}
          >
            <Ionicons
              style={styles.crossIcon}
              name="md-remove-circle"
              size={40}
              color={colors.warning}
            />
          </TouchableOpacity>
        )}
        {validating && (
          <ActivityIndicator
            size={40}
            color={colors.lightBlue}
            style={styles.turnCancelLoader}
          />
        )}
        <View style={styles.cardInfo}>
          <PrimaryText style={styles.title}>{props.title}</PrimaryText>
          {props.queueLength > 0 ? (
            <View>
              <PrimaryText style={styles.bigText}>
                {props.queueLength}
              </PrimaryText>
              <PrimaryText style={styles.counterIndicator}>
                {props.queueLength == 1
                  ? "Person ahead of you"
                  : "People ahead of you"}
              </PrimaryText>
            </View>
          ) : (
            <PrimaryText style={styles.bigText}>It's your turn</PrimaryText>
          )}
        </View>
      </View>
    );
  }
  return null;
};

const Turnos: FunctionComponent = () => {
  const { pollingOptions } = useContext(PollingOptions);

  const { loading, error, data, refetch, stopPolling } = useQuery(GET_TURNS, {
    pollInterval: 3000,
  });

  if (!pollingOptions.shouldPoll) {
    stopPolling(); // Prevent errors on username change
  }
  const [userId, setUserId] = useState<null | string>(null);

  const getUserId = async () => {
    await AsyncStorage.getItem("USER_ID").then((id) => setUserId(id));
  };

  useEffect(() => {
    getUserId();
  }, []);

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return null;
  }

  if (pollingOptions.shouldPoll) {
    console.log("Polling...");
    const getTurnPosition = (turn: TurnInterface): number => {
      return turn.store.properties.turns.findIndex((t) => t.id === turn.id);
    };

    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.turnList}
          style={styles.turnList}
          data={data?.getTurnsForUser}
          renderItem={({ item }: { item: TurnInterface }) => (
            <Turno
              title={item.store.properties.name}
              queueLength={getTurnPosition(item)}
              turnId={item.id}
            ></Turno>
          )}
          keyExtractor={(turn: TurnInterface) => turn.id}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {
                try {
                  refetch();
                } catch (error) {
                  Alert.alert(
                    "Error",
                    "Please check your internet connection."
                  );
                }
              }}
            ></RefreshControl>
          }
          ListEmptyComponent={
            <View style={styles.listEmptyContainer}>
              <PrimaryText
                style={{
                  fontSize: 30,
                  fontWeight: "700",
                  color: colors.textColor,
                }}
              >
                Join a queue to start
              </PrimaryText>
              <PrimaryText
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: colors.iconColor,
                }}
              >
                or swipe down to refresh
              </PrimaryText>
            </View>
          }
        ></FlatList>
      </View>
    );
  }
  return null;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  turnList: {
    width: "95%",
    height: "100%",
    alignSelf: "center",
    padding: 5,
  },
  turnCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.iceWhite,
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
    paddingLeft: 10,
    borderLeftWidth: 1.5,
    borderLeftColor: colors.lightGray,
  },
  bigText: {
    fontSize: 36,
  },
  title: {
    fontSize: 16,
  },
  counterIndicator: {
    fontSize: 14,
  },
  crossIcon: {},
  iconHolder: {
    paddingRight: 10,
  },
  turnCancelLoader: {
    marginRight: 2.5,
  },
});

export default Turnos;
