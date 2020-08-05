import React, { useState, useEffect, FunctionComponent } from "react";

import {
  StyleSheet,
  View,
  ImageBackground,
  Alert,
  Text,
  ActivityIndicator,
  AsyncStorage,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_STORE_DETAILS } from "../../graphql/Queries";
import { CREATE_TURN } from "../../graphql/Mutations";

import PrimaryText from "../../assets/styling/PrimaryText";
import Loader from "../../assets/animations/Loader";

import { Ionicons } from "@expo/vector-icons";
import colors from "../../assets/styling/colors";
import LottieView from "lottie-react-native";

import { TurnInterface } from "../../typescript/Interfaces";
import { StoreDetailProps } from "../../typescript/Types";

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
      onError: () => {
        Alert.alert("Error", "You're already in this queue");
      },
    }
  );

  const [userId, setUserId] = useState<null | string>(null);

  const getUserId = async () => {
    await AsyncStorage.getItem("USER_ID").then((id) => setUserId(id));
  };

  useEffect(() => {
    getUserId();
  }, []);

  const userHasActiveTurns = (data: any): boolean => {
    let check = false;
    data.searchStore.properties.turns.map((turn: TurnInterface) => {
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
              size={30}
              color={colors.iceWhite}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <View style={styles.content}>
        <PrimaryText style={styles.storeName}>{route.params.name}</PrimaryText>
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
        <MapView
          style={styles.map}
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
        {validating && <ActivityIndicator size={40} />}
        {data.searchStore.properties.isOpen &&
          !returnData &&
          !userHasActiveTurns(data) &&
          !validating && (
            <View>
              <PrimaryText style={styles.queueCounter}>
                {data.searchStore.properties.turns.length}
              </PrimaryText>
              <PrimaryText style={styles.queueCounterDescription}>
                People in the queue{" "}
              </PrimaryText>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  createTurn({
                    variables: { storeName: data.searchStore.properties.name },
                  });
                }}
              >
                <PrimaryText style={styles.buttonText}>JOIN QUEUE</PrimaryText>
              </TouchableOpacity>
            </View>
          )}
        {!data.searchStore.properties.isOpen && (
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
          data.searchStore.properties.isOpen &&
          !returnData &&
          !validating && (
            <View>
              <View style={styles.buttonDisabled}>
                <PrimaryText style={styles.buttonText}>JOIN QUEUE</PrimaryText>
              </View>
              <PrimaryText style={styles.errorWarning}>
                You're already in this queue
              </PrimaryText>
            </View>
          )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    position: "absolute",
    bottom: 0,
    height: "70%",
    width: "100%",
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
    textAlign: "center",
    fontSize: 16,
    margin: 7,
  },
  map: {
    margin: 10,
    height: "40%",
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
