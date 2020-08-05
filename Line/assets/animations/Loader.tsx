import React, { FunctionComponent } from "react";
import { View, Image, StyleSheet } from "react-native";

const Loader: FunctionComponent = () => {
  return (
    <View style={styles.imageWrapper}>
      <Image
        style={styles.loader}
        source={require("../images/loader.gif")}
      ></Image>
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  loader: {
    maxWidth: 120,
    maxHeight: 120,
  },
});

export default Loader;
