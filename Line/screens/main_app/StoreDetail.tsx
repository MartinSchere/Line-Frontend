import React, { useState, useEffect, FunctionComponent } from "react";

import {
  StyleSheet,
  View,
  ImageBackground,
  Alert,
  ActivityIndicator,
  AsyncStorage,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { TouchableOpacity } from "react-native-gesture-handler";
import Draggable from "../../components/Draggable";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_STORE_DETAILS } from "../../graphql/Queries";
import { CREATE_TURN } from "../../graphql/Mutations";

import PrimaryText from "../../assets/styling/PrimaryText";
import Loader from "../../assets/animations/Loader";

import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../assets/styling/ConstantStyles";
import LottieView from "lottie-react-native";

import { TurnInterface } from "../../typescript/Interfaces";
import { StoreDetailProps } from "../../typescript/Types";

const parseOpeningDays = (openingDays: string): string => {
  // Some ugly string parsing...
  let output = "";
  const openingDayList = openingDays.split(", ");
  const daysOfTheWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  if (openingDayList.length === 7) {
    output = "Open every day";
  } else if (openingDays === "Monday, Tuesday, Wednesday, Thursday, Friday") {
    output = "Open all weekdays";
  } else if (openingDayList.length === 6) {
    openingDayList.forEach((d) => {
      !(d in daysOfTheWeek) && (output = `Open every day but ${d}`);
    });
  } else {
    output = `Open on ${openingDays}`;
  }
  return output;
};

