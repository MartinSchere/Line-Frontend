import gql from "graphql-tag";

export const GET_USER = gql`
  query {
    user {
      id
      fullName
    }
  }
`;

export const GET_NEARBY_STORES = gql`
  query nearbyStores($lat: Float!, $lng: Float!) {
    nearbyStores(lat: $lat, lng: $lng) {
      properties {
        name
        openingTime
        closingTime
      }
      geometry {
        coordinates
      }
    }
  }
`;

export const GET_STORE_DETAILS = gql`
  query searchStore($name: String!) {
    searchStore(name: $name) {
      geometry {
        coordinates
      }
      properties {
        name
        openingTime
        closingTime
        isOpen
        openingDays
        turns {
          user {
            user {
              id
              username
            }
          }
        }
      }
    }
  }
`;
export const GET_TURNS = gql`
  query {
    getTurnsForUser {
      id
      store {
        properties {
          name
          turns {
            id
          }
        }
      }
    }
  }
`;
