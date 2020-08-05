import React, { useState, useEffect, FunctionComponent } from "react";

import { StyleSheet, Text, View, Image, Alert } from "react-native";
import {
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native-gesture-handler";
import * as Location from "expo-location";

import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_NEARBY_STORES } from "../../graphql/Queries";

import colors from "../../assets/styling/colors";
import PrimaryText from "../../assets/styling/PrimaryText";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../../assets/animations/Loader";

import { StoreProps, StoresProps } from "../../typescript/Types";
import { StoreInterface } from "../../typescript/Interfaces";

const Store: FunctionComponent<StoreProps> = (props) => {
  return (
    <TouchableOpacity style={styles.storeCard} onPress={props.onPress}>
      <PrimaryText style={styles.storeName}>{props.title}</PrimaryText>
    </TouchableOpacity>
  );
};

const Stores: FunctionComponent<StoresProps> = ({ navigation }) => {
  const [location, setLocation]: [
    Location.LocationData | undefined,
    Function
  ] = useState();

  const { loading, data, error } = useQuery(GET_NEARBY_STORES, {
    skip: !location,
    variables: {
      lat: location?.coords.latitude,
      lng: location?.coords.longitude,
    },
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Couldn't verify your location",
          'Please allow this app to use location in your phone. If this didn\'t work, enable "high accuracy mode" in settings.'
        );
        return null;
      }
      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });
      setLocation(location);
    })();
  }, []);

  if (location) {
    if (loading) {
      return <Loader />;
    }

    if (error) {
      Alert.alert("Error", "Please check your internet connection.");
      return null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <PrimaryText style={styles.title}>Nearby stores</PrimaryText>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="md-search"
              size={22}
              color={colors.lightGray}
              style={{ marginLeft: 5 }}
            />
            <TextInput
              value={search}
              onChangeText={(search) => setSearch(search)}
              placeholder={"search a store"}
              style={styles.input}
              maxLength={35}
            />
          </View>
        </View>
        <FlatList
          data={data.nearbyStores}
          style={styles.storeList}
          renderItem={({ item }: { item: StoreInterface }) => (
            <Store
              title={item.properties.name}
              onPress={() =>
                navigation.navigate("StoreDetail", {
                  name: item.properties.name,
                  latitude: item.geometry.coordinates[0],
                  longitude: item.geometry.coordinates[1],
                  openingTime: item.properties.openingTime,
                  closingTime: item.properties.closingTime,
                })
              }
            />
          )}
          keyExtractor={(_store, index) => String(index)}
        ></FlatList>
      </View>
    );
  }
  return <Loader />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  storeList: {
    paddingTop: 10,
    flex: 1,
  },
  storeCard: {
    flexBasis: "47%",
    flexGrow: 0,
    padding: 20,
    margin: 5,
    borderRadius: 15,
    flex: 1,
    backgroundColor: colors.iceWhite,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.23,
    shadowRadius: 4.65,
    elevation: 7,
    marginBottom: 10,
  },
  storeName: {
    fontSize: 20,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textColor,
    margin: 12.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.iceWhite,
    paddingLeft: 10,
    paddingRight: 10,
    padding: 5,
    shadowColor: "#000",
    marginTop: 7,
    marginRight: 5,
    borderRadius: 25,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    backgroundColor: colors.iceWhite,
    color: colors.textColor,
    padding: 5,
    marginRight: 10,
    paddingLeft: 10,
    width: 110,
  },
});

export default Stores;
