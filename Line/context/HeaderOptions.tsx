import { createContext } from "react";

type State = { showHeader: boolean };

export const InitialHeader = {
  headerOptions: { showHeader: true },
  setHeaderOptions: (headerOptions: State) => {},
};

export const HeaderOptions = createContext(InitialHeader);
