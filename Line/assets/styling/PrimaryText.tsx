import React, { FunctionComponent } from "react";
import { Text, TextStyle } from "react-native";

import { AppLoading } from "expo";

import {
  useFonts,
  Montserrat_500Medium,
  Montserrat_800ExtraBold,
} from "@expo-google-fonts/montserrat";

import { colors } from "./ConstantStyles";

type CustomTextProps = {
  style?: TextStyle | TextStyle[];
  variant?: string;
};

const PrimaryText: FunctionComponent<CustomTextProps> = ({
  children,
  style,
  variant,
}) => {
  let [fontsLoaded] = useFonts({
    Montserrat_500Medium,
    Montserrat_800ExtraBold,
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
            fontFamily:
              variant === "bold"
                ? "Montserrat_800ExtraBold"
                : "Montserrat_500Medium",
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
