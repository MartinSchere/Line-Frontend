import React, { FunctionComponent, useState } from "react";
import Constants from "expo-constants";

import Login from "./screens/authentication/Login";
import Register from "./screens/authentication/Register";
import AuthLoadingScreen from "./screens/authentication/AuthLoading";
import StoreDetail from "./screens/main_app/StoreDetail";
import Stores from "./screens/main_app/Stores";
import Turnos from "./screens/main_app/MisTurnos";
import User from "./screens/main_app/User";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  AppStackParamList,
  AuthStackParamList,
  RootStackParamList,
  StoreStackParamList,
} from "./typescript/Types";

import { colors } from "./assets/styling/ConstantStyles";
import { Ionicons } from "@expo/vector-icons";
import Header from "./components/Header";
import { PollingOptions, DefaultValue } from "./context/PollingOptions";

const AuthStack = createStackNavigator<AuthStackParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

// MAIN-APP STACK
const StoreStack = createStackNavigator<StoreStackParamList>();
const AppStack = createBottomTabNavigator<AppStackParamList>();

const StoreStackComponent: FunctionComponent = () => {
  return (
    <StoreStack.Navigator initialRouteName="Stores">
      <StoreStack.Screen
        name="StoreDetail"
        component={StoreDetail}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="Stores"
        component={Stores}
        options={{ headerShown: false }}
      />
    </StoreStack.Navigator>
  );
};
const AppStackComponent: FunctionComponent = () => {
  const [pollingOptions, setPollingOptions] = useState(
    DefaultValue.pollingOptions
  );
  return (
    // Provider
    <PollingOptions.Provider value={{ pollingOptions, setPollingOptions }}>
      <AppStack.Navigator
        tabBarOptions={{
          showLabel: false,
          style: { backgroundColor: colors.iceWhite },
        }}
      >
        <AppStack.Screen
          name="Turnos"
          component={Turnos}
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
          component={StoreStackComponent}
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
        <AppStack.Screen
          name="User"
          component={User}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="md-person"
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
    </AuthStack.Navigator>
  );
};

const RootStackComponent: FunctionComponent = () => {
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

export default RootStackComponent;
