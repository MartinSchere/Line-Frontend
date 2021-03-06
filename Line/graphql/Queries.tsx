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
        openingDays
        averageWaitTime
      }
      geometry {
        coordinates
      }
    }
  }
`;
export const SEARCH_STORE = gql`
  query searchStore($query: String!, $lat: Float!, $lng: Float!) {
    searchStore(query: $query, lat: $lat, lng: $lng) {
      properties {
        name
        openingTime
        closingTime
        openingDays
        averageWaitTime
      }
      geometry {
        coordinates
      }
    }
  }
`;

export const GET_STORE_DETAILS = gql`
  query storeDetail($name: String!) {
    storeDetail(name: $name) {
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
