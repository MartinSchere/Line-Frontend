import gql from "graphql-tag";

export const GET_STORE = gql`
  query {
    store {
      properties {
        name
        openingTime
        closingTime
      }
    }
  }
`;

export const FETCH_UNFULLFILLED_TURNS = gql`
  query {
    storeTurns(completed: false) {
      id
      creationTime
      user {
        fullName
      }
    }
  }
`;

export const FETCH_FULLFILLED_TURNS = gql`
  query {
    storeTurns(completed: true) {
      id
      creationTime
      completionTime
      fullfilledSuccessfully
      canceled
      userDidNotPresent
      user {
        fullName
      }
    }
  }
`;
