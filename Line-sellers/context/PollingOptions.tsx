import { createContext } from "react";

type State = { shouldPoll: boolean };

export const DefaultValue = {
  pollingOptions: { shouldPoll: true },
  setPollingOptions: (pollingOptions: State) => {},
};

export const PollingOptions = createContext(DefaultValue);
