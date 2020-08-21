import React, { FunctionComponent } from "react";

import {
  View,
  StyleSheet,
  RefreshControl,
  Alert,
  Dimensions,
} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

import { useQuery } from "@apollo/react-hooks";
import { FETCH_FULLFILLED_TURNS } from "../../graphql/Queries";

import { Ionicons } from "@expo/vector-icons";
import PrimaryText from "../../assets/styling/PrimaryText";
import { colors } from "../../assets/styling/ConstantStyles";
import Loader from "../../assets/animations/Loader";

import { TurnInterface } from "../../typescript/Interfaces";
import { TurnoProps, TurnHistoryProps } from "../../typescript/Types";

const Turno: FunctionComponent<TurnoProps> = (props) => {
  return (
    <View style={styles.turnCard}>
      <View style={styles.cardInfo}>
        <View style={styles.turnInfo}>
          <PrimaryText style={{ fontSize: 24 }} variant={"bold"}>
            {props.userFullName}
          </PrimaryText>
          <PrimaryText>Created at {props.creationTime.slice(0, 5)}</PrimaryText>
          <PrimaryText>
            Closed at {props.completionTime.slice(0, 5)}
          </PrimaryText>
        </View>
      </View>
      <View>
        {props.fullfilledSuccessfully && (
          <View style={styles.status}>
            <PrimaryText style={{ color: colors.successColor }}>
              No problems
            </PrimaryText>
          </View>
        )}
        {props.canceled && (
          <View style={styles.status}>
            <PrimaryText style={{ color: colors.warning }}>
              Cancelled
            </PrimaryText>
          </View>
        )}
        {props.userDidNotPresent && (
          <View style={styles.status}>
            <PrimaryText style={{ color: "yellow" }}>
              User did not present
            </PrimaryText>
          </View>
        )}
      </View>
    </View>
  );
};

const TurnHistory: FunctionComponent<TurnHistoryProps> = ({ navigation }) => {
  const { loading, error, data, refetch } = useQuery(FETCH_FULLFILLED_TURNS, {
    onError: () => {},
    pollInterval: 3000,
  });
  if (loading) {
    return <Loader />;
  }
  if (error) {
    Alert.alert(String(error));
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name={"md-arrow-back"}
            color={colors.iconColor}
            size={30}
            style={{ margin: 10 }}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.turnList}
        contentContainerStyle={{ flexGrow: 1 }}
        data={data.storeTurns}
        renderItem={({ item }: { item: TurnInterface }) => (
          <Turno
            turnId={item.id}
            userFullName={item.user.fullName}
            creationTime={item.creationTime}
            fullfilledSuccessfully={item.fullfilledSuccessfully}
            canceled={item.canceled}
            userDidNotPresent={item.userDidNotPresent}
            completionTime={item.completionTime}
          />
        )}
        keyExtractor={(turn: TurnInterface) => turn.id}
        ListEmptyComponent={
          <View style={styles.listEmptyContainer}>
            <PrimaryText
              style={{
                fontSize: 24,
                color: colors.textColor,
              }}
              variant={"bold"}
            >
              There's nobody here yet...
            </PrimaryText>
            <PrimaryText
              style={{
                fontSize: 12,
                color: colors.iconColor,
              }}
              variant={"bold"}
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
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  headerWrapper: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  turnList: {
    width: "100%",
    alignSelf: "center",
    padding: 5,
  },
  turnCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  turnInfo: {
    flexGrow: 0.3,
    marginBottom: 5,
  },
  cardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    borderLeftWidth: 1.5,
    borderLeftColor: colors.lightGray,
  },
  listEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    margin: 3.5,
  },
});

export default TurnHistory;
