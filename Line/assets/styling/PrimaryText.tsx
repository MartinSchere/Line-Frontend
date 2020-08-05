import React, { FunctionComponent } from "react";
import { Text, TextStyle } from "react-native";

import { AppLoading } from "expo";

import { useFonts, Montserrat_500Medium } from "@expo-google-fonts/montserrat";

import colors from "./colors";

type CustomTextProps = {
  style?: TextStyle | TextStyle[];
};

const PrimaryText: FunctionComponent<CustomTextProps> = ({
  children,
  style,
}) => {
  let [fontsLoaded] = useFonts({
    Montserrat_500Medium,
  });

  const passedStyles = Array.isArray(style)
    ? Object.assign({}, ...style)
    : style;

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <Text
        style={[
          {
            fontFamily: "Montserrat_500Medium",
          },
          { ...passedStyles },
        ]}
      >
        {children}
      </Text>
    );
  }
};

export default PrimaryText;
