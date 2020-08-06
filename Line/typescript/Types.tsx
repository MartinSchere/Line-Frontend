import { StackNavigationProp } from "@react-navigation/stack";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { ViewStyle, GestureResponderEvent } from "react-native";

// Stacks
export type AuthStackParamList = {
  Login: { message: string } | undefined;
  Register: undefined;
};
export type RootStackParamList = {
  MisTurnos: undefined;
  Login: { message: string } | undefined;
  AuthLoading: undefined;
};
export type AppStackParamList = {
  Turnos: undefined;
  Stores: undefined;
  User: undefined;
};
export type StoreStackParamList = {
  Stores: undefined;
  StoreDetail: {
    name: string;
    latitude: number;
    longitude: number;
    openingTime: string;
    closingTime: string;
    openingDays: string;
  };
};

// Screens
//
// AUTH-STACK: LOGIN
type LoginNavigationProps = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, "Login">,
  StackNavigationProp<AuthStackParamList, "Login">
>;

type LoginRouteProps = RouteProp<RootStackParamList, "Login">;

export type LoginProps = {
  route: LoginRouteProps;
  navigation: LoginNavigationProps;
};

// AUTH-STACK: REGISTER
type RegisterNavigationProps = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamList, "Register">,
  StackNavigationProp<RootStackParamList, "MisTurnos">
>;

export type RegisterProps = {
  navigation: RegisterNavigationProps;
};

// AUTH-STACK: AUTH-LOADING
type AuthLoadingNavigationProps = StackNavigationProp<
  RootStackParamList,
  "AuthLoading"
>;
export type AuthLoadingProps = {
  navigation: AuthLoadingNavigationProps;
};

// MAIN-APP-STACK: LINE
export type FadeInViewProps = {
  style?: ViewStyle | ViewStyle[];
};

export type TurnoProps = {
  turnId: string;
  title: string;
  queueLength: number;
};

// MAIN-APP-STACK: STORES
export type StoreProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
};
export type StoresProps = {
  navigation: StoresNavigationProps;
};

// MAIN-APP-STACK: STORE-DETAIL
type StoreDetailNavigationProps = StackNavigationProp<
  StoreStackParamList,
  "StoreDetail"
>;

type StoresNavigationProps = StackNavigationProp<StoreStackParamList, "Stores">;

type StoreDetailRouteProps = RouteProp<StoreStackParamList, "StoreDetail">;

export type StoreDetailProps = {
  route: StoreDetailRouteProps;
  navigation: StoreDetailNavigationProps;
};

// MAIN-APP-STACK: USER
type UserNavigationProps = StackNavigationProp<RootStackParamList>;

export type UserProps = {
  navigation: UserNavigationProps;
};
