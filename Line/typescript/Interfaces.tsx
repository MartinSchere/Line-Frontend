export interface AuthUserInterface {
  id: string;
  username: string;
}

export interface UserInterface {
  id: string;
  fullName: number;
  user: AuthUserInterface;
  turns: TurnInterface[];
}
interface Store {
  name: string;
  latitude: number;
  longitude: number;
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
  turns: TurnInterface[];
  user: AuthUserInterface;
}
interface geometry {
  type: any; // Not using this
  coordinates: number[];
}
export interface StoreInterface {
  geometry: geometry;
  properties: Store;
}
export interface TurnInterface {
  id: string;
  fullfilledSuccessfully: boolean;
  canceled: boolean;
  userDidNotPresent: boolean;
  user: UserInterface;
  store: StoreInterface;
}
