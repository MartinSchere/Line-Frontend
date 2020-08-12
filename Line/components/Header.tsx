import React from "react";
import Constants from "expo-constants";
import { View } from "react-native";

import colors from "../assets/styling/ConstantStyles";
import Logo from "../assets/Logo";

const Header = () => {
  return (
    <View
      style={{
        marginTop: Constants.statusBarHeight,
        flex: 1,
        backgroundColor: colors.purple,
        alignItems: "flex-start",
        position: "relative",
      }}
    >
      <Logo
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </View>
  );
};

export default Header;
