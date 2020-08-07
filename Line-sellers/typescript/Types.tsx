import { GestureResponderEvent, ViewStyle } from "react-native";
import { DayInterface } from "./Interfaces";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

//Stacks
export type RootStackParamList = {
  MisTurnos: undefined;
  Login: { message: string } | undefined;
  AuthLoading: undefined;
};
export type AuthStackParamList = {
  Login: { message: string } | undefined;
  Register: { message: string } | undefined;
  MapSelectLocation: { username: string; password: string };
  ScheduleSelect: {
    username: string;
    password: string;
    latitude: number;
    longitude: number;
  };
  AuthRegisterStore: {
    username: string;
    password: string;
    latitude: number;
    longitude: number;
    days: string[];
    openingTime: Date;
    closingTime: Date;
  };
};

export type TurnStackNavigationParamList = {
  MisTurnos: undefined;
  TurnHistory: undefined;
};

export type AppStackParamList = {
  Turnos: undefined;
  Stores: undefined;
};

type StoresNavigationProps = StackNavigationProp<RootStackParamList>;

export type StoresProps = {
  navigation: StoresNavigationProps;
};

export type DayProps = {
  onPress: (event: GestureResponderEvent) => void;
  selected: boolean;
  day: string;
};
export type DaySelectorProps = {
  onChange: Function;
};
export type DaySelectorState = {
  selectedItems: undefined | DayInterface[];
  items: DayInterface[];
};

export type FadeInViewProps = {
  style?: ViewStyle | ViewStyle[];
};

// Screens
type LoginNavigationProps = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, "Login">,
  StackNavigationProp<AuthStackParamList, "Login">
>;

type LoginRouteProps = RouteProp<RootStackParamList, "Login">;

export type LoginProps = {
  route: LoginRouteProps;
  navigation: LoginNavigationProps;
};

type RegisterNavigationProps = StackNavigationProp<
  AuthStackParamList,
  "Register"
>;

type RegisterRouteProps = RouteProp<AuthStackParamList, "Register">;

export type RegisterProps = {
  route: RegisterRouteProps;
  navigation: RegisterNavigationProps;
};

type AuthLoadingNavigationProps = StackNavigationProp<
  RootStackParamList,
  "AuthLoading"
>;
export type AuthLoadingProps = {
  navigation: AuthLoadingNavigationProps;
};

type AuthRegisterStoreNavigationProps = CompositeNavigationProp<
  StackNavigationProp<RootStackParamList, "Login">,
  StackNavigationProp<AuthStackParamList, "AuthRegisterStore">
>;

type AuthRegisterStoreRouteProps = RouteProp<
  AuthStackParamList,
  "AuthRegisterStore"
>;

export type AuthRegisterStoreProps = {
  route: AuthRegisterStoreRouteProps;
  navigation: AuthRegisterStoreNavigationProps;
};

type MapSelectLocationNavigationProps = StackNavigationProp<
  AuthStackParamList,
  "MapSelectLocation"
>;

type MapSelectLocationRouteProps = RouteProp<
  AuthStackParamList,
  "MapSelectLocation"
>;

export type MapSelectLocationStoreProps = {
  route: MapSelectLocationRouteProps;
  navigation: MapSelectLocationNavigationProps;
};

type ScheduleSelectNavigationProps = StackNavigationProp<
  AuthStackParamList,
  "ScheduleSelect"
>;

type ScheduleSelectRouteProps = RouteProp<AuthStackParamList, "ScheduleSelect">;

export type ScheduleSelectProps = {
  route: ScheduleSelectRouteProps;
  navigation: ScheduleSelectNavigationProps;
};

export type TurnoProps = {
  turnId: string;
  userFullName: string;
  creationTime: string;
  completionTime?: string;
  canceled?: boolean;
  fullfilledSuccessfully?: boolean;
  userDidNotPresent?: boolean;
};

type TurnosNavigationProps = CompositeNavigationProp<
  StackNavigationProp<TurnStackNavigationParamList>,
  StackNavigationProp<RootStackParamList>
>;

export type TurnosProps = {
  navigation: TurnosNavigationProps;
};

type TurnHistoryNavigationProps = StackNavigationProp<
  TurnStackNavigationParamList
>;

export type TurnHistoryProps = {
  navigation: TurnHistoryNavigationProps;
};
