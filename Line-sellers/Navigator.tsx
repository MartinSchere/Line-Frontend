import React, { FunctionComponent, useState } from "react";

import Constants from "expo-constants";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Login from "./screens/authentication/Login";
import Register from "./screens/authentication/Register";
import MapSelectLocation from "./screens/authentication/MapSelect";
import ScheduleSelect from "./screens/authentication/ScheduleSelect";
import AuthRegisterStore from "./screens/authentication/AuthRegisterStore";
import AuthLoadingScreen from "./screens/authentication/AuthLoading";

import { colors } from "./assets/styling/ConstantStyles";
import { Ionicons } from "@expo/vector-icons";

import {
  AppStackParamList,
  AuthStackParamList,
  RootStackParamList,
  TurnStackNavigationParamList,
} from "./typescript/Types";
import Turnos from "./screens/main-app/MisTurnos";
import TurnHistory from "./screens/main-app/TurnHistory";
import Stores from "./screens/main-app/Stores";
import Header from "./components/Header";
import { PollingOptions, DefaultValue } from "./context/PollingOptions";

const AuthStack = createStackNavigator<AuthStackParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

const AppStack = createBottomTabNavigator<AppStackParamList>();
const TurnStack = createStackNavigator<TurnStackNavigationParamList>();

const TurnStackComponent: FunctionComponent = () => {
  return (
    <TurnStack.Navigator initialRouteName="MisTurnos">
      <TurnStack.Screen name="MisTurnos" component={Turnos} />
      <TurnStack.Screen name="TurnHistory" component={TurnHistory} />
    </TurnStack.Navigator>
  );
};
const AppStackComponent: FunctionComponent = () => {
  const [pollingOptions, setPollingOptions] = useState(
    DefaultValue.pollingOptions
  );
  return (
    <PollingOptions.Provider value={{ pollingOptions, setPollingOptions }}>
      <AppStack.Navigator
        tabBarOptions={{
          showLabel: false,
          style: { backgroundColor: colors.iceWhite },
        }}
      >
        <AppStack.Screen
          name="Turnos"
          component={TurnStackComponent}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="md-checkbox"
                size={20}
                color={focused ? colors.lightBlue : colors.iconColor}
              />
            ),
          }}
        />
        <AppStack.Screen
          name="Stores"
          component={Stores}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="md-basket"
                size={20}
                color={focused ? colors.lightBlue : colors.iconColor}
              />
            ),
          }}
        />
      </AppStack.Navigator>
    </PollingOptions.Provider>
  );
};

const AuthStackComponent: FunctionComponent = () => {
  return (
    <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="MapSelectLocation"
        component={MapSelectLocation}
        options={{ title: "Select your store's location" }}
      />
      <AuthStack.Screen
        name="ScheduleSelect"
        component={ScheduleSelect}
        options={{ title: "Select your opening hours" }}
      />
      <AuthStack.Screen
        name="AuthRegisterStore"
        component={AuthRegisterStore}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
};

const RootStackNavigator: FunctionComponent = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="AuthLoading">
        <RootStack.Screen
          name="MisTurnos"
          component={AppStackComponent}
          options={{
            headerStyle: {
              height: Constants.statusBarHeight * 3.25,
            },
            headerBackground: () => <Header />,
            headerTitle: "",
          }}
        />
        <RootStack.Screen
          name="Login"
          component={AuthStackComponent}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="AuthLoading"
          component={AuthLoadingScreen}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default RootStackNavigator;
