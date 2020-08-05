import gql from "graphql-tag";

export const LOGIN = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

export const REGISTER = gql`
  mutation createStore(
    $username: String!
    $password: String!
    $latitude: Float!
    $longitude: Float!
    $openingTime: DateTime!
    $closingTime: DateTime!
    $openingDays: [Weekdays]!
  ) {
    createStore(
      username: $username
      password: $password
      latitude: $latitude
      longitude: $longitude
      openingTime: $openingTime
      closingTime: $closingTime
      openingDays: $openingDays
    ) {
      store {
        properties {
          name
        }
      }
    }
  }
`;
export const CANCEL_TURN = gql`
  mutation cancelTurn($turnId: ID!) {
    cancelTurn(turnId: $turnId) {
      turn {
        id
      }
    }
  }
`;
export const FULLFILL_TURN = gql`
  mutation completeTurnSuccessfully($turnId: ID!) {
    completeTurnSuccessfully(turnId: $turnId) {
      turn {
        id
      }
    }
  }
`;
export const USER_DID_NOT_PRESENT = gql`
  mutation userDidNotPresent($turnId: ID!) {
    userDidNotPresent(turnId: $turnId) {
      turn {
        id
      }
    }
  }
`;
export const MODIFY_STORE = gql`
  mutation modifyStore($newName: String!) {
    modifyStore(newName: $newName) {
      store {
        properties {
          name
        }
      }
    }
  }
`;
