import { createContext } from "react";

type State = { shouldPoll: boolean };

export const InitialPolling = {
  pollingOptions: { shouldPoll: true },
  setPollingOptions: (pollingOptions: State) => {},
};

export const PollingOptions = createContext(InitialPolling);