const StoreDetail: FunctionComponent<StoreDetailProps> = ({
  route,
  navigation,
}) => {
  const { loading, error, data } = useQuery(GET_STORE_DETAILS, {
    variables: { name: route.params.name },
    pollInterval: 3000,
    onError: () => {
      Alert.alert("Error", "Please check your internet connection");
    },
  });

  const [createTurn, { loading: validating, data: returnData }] = useMutation(
    CREATE_TURN,
    {
      onError: (e) => {
        Alert.alert("Error", e.message.replace("GraphQL error:", ""));
      },
    }
  );

  const [userId, setUserId] = useState<null | string>(null);

  const [draggableShouldWork, setDraggableShouldWork] = useState(true);

  const getUserId = async () => {
    await AsyncStorage.getItem("USER_ID").then((id) => setUserId(id));
  };

  useEffect(() => {
    getUserId();
  }, []);

  const userHasActiveTurns = (data: any /* check type ann. */): boolean => {
    let check = false;
    data.storeDetail.properties.turns.map((turn: TurnInterface) => {
      if (turn.user.user.id === userId) {
        check = true;
      }
    });
    return check;
  };

  if (loading) {
    return <Loader />;
  }
  if (error) {
    Alert.alert("Error", "Please check your internet connection");
    return null;
  }

  const arrowIconSize = 36;
  const y = 150;

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        source={require("../../assets/images/SampleStore.jpg")}
      >
        <View style={{ alignItems: "flex-start" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons
              style={styles.backIcon}
              name="md-arrow-round-back"
              size={arrowIconSize}
              color={colors.iceWhite}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <Draggable
        disabled={!draggableShouldWork}
        x={0}
        maxX={0}
        minX={0}
        y={y}
        minY={-(y / 2)}
        maxY={Dimensions.get("screen").height}
      >
        <View style={styles.content}>
          <PrimaryText style={styles.storeName}>
            {route.params.name}
          </PrimaryText>
          <View style={styles.schedule}>
            <Ionicons
              style={styles.clockIcon}
              name="md-time"
              size={30}
              color={colors.iconColor}
            />
            <PrimaryText style={styles.scheduleIndicator}>
              {route.params.openingTime.slice(0, 5)} {" - "}
              {route.params.closingTime.slice(0, 5)}
            </PrimaryText>
          </View>
          {route.params.averageWaitTime !== null && (
            <View style={styles.schedule}>
              <PrimaryText style={styles.scheduleIndicator}>
                {`Average waiting time: ${route.params.averageWaitTime} minutes`}
              </PrimaryText>
            </View>
          )}
          <View style={styles.dayIndicator}>
            <Ionicons
              style={styles.clockIcon}
              name="md-calendar"
              size={30}
              color={colors.iconColor}
            />
            <PrimaryText style={styles.scheduleIndicator}>
              {parseOpeningDays(route.params.openingDays)}
            </PrimaryText>
          </View>
          <MapView
            style={styles.map}
            onTouchStart={() => {
              setDraggableShouldWork(false);
            }}
            onTouchEnd={() => setDraggableShouldWork(true)}
            initialRegion={{
              latitude: route.params.latitude,
              longitude: route.params.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: route.params.latitude,
                longitude: route.params.longitude,
              }}
            />
          </MapView>
          {returnData && (
            <LottieView
              style={styles.successAnimation}
              source={require("../../assets/animations/success_animation_lottie.json")}
              autoPlay
              loop={false}
              speed={1.5}
            ></LottieView>
          )}
          {validating && (
            <ActivityIndicator
              style={{ marginTop: 14, paddingTop: 2 }}
              size={55}
              color={colors.successColor}
            />
          )}
          {data.storeDetail.properties.isOpen &&
            !returnData &&
            !userHasActiveTurns(data) &&
            !validating && (
              <View>
                <PrimaryText style={styles.queueCounter}>
                  {data.storeDetail.properties.turns.length}
                </PrimaryText>
                <PrimaryText style={styles.queueCounterDescription}>
                  {data.storeDetail.properties.turns.length === 1
                    ? "Person in the line"
                    : "People in the line"}
                </PrimaryText>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    createTurn({
                      variables: {
                        storeName: data.storeDetail.properties.name,
                      },
                    });
                  }}
                >
                  <PrimaryText style={styles.buttonText}>
                    JOIN QUEUE
                  </PrimaryText>
                </TouchableOpacity>
              </View>
            )}
          {!data.storeDetail.properties.isOpen && (
            <View>
              <View style={styles.buttonDisabled}>
                <PrimaryText style={styles.buttonText}>JOIN QUEUE</PrimaryText>
              </View>
              <PrimaryText style={styles.errorWarning}>
                The store is not open
              </PrimaryText>
            </View>
          )}
          {userHasActiveTurns(data) &&
            data.storeDetail.properties.isOpen &&
            !returnData &&
            !validating && (
              <View>
                <View style={styles.buttonDisabled}>
                  <PrimaryText style={styles.buttonText}>
                    JOIN QUEUE
                  </PrimaryText>
                </View>
                <PrimaryText style={styles.errorWarning}>
                  You're already in this queue
                </PrimaryText>
              </View>
            )}
        </View>
      </Draggable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    width: Dimensions.get("screen").width,
    paddingTop: 20,

    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    alignItems: "center",
    backgroundColor: "white",
  },
  storeName: {
    textAlign: "center",
    fontSize: 30,
    margin: 7,
  },
  schedule: {
    flexDirection: "row",
    alignItems: "center",
  },
  scheduleIndicator: {
    maxWidth: "80%",
    textAlign: "center",
    fontSize: 16,
    margin: 7,
  },
  dayIndicator: {
    alignItems: "center",
    shadowColor: "#000",
    backgroundColor: colors.darkerWhite,
    borderRadius: 10,
    margin: 10,
    padding: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  map: {
    margin: 10,
    zIndex: 999,
    height: "35%",
    width: "100%",
  },
  image: {
    flex: 0.5,
    opacity: 0.7,
  },
  button: {
    backgroundColor: colors.lightBlue,
    padding: 7,
    marginTop: 10,
    borderRadius: 15,
    zIndex: 99,
  },
  buttonDisabled: {
    alignItems: "center",
    backgroundColor: colors.lightGray,
    padding: 7,
    marginTop: 10,
    borderRadius: 15,
  },
  errorMsg: {
    textAlign: "center",
    fontSize: 30,
    margin: 7,
  },
  errorWarning: {
    color: colors.warning,
    fontSize: 14,
    margin: 5,
  },
  queueCounter: {
    textAlign: "center",
    color: colors.iconColor,
    fontSize: 30,
    margin: 3,
  },
  queueCounterDescription: {
    textAlign: "center",
    color: colors.iconColor,
    fontSize: 16,
  },
  buttonText: {
    textAlign: "center",
    color: colors.iceWhite,
    fontSize: 16,
  },
  successAnimation: {
    width: "20%",
  },
  backIcon: {
    marginLeft: 10,
    marginTop: 10,
  },
  clockIcon: {},
});

export default StoreDetail;
