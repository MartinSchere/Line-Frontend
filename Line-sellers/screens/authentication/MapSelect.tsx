import React, { useState, useEffect, FunctionComponent } from "react";
import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";

import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import Loader from "../../assets/animations/Loader";
import { Ionicons } from "@expo/vector-icons";
import PrimaryText from "../../assets/styling/PrimaryText";
import colors from "../../assets/styling/Colors";

import { MapSelectLocationStoreProps } from "../../typescript/Types";

const MapSelectLocation: FunctionComponent<MapSelectLocationStoreProps> = ({
  route,
  navigation,
}) => {
  const [location, setLocation] = useState<Location.LocationData>(null);
  const [errorMsg, setErrorMsg] = useState<string>(null);

  const [adress, setAdress] = useState(null);
  const [coords, setCoords] = useState(null);

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [errorLoadingLoaction, setErrorLoadingLoaction] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Please allow the app to use location services.");
      }
      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
      setLocation(location);
    })();
  }, []);

  const _getSelectedMapLocation = async (location: Region) => {
    setCoords(location);
    setLoadingLocation(true);

    await Location.reverseGeocodeAsync(location)
      .then((myAdress) => {
        if (myAdress.length === 0) {
          Alert.alert("Error", "Please check your internet connection.");
          setErrorLoadingLoaction(true);
        } else {
          setAdress(myAdress);
        }
      })
      .then(() => setLoadingLocation(false))
      .catch(() =>
        Alert.alert(
          "Low accuracy",
          "The device has low location accurracy. This can affect the registration process."
        )
      );
  };

  const prettifyAdress = (adress) => {
    if (adress) {
      let output = "";
      const object = adress[0];

      if (object?.street) {
        output += object.street;
      }
      if (object?.name) {
        output += ", " + object.name;
      }
      if (object?.city) {
        output += ", " + object.city;
      }
      if (object?.postalCode) {
        output += ", " + object.postalCode;
      }
      if (output.length > 35) {
        output = output.slice(0, 37) + "...";
      }
      return output;
    }
    return "...";
  };

  if (errorMsg) {
    Alert.alert(
      "Error",
      "Please allow Line to have location permissions to continue."
    );
    return null;
  }

  if (location) {
    let userLatitude = location.coords.latitude;
    let userLongitude = location.coords.longitude;

    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: userLatitude,
            longitude: userLongitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onRegionChangeComplete={(mapRegion) =>
            _getSelectedMapLocation(mapRegion)
          }
        ></MapView>
        <Ionicons
          name="md-pin"
          size={40}
          color={"red"}
          style={styles.locationPointer}
        />
        <View style={styles.bottomInfo}>
          <View style={styles.addressPreview}>
            {adress ? (
              <PrimaryText style={styles.adress}>
                {prettifyAdress(adress)}
              </PrimaryText>
            ) : (
              <ActivityIndicator size={20} color={colors.iceWhite} />
            )}
          </View>
          {loadingLocation ? (
            <TouchableOpacity style={styles.buttonDisabled} disabled={true}>
              <ActivityIndicator size={20} color={colors.iceWhite} />
            </TouchableOpacity>
          ) : !errorLoadingLoaction ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("ScheduleSelect", {
                  username: route.params.username,
                  password: route.params.password,
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                })
              }
            >
              <PrimaryText style={styles.nextBtnText}>NEXT</PrimaryText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.buttonDisabled} disabled={true}>
              <PrimaryText style={styles.nextBtnText}>ERROR</PrimaryText>
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
    flexDirection: "column",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  mapStyle: { width: "100%", height: "85%" },
  locationPointer: {
    zIndex: 9999,
    position: "absolute",
    alignSelf: "center",
    marginBottom: "30%",
  },
  bottomInfo: {
    justifyContent: "center",
    backgroundColor: colors.iceWhite,
    height: "15%",
    width: "100%",
  },
  button: {
    alignSelf: "flex-end",
    minWidth: 100,
    minHeight: 30,
    marginRight: 10,
    backgroundColor: colors.lightBlue,
    padding: 7,
    borderRadius: 15,
  },
  buttonDisabled: {
    alignSelf: "flex-end",
    alignItems: "center",
    minWidth: 100,
    minHeight: 30,
    marginRight: 10,
    backgroundColor: colors.lightGray,
    padding: 7,
    borderRadius: 15,
  },
  addressPreview: {
    marginLeft: 10,
    position: "absolute",
    alignSelf: "flex-start",
  },
  adress: {
    color: colors.iconColor,
    textAlign: "center",
  },
  nextBtnText: {
    color: colors.iceWhite,
    textAlign: "center",
  },
});
export default MapSelectLocation;
