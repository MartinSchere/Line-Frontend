import gql from "graphql-tag";

export const MODIFY_USER = gql`
  mutation modifyUser($newName: String!) {
    modifyUser(newName: $newName) {
      user {
        fullName
      }
    }
  }
`;

export const CREATE_TURN = gql`
  mutation createTurn($storeName: String!) {
    createTurn(storeName: $storeName) {
      turn {
        id
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

export const LOGIN = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
      user {
        id
      }
    }
  }
`;
export const REGISTER = gql`
  mutation createUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      user {
        id
      }
    }
  }
`;
